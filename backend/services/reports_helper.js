const models = require("../models");

const fs = require("fs");
const { format } = require("@fast-csv/format");

const riskAppetite = 10000;

function roundToOneDecimal(value) {
  if (typeof value !== "number") return null;
  return Math.round(value * 10) / 10;
}

async function generateCSV(formatted, filePath = "./export.csv") {
  const CSV_COLUMNS = [
    "id",
    "assessmentId",
    "assessmentName",
    "orgId",
    "orgName",
    "businessUnitId",
    "businessUnit",
    "businessProcessId",
    "businessProcess",
    "assetId",
    "asset",
    "assetCategory",
    "riskScenarioId",
    "riskScenario",
    "riskScenarioCIAMapping",
    "financial",
    "financialMinRange",
    "financialMaxRange",
    "regulatory",
    "regulatoryMinRange",
    "regulatoryMaxRange",
    "reputational",
    "reputationalMinRange",
    "reputationalMaxRange",
    "operational",
    "operationalMinRange",
    "operationalMaxRange",
    "mitreControlsAndScores",
    "assessmentCreatedTimestamp",
    "assessmentUpdatedTimestamp",
  ];

  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath);

    const csvStream = format({
      headers: CSV_COLUMNS,
    })
      .on("finish", () => resolve(filePath))
      .on("error", reject);

    csvStream.pipe(ws);

    formatted.forEach((row) => {
      const outputRow = {};

      CSV_COLUMNS.forEach((col) => {
        let value = row[col];

        // Handle arrays and JSON properly
        if (col === "riskScenarioCIAMapping" && Array.isArray(value)) {
          value = value.join(",");
        }

        if (col === "mitreControlsAndScores") {
          value = JSON.stringify(value);
        }

        outputRow[col] = value ?? "";
      });

      csvStream.write(outputRow);
    });

    csvStream.end();
  });
}
function aggregateMitreControlsByAsset(assessmentProcesses) {
  const assetMap = new Map();

  // Helper to determine score (0 for null/undefined)
  const getScore = (responseValue) => {
    // null or undefined responseValue is treated as 0.
    return responseValue === null || responseValue === undefined
      ? 0
      : responseValue;
  };

  // --- 1. Pass 1: Identify the Latest Asset Record and Collect its Controls ---
  for (const process of assessmentProcesses) {
    for (const asset of process.assets) {
      const assetId = asset.id;
      const assetName = asset.applicationName;
      const assetCategory = asset.assetCategory;
      const assetModifiedDate = new Date(asset.modified_date);

      if (!assetName) continue;

      const existingAsset = assetMap.get(assetName);

      // Check if this asset record is newer than the one currently stored
      if (!existingAsset || assetModifiedDate > existingAsset.modified_date) {
        // --- This is the new latest asset record, so we overwrite the stored data ---

        const mitreControlScores = [];

        // Extract all Mitre Controls and their scores from the questionnaire
        for (const q of asset.questionnaire) {
          if (q.questionaire && q.questionaire.mitreControlId) {
            const score = getScore(q.responseValue);

            // A single questionnaire entry can cover multiple Mitre Controls
            for (const controlId of q.questionaire.mitreControlId) {
              mitreControlScores.push({
                id: controlId,
                score: score,
              });
            }
          }
        }

        // Store the latest asset's details and its complete set of controls
        assetMap.set(assetName, {
          assetId: assetId,
          assetCategory: assetCategory,
          modified_date: assetModifiedDate,
          // Use a Set to easily handle duplicates within this single asset's controls
          Controls: new Map(mitreControlScores.map((c) => [c.id, c.score])),
        });
      }
      // If the current asset record is older, we ignore it completely.
    }
  }

  // --- 2. Pass 2: Final Formatting ---
  const aggregatedAssets = [];
  for (const [assetName, assetRecord] of assetMap.entries()) {
    const formattedControls = [];

    // Convert the control map (which is already de-duplicated by ID) back into the required array of JSON objects
    for (const [id, score] of assetRecord["Controls"].entries()) {
      formattedControls.push({
        id: id,
        score: score,
      });
    }

    aggregatedAssets.push({
      assetId: assetRecord["assetId"],
      assetName: assetName,
      assetCategory: assetRecord["assetCategory"],
      mitreControlsAndScores: formattedControls,
    });
  }

  return aggregatedAssets;
}

function calculateAssetScoresForAll(assets) {
  if (!Array.isArray(assets)) {
    throw new Error("Input must be an array of assets");
  }

  return assets.map((asset) => calculateAssetScores(asset));
}

function calculateAssetScores(asset) {
  const CIA_TYPES = ["C", "I", "A"];

  // initialize totals
  const totals = {
    C: { num: 0, den: 0 },
    I: { num: 0, den: 0 },
    A: { num: 0, den: 0 },
    OVERALL: { num: 0, den: 0 },
  };

  for (const control of asset["mitreControlsAndScores"] || []) {
    const baseScore = control.score || 0;
    if (baseScore === -1) continue;

    for (const result of control.results || []) {
      const priority = result.controlPriority || 0;
      const typeScore = result.mitreControlType === "MITIGATION" ? 3 : 1;

      const weight = typeScore * priority;
      const weightedScore = baseScore * 2.5 * weight;

      // add to each CIA bucket the result applies to
      for (const cia of result.ciaMapping || []) {
        if (CIA_TYPES.includes(cia)) {
          console.log("adding value", weightedScore, weight);
          totals[cia].num += weightedScore;
          totals[cia].den += weight;
        }
      }

      // overall calculation includes ALL results, no CIA filtering
      totals.OVERALL.num += weightedScore;
      totals.OVERALL.den += weight;
    }
  }

  // final scores
  const finalScores = {
    assetId: asset["assetId"],
    assetName: asset["assetName"],
    assetCategory: asset["assetCategory"],
  };

  for (const type of CIA_TYPES) {
    console.log(totals[type].num, totals[type].den);
    finalScores[type] =
      totals[type].den === 0
        ? 0
        : Number((totals[type].num / totals[type].den).toFixed(2));
  }

  finalScores["OVERALL"] =
    totals.OVERALL.den === 0
      ? 0
      : Number((totals.OVERALL.num / totals.OVERALL.den).toFixed(2));

  return finalScores;
}
async function enrichMitreControlsByMitreThreatRecords(assetList) {
  // 1. Gather unique MITRE control IDs
  const allControlIds = [
    ...new Set(
      assetList.flatMap((asset) =>
        asset["mitreControlsAndScores"].map((c) => c.id)
      )
    ),
  ];

  // 2. Fetch all MITRE control rows
  const controlRecords = await models.MitreThreatControl.findAll({
    where: { mitreControlId: allControlIds },
    attributes: [
      "mitreControlId",
      "ciaMapping",
      "controlPriority",
      "mitreControlType",
    ],
  });

  // 3. Build lookup map: id → array of rows
  const controlMap = {};

  for (const record of controlRecords) {
    const id = record.mitreControlId;

    if (!controlMap[id]) {
      controlMap[id] = [];
    }

    controlMap[id].push({
      ciaMapping: record.ciaMapping,
      controlPriority: record.controlPriority,
      mitreControlType: record.mitreControlType,
    });
  }

  // 4. Enrich incoming assets
  const enrichedAssets = assetList.map((asset) => {
    const updatedControls = asset["mitreControlsAndScores"].map((control) => {
      const records = controlMap[control.id] || [];

      return {
        id: control.id,
        score: control.score,
        results: records, // <-- MULTIPLE RESULTS HERE
      };
    });

    return {
      ...asset,
      mitreControlsAndScores: updatedControls,
    };
  });

  return enrichedAssets;
}

function createFlatAssessmentMatrixFromProcesses(assessmentProcesses) {
  const flatData = [];

  // --- Iterating through each Assessment Process ---
  for (let process of assessmentProcesses) {
    process = process.toJSON();
    console.log(process);
    const assessmentName = process.assessment.assessmentName;
    const assessmentId = process.assessmentId;
    const orgId = process.assessment.orgId;
    const orgName = process.assessment.orgName;
    const buName = process.assessment.businessUnitName || "N/A";
    const buId = process.assessment.businessUnitId;
    const processName = process.processName;
    const processId = process.orgProcessId;
    const createdDate = process.createdDate;
    const modifiedDate = process.modifiedDate;
    const isDeleted = process.isDeleted;
    // Extract Mitre Control IDs and Score/Response for each Asset
    const assetDetails = process.assets.map((asset) => {
      const mitreControlScores = []; // Array to hold [{id: ..., score: ...}, ...]

      for (const q of asset.questionnaire) {
        if (q.questionaire && q.questionaire.mitreControlId) {
          // Determine the score, using 0 if responseValue is null or undefined
          const score =
            q.responseValue === null || q.responseValue === undefined
              ? 0
              : q.responseValue;

          // A single questionnaire entry can cover multiple Mitre Controls
          for (const controlId of q.questionaire.mitreControlId) {
            // Push the individual control and its score to the array
            mitreControlScores.push({
              id: controlId,
              score: score,
            });
          }
        }
      }

      return {
        assetId: asset.id,
        assetModifiedDate: asset.modified_date,
        assetName: asset.applicationName,
        assetCategory: asset.assetCategory,
        mitreControlScores: mitreControlScores,
      };
    });

    // Use default placeholders if no assets or risks are found for cross-joining
    const finalAssets =
      assetDetails.length > 0
        ? assetDetails
        : [
            {
              assetName: "N/A",
              assetCategory: "N/A",
              mitreControlScores: [],
            },
          ];

    const finalRisks =
      process.risks.length > 0
        ? process.risks
        : [
            {
              riskScenario: "N/A",
              riskDescription: "N/A",
              taxonomy: [],
              riskScenarioBusinessImpacts: [],
            },
          ];

    // const proce
    // --- Perform the Cross-Join (Asset X Risk) ---
    for (const asset of finalAssets) {
      console.log(asset);
      for (const risk of finalRisks) {
        const riskScenario = risk.riskScenario;

        // Get the impact values from the nested 'taxonomy' array
        // const impactMap = risk.taxonomy.reduce((acc, tax) => {
        //   const name = tax.taxonomyName.toLowerCase().replace(/ impact/g, "");
        //   acc[name] = tax.severityName || null;
        //   return acc;
        // }, {});
        const impactMap = risk.taxonomy.reduce((acc, tax) => {
          const name = tax.taxonomyName.toLowerCase().replace(/ impact/g, "");

          acc[name] = {
            severityName: tax.severityName || null,
            severityMinRange: tax.severityMinRange || null,
            severityMaxRange: tax.severityMaxRange || null,
          };

          return acc;
        }, {});

        flatData.push({
          assessmentCreatedDate: createdDate,
          assessmentModifiedDate: modifiedDate,
          assessmentId: assessmentId,
          assessmentName: assessmentName,
          orgId: orgId,
          orgName: orgName,
          businessUnitId: buId,
          businessUnit: buName,
          businessProcessId: processId ?? null,
          businessProcess: processName,
          assetId: asset.assetId,
          asset: asset.assetName,
          assetCategory: asset.assetCategory,
          riskScenarioId: risk.id,
          riskScenario: riskScenario,
          riskScenarioCIAMapping: risk?.orgRiskScenario?.ciaMapping ?? [],
          financial: impactMap.financial?.severityName || null,
          financialMinRange: impactMap.financial?.severityMinRange || null,
          financialMaxRange: impactMap.financial?.severityMaxRange || null,

          regulatory: impactMap.regulatory?.severityName || null,
          regulatoryMinRange: impactMap.regulatory?.severityMinRange || null,
          regulatoryMaxRange: impactMap.regulatory?.severityMaxRange || null,

          reputational: impactMap.reputational?.severityName || null,
          reputationalMinRange:
            impactMap.reputational?.severityMinRange || null,
          reputationalMaxRange:
            impactMap.reputational?.severityMaxRange || null,

          operational: impactMap.operational?.severityName || null,
          operationalMinRange: impactMap.operational?.severityMinRange || null,
          operationalMaxRange: impactMap.operational?.severityMaxRange || null,
          mitreControlsAndScores: asset.mitreControlScores,
        });
      }
    }
  }

  return flatData;
}

async function fetchDataFromAssessment(
  orgId,
  assessmentIds = [],
  active = false
) {
  if (!models || !models.sequelize || !models.Sequelize) {
    throw new Error(
      "Sequelize models object, sequelize instance, and Sequelize package object (for Op) are required."
    );
  }

  const Op = models.Sequelize.Op;
  let latestAssessmentIds = [];
  let organizationAssessmentsIds = [];

  if (!orgId) {
    throw new Error("Organization ID (orgId) is required.");
  }
  const where = {
    isDeleted: false,
  };

  if (assessmentIds.length > 0) {
    where.assessmentId = { [Op.in]: assessmentIds };
  } else if (active == true) {
    // --- 1. Find the Assessment IDs (Latest per Business Unit, filtered by Org ID) ---
    const latestAssessmentsQuery = `
        SELECT
            "assessment_id"
        FROM (
            SELECT
                "assessment_id",
                "business_unit_id",
                "created_date",
                "modified_date",
                ROW_NUMBER() OVER (PARTITION BY "business_unit_id" ORDER BY "modified_date" DESC) as rn
            FROM public."assessment"
            WHERE 
                "business_unit_id" IS NOT NULL 
                AND "is_deleted" = FALSE
                AND "org_id" = :orgId
        ) AS subquery
        WHERE rn = 1;
    `;

    const rawQueryResult = await models.sequelize.query(
      latestAssessmentsQuery,
      {
        replacements: { orgId: orgId },
        type: models.sequelize.QueryTypes.SELECT,
      }
    );

    // Handle the different return formats of raw queries to ensure we have an array
    const queryResults =
      Array.isArray(rawQueryResult) && Array.isArray(rawQueryResult[0])
        ? rawQueryResult[0]
        : rawQueryResult;

    if (!Array.isArray(queryResults)) {
      console.error("Raw SQL query did not return a map-able array.");
      return [];
    }

    latestAssessmentIds = queryResults.map((r) => r.assessment_id);

    if (latestAssessmentIds.length === 0) {
      console.log(`No latest assessments found for organization ID: ${orgId}`);
      return [];
    }

    where.assessmentId = { [Op.in]: latestAssessmentIds };
  } else {
    const organizationAssessmentsQuery = `
      SELECT "assessment_id"
      FROM public."assessment"
      WHERE 
          "org_id" = :orgId
          AND "is_deleted" = FALSE
          AND "assessment_id" IS NOT NULL;
    `;

    const rawQueryResult = await models.sequelize.query(
      organizationAssessmentsQuery,
      {
        replacements: { orgId: orgId },
        type: models.sequelize.QueryTypes.SELECT,
      }
    );

    // Handle the different return formats of raw queries to ensure we have an array
    const queryResults =
      Array.isArray(rawQueryResult) && Array.isArray(rawQueryResult[0])
        ? rawQueryResult[0]
        : rawQueryResult;

    if (!Array.isArray(queryResults)) {
      console.error("Raw SQL query did not return a map-able array.");
      return [];
    }

    organizationAssessmentsIds = queryResults.map((r) => r.assessment_id);

    if (organizationAssessmentsIds.length === 0) {
      console.log(`No latest assessments found for organization ID: ${orgId}`);
      return [];
    }

    where.assessmentId = { [Op.in]: organizationAssessmentsIds };
  }

  // --- 2. Fetch all required nested data based on the latest IDs ---
  const assessmentProcesses = await models.AssessmentProcess.findAll({
    where,
    attributes: {
      include: [
        ["id", "orgProcessId"], // alias id → processId
      ],
    },
    include: [
      {
        model: models.Assessment,
        as: "assessment",
        attributes: [
          "assessmentName",
          "assessmentId",
          "orgId",
          "orgName",
          "businessUnitId",
          "businessUnitName",
        ],
        required: true,
      },
      {
        model: models.AssessmentProcessAsset,
        as: "assets",
        attributes: [
          "id",
          "applicationName",
          "assetCategory",
          "assessmentProcessAssetId",
          "modified_date",
        ],
        where: { isDeleted: false },
        required: false,
        include: [
          {
            model: models.AssessmentQuestionaire,
            as: "questionnaire",
            include: [
              {
                model: models.LibraryQuestionnaire,
                as: "questionaire",
                attributes: ["mitreControlId", "question"],
              },
            ],
            attributes: ["questionnaireId", "responseValue"],
            where: { isDeleted: false },
            required: false,
          },
        ],
      },
      {
        model: models.AssessmentProcessRiskScenario,
        as: "risks",
        attributes: [
          "id",
          "riskScenario",
          "riskDescription",
          "assessmentProcessRiskId",
          "created_date",
          "modified_date",
        ],
        where: { isDeleted: false },
        required: false,
        include: [
          {
            model: models.OrganizationRiskScenario,
            as: "orgRiskScenario",
            attributes: ["ciaMapping"],
            where: { isDeleted: false },
            required: false,
          },
          {
            model: models.AssessmentRiskTaxonomy,
            as: "taxonomy",
            attributes: [
              "taxonomyName",
              "taxonomyId",
              "severityName",
              "severityId",
              "severityMinRange",
              "severityMaxRange",
              "weightage",
              "created_date",
              "modified_date",
            ],
            where: { isDeleted: false },
            required: false,
          },
          // {
          //   model: models.AssessmentRiskScenarioBusinessImpact,
          //   as: "riskScenarioBusinessImpacts",      COMMENTING THIS BECAUSE THIS IS NOT BEING USED
          //   attributes: ["riskThreshold", "riskThresholdValue"],
          //   where: { isDeleted: false },
          //   required: false,
          // },
        ],
      },
    ],
  });

  return assessmentProcesses;
}

async function insertBusinessAssetRisks(
  dataArray,
  dbModel = models.ReportsMaster,
  clearOldRecords = false
) {
  if (!Array.isArray(dataArray)) {
    throw new Error("Input must be an array of JSON objects");
  }

  const t = await models.sequelize.transaction();

  try {
    // 1. Optional: Clear all old data
    if (clearOldRecords === true) {
      await dbModel.destroy({
        where: {},
        truncate: true,
        cascade: true,
        transaction: t,
      });
    }

    // 2. Format each row for insertion to match ReportsMaster fields
    const formatted = dataArray.map((item) => ({
      assessmentId: item.assessmentId,
      assessmentName: item.assessmentName,
      orgId: item.orgId,
      orgName: item.orgName,

      businessUnitId: item.businessUnitId,
      businessUnit: item.businessUnit,

      businessProcessId: item.businessProcessId,
      businessProcess: item.businessProcess,

      assetId: item.assetId,
      asset: item.asset,
      assetCategory: item.assetCategory,

      riskScenarioId: item.riskScenarioId,
      riskScenario: item.riskScenario,
      riskScenarioCIAMapping: item.riskScenarioCIAMapping,

      // --- FINANCIAL ---
      financial: item.financial,
      financialMinRange: item.financialMinRange,
      financialMaxRange: item.financialMaxRange,

      // --- REGULATORY ---
      regulatory: item.regulatory,
      regulatoryMinRange: item.regulatoryMinRange,
      regulatoryMaxRange: item.regulatoryMaxRange,

      // --- REPUTATIONAL ---
      reputational: item.reputational,
      reputationalMinRange: item.reputationalMinRange,
      reputationalMaxRange: item.reputationalMaxRange,

      // --- OPERATIONAL ---
      operational: item.operational,
      operationalMinRange: item.operationalMinRange,
      operationalMaxRange: item.operationalMaxRange,

      // MITRE CONTROLS
      mitreControlsAndScores: item.mitreControlsAndScores,

      // timestamps
      assessmentCreatedTimestamp: item.assessmentCreatedDate,
      assessmentUpdatedTimestamp: item.assessmentModifiedDate,
    }));

    // 3. Insert new data
    await dbModel.bulkCreate(formatted, {
      returning: true,
      transaction: t,
    });

    // 4. Commit
    await t.commit();
    return { status: "success", inserted: formatted.length };
  } catch (err) {
    // Rollback on error
    await t.rollback();
    throw err;
  }
}
function mergeAndAddControlStrength(assessmentsArray, scoresArray) {
  // Convert scoresArray into a lookup table by assetId
  const scoreMap = new Map();
  for (const s of scoresArray) {
    scoreMap.set(s.assetId, s);
  }

  // 1. Merge scores into assessments
  const merged = assessmentsArray.map((a) => {
    const score = scoreMap.get(a.assetId) || {};
    return {
      ...a,
      // C: score.C ?? 0,
      // I: score.I ?? 0,
      // A: score.A ?? 0,
      controlStrengthProcessToAsset: score.OVERALL ?? 0,
    };
  });

  // 2. Group by businessUnit + businessProcess
  const groupMap = new Map();

  for (const row of merged) {
    const key = `${row.businessUnit}___${row.businessProcess}`;

    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }

    groupMap.get(key).push(row.controlStrengthProcessToAsset);
  }

  // 3. Calculate average per group
  const avgMap = new Map();

  for (const [key, overalls] of groupMap.entries()) {
    const valid = overalls.filter((v) => typeof v === "number");
    const avg =
      valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;

    avgMap.set(key, Number(avg.toFixed(2)));
  }

  // 4. Add controlStrength to each final row
  return merged.map((row) => {
    const key = `${row.businessUnit}___${row.businessProcess}`;
    return {
      ...row,
      controlStrengthRisksToImpacts: avgMap.get(key),
    };
  });
}

function risksToImpactCalculations(assessmentRecordsArray) {
  const impactWeightMap = {
    regulatory: 40,
    reputational: 40,
    financial: 10,
    operational: 10,
  };

  const impactLevelToNumMap = {
    critical: 4,
    high: 4,
    moderate: 3,
    low: 2,
    "very low": 1,
  };

  const residualRiskThreshold = {
    critical: 4,
    high: 3,
    moderate: 2,
    low: 1,
    "very low": 0,
  };

  function getRiskLevel(value) {
    // Sort the keys by threshold in descending order
    const levels = Object.entries(residualRiskThreshold).sort(
      (a, b) => b[1] - a[1]
    );

    for (const [level, threshold] of levels) {
      if (value >= threshold) {
        return level;
      }
    }

    return "very low";
  }

  const updated = assessmentRecordsArray.map((item) => {
    let financialMinRange = item.financialMinRange.replace(/k/i, "");
    financialMinRange = Number(financialMinRange) * 1000;
    let financialMaxRange = item.financialMaxRange.replace(/k/i, "");
    financialMinRfinancialMaxRangeange = Number(financialMaxRange) * 1000;
    let finacialImpactValueInDollar =
      (financialMinRange + financialMaxRange) / 2;

    let regulatoryMinRange = item.regulatoryMinRange.replace(/k/i, "");
    regulatoryMinRange = Number(regulatoryMinRange) * 1000;
    let regulatoryMaxRange = item.regulatoryMaxRange.replace(/k/i, "");
    regulatoryMaxRange = Number(regulatoryMaxRange) * 1000;
    let regulatoryImpactValueInDollar =
      (regulatoryMinRange + regulatoryMaxRange) / 2;

    let reputationalMinRange = item.reputationalMinRange.replace(/k/i, "");
    reputationalMinRange = Number(reputationalMinRange) * 1000;
    let reputationalMaxRange = item.reputationalMaxRange.replace(/k/i, "");
    reputationalMaxRange = Number(reputationalMaxRange) * 1000;
    let reputationalImpactValueInDollar =
      (reputationalMaxRange + regulatoryMaxRange) / 2;

    let operationalMinRange = item.operationalMinRange.replace(/k/i, "");
    operationalMinRange = Number(operationalMinRange) * 1000;
    let operationalMaxRange = item.operationalMaxRange.replace(/k/i, "");
    operationalMaxRange = Number(operationalMaxRange) * 1000;
    let operationalImpactValueInDollar =
      (operationalMinRange + operationalMaxRange) / 2;

    let inherentFinancialExposure =
      finacialImpactValueInDollar +
      (impactWeightMap["regulatory"] * regulatoryImpactValueInDollar +
        impactWeightMap["reputational"] * reputationalImpactValueInDollar +
        impactWeightMap["financial"] * finacialImpactValueInDollar +
        impactWeightMap["operational"] * operationalImpactValueInDollar) /
        (impactWeightMap["regulatory"] +
          impactWeightMap["reputational"] +
          impactWeightMap["operational"]);

    let overallImpactScore =
      (impactWeightMap["regulatory"] *
        impactLevelToNumMap[item.regulatory?.toLowerCase()] +
        impactWeightMap["reputational"] *
          impactLevelToNumMap[item.reputational?.toLowerCase()] +
        impactWeightMap["financial"] *
          impactLevelToNumMap[item.financial?.toLowerCase()] +
        impactWeightMap["operational"] *
          impactLevelToNumMap[item.operational?.toLowerCase()]) /
      (impactWeightMap["financial"] +
        impactWeightMap["regulatory"] +
        impactWeightMap["reputational"] +
        impactWeightMap["operational"]);

    return {
      ...item,
      financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel:
        finacialImpactValueInDollar,
      finacialImpactValueInDollar,
      regulatoryImpactValueInDollar,
      reputationalImpactValueInDollar,
      operationalImpactValueInDollar,
      inherentFinancialExposure,
      overallImpactScore,
    };
  });
  return updated;
}

function riskDashboardERMTab(assessmentRecordsArray, assetControlScores) {
  const residualRiskThreshold = {
    critical: 4,
    high: 3,
    moderate: 2,
    low: 1,
    "very low": 0,
  };
  function getRiskLevel(value) {
    // Sort the keys by threshold in descending order
    const levels = Object.entries(residualRiskThreshold).sort(
      (a, b) => b[1] - a[1]
    );

    for (const [level, threshold] of levels) {
      if (value >= threshold) {
        return level;
      }
    }

    return "very low";
  }

  function getControlStrengthRiskDashboardERMTabForAsset(ciaMapping, assetId) {
    for (const asset of assetControlScores) {
      if (asset.assetId === assetId) {
        return asset[ciaMapping];
      }
    }
    return "N/A";
  }

  const updated = assessmentRecordsArray.map((item) => {
    let inherentRiskScoreRiskDashboardERMTab = item.overallImpactScore;
    let inherentRiskLevelRiskDashboardERMTab = getRiskLevel(
      inherentRiskScoreRiskDashboardERMTab
    );
    let controlStrengthRiskDashboardERMTab = "N/A";
    let residualRiskScoreRiskDashboardERMTab = "N/A";
    let residualRiskLevelRiskDashboardERMTab = "N/A";
    let inherentImpactInMillionDollarsRiskDashboardERMTab =
      roundToOneDecimal(item.inherentFinancialExposure) ?? "N/A";
    let residualImpactInMillionDollarsRiskDashboardERMTab = "N/A";
    let targetImpactInMillionDollarsRiskDashboardERMTab = "N/A";

    if (item.riskScenarioCIAMapping?.length > 0 && item.assetId != null) {
      controlStrengthRiskDashboardERMTab =
        getControlStrengthRiskDashboardERMTabForAsset(
          item.riskScenarioCIAMapping[0],
          item.assetId
        );
      if (typeof controlStrengthRiskDashboardERMTab === "number") {
        let rawResidualRiskScoreRiskDashboardERMTab =
          (inherentRiskScoreRiskDashboardERMTab *
            (5.25 - controlStrengthRiskDashboardERMTab)) /
          5;
        residualRiskScoreRiskDashboardERMTab = roundToOneDecimal(
          rawResidualRiskScoreRiskDashboardERMTab
        );
        residualRiskLevelRiskDashboardERMTab = getRiskLevel(
          residualRiskScoreRiskDashboardERMTab
        );

        let rawResidualImpactInMillionDollarsRiskDashboardERMTab =
          (inherentImpactInMillionDollarsRiskDashboardERMTab *
            (5.25 - controlStrengthRiskDashboardERMTab)) /
          5;
        residualImpactInMillionDollarsRiskDashboardERMTab = roundToOneDecimal(
          rawResidualImpactInMillionDollarsRiskDashboardERMTab
        );

        targetImpactInMillionDollarsRiskDashboardERMTab =
          residualImpactInMillionDollarsRiskDashboardERMTab < riskAppetite
            ? residualImpactInMillionDollarsRiskDashboardERMTab
            : riskAppetite;
      }
    }

    return {
      ...item,
      inherentRiskScoreRiskDashboardERMTab:
        inherentRiskScoreRiskDashboardERMTab,
      inherentRiskLevelRiskDashboardERMTab:
        inherentRiskLevelRiskDashboardERMTab,
      controlStrengthRiskDashboardERMTab: controlStrengthRiskDashboardERMTab,
      residualRiskScoreRiskDashboardERMTab:
        residualRiskScoreRiskDashboardERMTab,
      residualRiskLevelRiskDashboardERMTab:
        residualRiskLevelRiskDashboardERMTab,
      inherentImpactInMillionDollarsRiskDashboardERMTab:
        inherentImpactInMillionDollarsRiskDashboardERMTab,
      residualImpactInMillionDollarsRiskDashboardERMTab:
        residualImpactInMillionDollarsRiskDashboardERMTab,
      targetImpactInMillionDollarsRiskDashboardERMTab:
        targetImpactInMillionDollarsRiskDashboardERMTab,
    };
  });
  return updated;
}

function riskDashboardBusinessTab(dataArray) {
  const groupMap = new Map();

  const residualRiskThreshold = {
    critical: 4,
    high: 3,
    moderate: 2,
    low: 1,
    "very low": 0,
  };
  function getRiskLevel(value) {
    // Sort the keys by threshold in descending order
    const levels = Object.entries(residualRiskThreshold).sort(
      (a, b) => b[1] - a[1]
    );

    for (const [level, threshold] of levels) {
      if (value >= threshold) {
        return level;
      }
    }

    return "very low";
  }
  // 1. Build map with running max only
  for (const item of dataArray) {
    const key = `${item.businessUnitId}___${item.businessProcessId}`;

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        maxOverallImpactScore:
          typeof item.overallImpactScore === "number"
            ? item.overallImpactScore
            : null,
        maxInherentFinancialExposure:
          typeof item.overallImpactScore === "number"
            ? item.inherentFinancialExposure
            : null,
        totalControlStrength:
          typeof item.controlStrengthProcessToAsset === "number"
            ? item.controlStrengthProcessToAsset
            : 0,
        count: typeof item.controlStrengthProcessToAsset === "number" ? 1 : 0,
      });
    } else {
      const stats = groupMap.get(key);

      // Update max
      if (typeof item.overallImpactScore === "number") {
        if (
          stats.maxOverallImpactScore === null ||
          item.overallImpactScore > stats.maxOverallImpactScore
        ) {
          stats.maxOverallImpactScore = item.overallImpactScore;
        }
      }

      // Update average components
      if (typeof item.controlStrengthProcessToAsset === "number") {
        stats.totalControlStrength += item.controlStrengthProcessToAsset;
        stats.count += 1;
      }
      if (typeof item.inherentFinancialExposure === "number") {
        if (
          stats.inherentFinancialExposure === null ||
          item.inherentFinancialExposure > stats.maxInherentFinancialExposure
        ) {
          stats.maxInherentFinancialExposure = item.inherentFinancialExposure;
        }
      }
    }
  }

  // 2. Add max value back to each record
  return dataArray.map((item) => {
    const key = `${item.businessUnitId}___${item.businessProcessId}`;
    const stats = groupMap.get(key);
    const inherentRiskScoreRiskDashboardBusinessTab =
      stats?.maxOverallImpactScore ?? "N/A";
    const inherentRiskLevelRiskDashboardBusinessTab = getRiskLevel(
      inherentRiskScoreRiskDashboardBusinessTab
    );
    const controlStrengthRiskDashboardBusinessTab =
      stats?.totalControlStrength / stats?.count ?? "N/A";
    const rawResidualRiskScoreRiskDashboardBusinessTab =
      (inherentRiskScoreRiskDashboardBusinessTab *
        (5.25 - controlStrengthRiskDashboardBusinessTab)) /
      5;
    const residualRiskScoreRiskDashboardBusinessTab = roundToOneDecimal(
      rawResidualRiskScoreRiskDashboardBusinessTab
    );
    const residualRiskLevelRiskDashboardBusinessTab = getRiskLevel(
      residualRiskScoreRiskDashboardBusinessTab
    );
    const rawInherentImpactInMillionDollarsRiskDashboardBusinessTab =
      stats.maxInherentFinancialExposure ?? "N/A";
    const inherentImpactInMillionDollarsRiskDashboardBusinessTab =
      roundToOneDecimal(
        rawInherentImpactInMillionDollarsRiskDashboardBusinessTab
      ) ?? "N/A";

    const rawResidualImpactInMillionDollarsRiskDashboardBusinessTab =
      (inherentImpactInMillionDollarsRiskDashboardBusinessTab *
        (5.25 - controlStrengthRiskDashboardBusinessTab)) /
      5;
    const residualImpactInMillionDollarsRiskDashboardBusinessTab =
      roundToOneDecimal(
        rawResidualImpactInMillionDollarsRiskDashboardBusinessTab
      );
    
    const targetImpactRiskDashboardBusinessTab = residualImpactInMillionDollarsRiskDashboardBusinessTab < riskAppetite ? residualImpactInMillionDollarsRiskDashboardBusinessTab : riskAppetite;
    const rawtargetStrengthRiskDashboardBusinessTab = 5 - ((targetImpactRiskDashboardBusinessTab * 5) / inherentImpactInMillionDollarsRiskDashboardBusinessTab );
    const targetStrengthRiskDashboardBusinessTab = roundToOneDecimal(rawtargetStrengthRiskDashboardBusinessTab);
    const rawTargetResidualRiskRiskDashboardBusinessTab = ( inherentRiskScoreRiskDashboardBusinessTab * ( 5.25 - targetStrengthRiskDashboardBusinessTab) ) / 5;
    const targetResidualRiskRiskDashboardBusinessTab = roundToOneDecimal(rawTargetResidualRiskRiskDashboardBusinessTab);
    const targetResidualRiskLevelRiskDashboardBusinessTab = getRiskLevel(targetResidualRiskRiskDashboardBusinessTab);
    return {
      ...item,
      inherentRiskScoreRiskDashboardBusinessTab:
        inherentRiskScoreRiskDashboardBusinessTab,
      inherentRiskLevelRiskDashboardBusinessTab:
        inherentRiskLevelRiskDashboardBusinessTab,
      controlStrengthRiskDashboardBusinessTab:
        controlStrengthRiskDashboardBusinessTab,
      residualRiskScoreRiskDashboardBusinessTab:
        residualRiskScoreRiskDashboardBusinessTab,
      residualRiskLevelRiskDashboardBusinessTab:
        residualRiskLevelRiskDashboardBusinessTab,
      inherentImpactInMillionDollarsRiskDashboardBusinessTab: inherentImpactInMillionDollarsRiskDashboardBusinessTab,
      residualImpactInMillionDollarsRiskDashboardBusinessTab: residualImpactInMillionDollarsRiskDashboardBusinessTab,
      targetImpactRiskDashboardBusinessTab: targetImpactRiskDashboardBusinessTab,
      targetStrengthRiskDashboardBusinessTab: targetStrengthRiskDashboardBusinessTab,
      targetResidualRiskRiskDashboardBusinessTab: targetResidualRiskRiskDashboardBusinessTab,
      targetResidualRiskLevelRiskDashboardBusinessTab: targetResidualRiskLevelRiskDashboardBusinessTab


    };
  });
}


function processToAssetBusinesssProcessLevelCalculations(dataArray) {
 return dataArray.map((item) => {
  const businessProcessInherentRiskProcessToAsset = item.inherentRiskScoreRiskDashboardBusinessTab;
  const businessProcessinherentImpactInMillionDollarsProcessToAsset = item.inherentImpactInMillionDollarsRiskDashboardBusinessTab
  return {
    ...item,
    businessProcessInherentRiskProcessToAsset: businessProcessInherentRiskProcessToAsset,
    businessProcessinherentImpactInMillionDollarsProcessToAsset: businessProcessinherentImpactInMillionDollarsProcessToAsset
  }
 })
}
function riskDashboardCIOTab(dataArray, assetControlScores) {
  const groupMap = new Map();

  const residualRiskThreshold = {
    critical: 4,
    high: 3,
    moderate: 2,
    low: 1,
    "very low": 0,
  };
  function getRiskLevel(value) {
    // Sort the keys by threshold in descending order
    const levels = Object.entries(residualRiskThreshold).sort(
      (a, b) => b[1] - a[1]
    );

    for (const [level, threshold] of levels) {
      if (value >= threshold) {
        return level;
      }
    }

    return "very low";
  }
    function getControlStrengthForAsset(ciaMapping = "OVERALL", assetId) {
    for (const asset of assetControlScores) {
      if (asset.assetId === assetId) {
        return asset[ciaMapping];
      }
    }
    return "N/A";
  }
  // 1. Build map with running max only
  for (const item of dataArray) {
    const key = `${item.assetId}`;

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        maxBusinessProcessInherentImpact: typeof item.businessProcessinherentImpactInMillionDollarsProcessToAsset === "number" ? item.businessProcessinherentImpactInMillionDollarsProcessToAsset : 0,
        totalBusinessProcessInherentRisk:
          typeof item.businessProcessInherentRiskProcessToAsset === "number"
            ? item.businessProcessInherentRiskProcessToAsset
            : 0,
        countBusinessProcessInherentRisk: typeof item.businessProcessInherentRiskProcessToAsset === "number" ? 1 : 0,
      });
    } else {
      const stats = groupMap.get(key);
      // Update max component
      if (typeof item.businessProcessinherentImpactInMillionDollarsProcessToAsset === "number" && item.businessProcessinherentImpactInMillionDollarsProcessToAsset > stats.maxBusinessProcessInherentImpact) {
        stats.maxBusinessProcessInherentImpact = item.businessProcessinherentImpactInMillionDollarsProcessToAsset;
      }
      // Update average components
      if (typeof item.controlStrengthProcessToAsset === "number") {
        stats.totalBusinessProcessInherentRisk += item.businessProcessInherentRiskProcessToAsset;
        stats.countBusinessProcessInherentRisk += 1;
      }
    }
  }

  return dataArray.map((item) => {
    const key = `${item.assetId}`;
    const stats = groupMap.get(key);
    const rawInherentRiskScoreRiskDashboardCIOTab = stats.countBusinessProcessInherentRisk > 0 ? ( stats?.totalBusinessProcessInherentRisk ?? 0 / stats.countBusinessProcessInherentRisk ) : 0  ;
    const inherentRiskScoreRiskDashboardCIOTab = roundToOneDecimal(rawInherentRiskScoreRiskDashboardCIOTab);
    const inherentRiskLevelRiskDashboardCIOTab = getRiskLevel(inherentRiskScoreRiskDashboardCIOTab);
    const controlStrengthRiskDashboardCIOTab = getControlStrengthForAsset("OVERALL", item.assetId);
    const rawResidualRiskScoreRiskDashboardCIOTab = inherentRiskScoreRiskDashboardCIOTab * ( 5.25 - controlStrengthRiskDashboardCIOTab) / 5;
    const residualRiskScoreRiskDashboardCIOTab = roundToOneDecimal(rawResidualRiskScoreRiskDashboardCIOTab);
    const residualRiskLevelRiskDashboardCIOTab = getRiskLevel(residualRiskScoreRiskDashboardCIOTab);
    const inherentImpactInMillionDollarsDRiskDashboardCIOTab = stats.maxBusinessProcessInherentImpact ?? 0;
    const rawResidualImpactRiskDashboardCIOTab = inherentImpactInMillionDollarsDRiskDashboardCIOTab * ( 5.25 - controlStrengthRiskDashboardCIOTab) / 5;
    const residualImpactInMillionDollarsRiskDashboardCIOTab = roundToOneDecimal(rawResidualImpactRiskDashboardCIOTab);
    const targetImpactRiskDashboardCIOTab = residualImpactInMillionDollarsRiskDashboardCIOTab < riskAppetite ? residualImpactInMillionDollarsRiskDashboardCIOTab : riskAppetite;
    const rawTargetStrengthRiskDashboardCIOTab = 5 - ((targetImpactRiskDashboardCIOTab * 5) / inherentImpactInMillionDollarsDRiskDashboardCIOTab) ;
    const targetStrengthRiskDashboardCIOTab = roundToOneDecimal(rawTargetStrengthRiskDashboardCIOTab);
    const rawTargetResidualRiskScoreRiskDashboardCIOTab = inherentRiskScoreRiskDashboardCIOTab * (5.25 - targetStrengthRiskDashboardCIOTab) / 5;
    const targetResidualRiskScoreRiskDashboardCIOTab = roundToOneDecimal(rawTargetResidualRiskScoreRiskDashboardCIOTab);
    const targetResidualRiskLevelRiskDashboardCIOTab = getRiskLevel(targetResidualRiskScoreRiskDashboardCIOTab);

    return{
      ...item,
      inherentRiskScoreRiskDashboardCIOTab: inherentRiskScoreRiskDashboardCIOTab,
      inherentRiskLevelRiskDashboardCIOTab: inherentRiskLevelRiskDashboardCIOTab,
      controlStrengthRiskDashboardCIOTab: controlStrengthRiskDashboardCIOTab,
      residualRiskScoreRiskDashboardCIOTab: residualRiskScoreRiskDashboardCIOTab,
      residualRiskLevelRiskDashboardCIOTab: residualRiskLevelRiskDashboardCIOTab,
      inherentImpactInMillionDollarsDRiskDashboardCIOTab: inherentImpactInMillionDollarsDRiskDashboardCIOTab,
      residualImpactInMillionDollarsRiskDashboardCIOTab: residualImpactInMillionDollarsRiskDashboardCIOTab,
      targetImpactRiskDashboardCIOTab: targetImpactRiskDashboardCIOTab,
      targetStrengthRiskDashboardCIOTab: targetStrengthRiskDashboardCIOTab,
      targetResidualRiskScoreRiskDashboardCIOTab: targetResidualRiskScoreRiskDashboardCIOTab,
      targetResidualRiskLevelRiskDashboardCIOTab: targetResidualRiskLevelRiskDashboardCIOTab
    }
  })
}

async function generateFlatAssessmentMatrix(orgId, active = false) {
  const assessmentProcesses = await fetchDataFromAssessment(orgId, true);
  const d = createFlatAssessmentMatrixFromProcesses(assessmentProcesses);
  const a = await insertBusinessAssetRisks(d);
  const b = aggregateMitreControlsByAsset(assessmentProcesses);
  const c = await enrichMitreControlsByMitreThreatRecords(b);
  const e = calculateAssetScoresForAll(c);
  const finalArray = mergeAndAddControlStrength(d, e);
  const f = risksToImpactCalculations(finalArray);
  const g = riskDashboardERMTab(f, e);
  const h = riskDashboardBusinessTab(g);
  const i = processToAssetBusinesssProcessLevelCalculations(h);
  const j = riskDashboardCIOTab(i, e);

  return j;
}

module.exports = {
  generateFlatAssessmentMatrix,
  fetchDataFromAssessment,
  createFlatAssessmentMatrixFromProcesses,
  enrichMitreControlsByMitreThreatRecords,
  calculateAssetScoresForAll,
  insertBusinessAssetRisks,
  generateCSV,
};
