const models = require("../models");

const fs = require("fs");
const { format } = require("@fast-csv/format");

const impactLevelToNumMap = {
  critical: 4,
  high: 4,
  moderate: 3,
  low: 2,
  "very low": 1,
};

class SyncupService {
  static async insertReportsMaster(records) {
    try {
      const now = new Date();
      if (!Array.isArray(records)) {
        throw new Error("Input must be an array");
      }

      // Validate incoming array
      const cleanedRecords = records.map((item) => ({
        // Basic assessment
        assessmentId: item.assessmentId,
        assessmentName: item.assessmentName,

        orgId: item.orgId,
        orgName: item.orgName,
        organizationRiskAppetiteInMillionDollar:
          item.organizationRiskAppetiteInMillionDollar,

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

        // Financial / Regulatory / Reputational / Operational
        financial: item.financial,
        financialWeightage: item.financialWeightage,
        financialMinRange: item.financialMinRange,
        financialMaxRange: item.financialMaxRange,

        regulatory: item.regulatory,
        regulatoryWeightage: item.regulatoryWeightage,
        regulatoryMinRange: item.regulatoryMinRange,
        regulatoryMaxRange: item.regulatoryMaxRange,

        reputational: item.reputational,
        reputationalWeightage: item.reputationalWeightage,
        reputationalMinRange: item.reputationalMinRange,
        reputationalMaxRange: item.reputationalMaxRange,

        operational: item.operational,
        operationalWeightage: item.operationalWeightage,
        operationalMinRange: item.operationalMinRange,
        operationalMaxRange: item.operationalMaxRange,

        mitreControlsAndScores: item.mitreControlsAndScores,

        // CIA Scores
        aggAssetCScore: item.assetCScore,
        aggAssetIScore: item.assetIScore,
        aggAssetAScore: item.assetAScore,
        aggAssetCIAOverallScore: item.assetCIAOverallScore,

        // Strength
        aggAssetControlStrengthProcessToAsset:
          item.controlStrengthProcessToAsset,
        aggBuBpControlStrengthRisksToImpacts:
          item.controlStrengthRisksToImpacts,

        // Impact values
        financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModelRisksToImpacts:
          item.financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel,

        financialImpactValueInMillionDollar:
          item.finacialImpactValueInMillionDollar,
        regulatoryImpactValueInMillionDollar:
          item.regulatoryImpactValueInMillionDollar,
        reputationalImpactValueInMillionDollar:
          item.reputationalImpactValueInMillionDollar,
        operationalImpactValueInMillionDollar:
          item.operationalImpactValueInMillionDollar,

        inherentFinancialExposureRisksToImpacts: item.inherentFinancialExposure,
        overallImpactScoreRisksToImpacts: item.overallImpactScore,

        // ERM dashboard
        inherentRiskScoreRiskDashboardERMTab:
          item.inherentRiskScoreRiskDashboardERMTab,
        inherentRiskLevelRiskDashboardERMTab:
          item.inherentRiskLevelRiskDashboardERMTab,
        controlStrengthRiskDashboardERMTab:
          item.controlStrengthRiskDashboardERMTab,
        residualRiskScoreRiskDashboardERMTab:
          item.residualRiskScoreRiskDashboardERMTab,
        residualRiskLevelRiskDashboardERMTab:
          item.residualRiskLevelRiskDashboardERMTab,
        inherentImpactInMillionDollarsRiskDashboardERMTab:
          item.inherentImpactInMillionDollarsRiskDashboardERMTab,
        residualImpactInMillionDollarsRiskDashboardERMTab:
          item.residualImpactInMillionDollarsRiskDashboardERMTab,
        targetImpactInMillionDollarsRiskDashboardERMTab:
          item.targetImpactInMillionDollarsRiskDashboardERMTab,

        // Business dashboard
        aggBuBpInherentRiskScoreRiskDashboardBusinessTab:
          item.inherentRiskScoreRiskDashboardBusinessTab,
        aggBuBpInherentRiskLevelRiskDashboardBusinessTab:
          item.inherentRiskLevelRiskDashboardBusinessTab,
        aggBuBpControlStrengthRiskDashboardBusinessTab:
          item.controlStrengthRiskDashboardBusinessTab,
        aggBuBpResidualRiskScoreRiskDashboardBusinessTab:
          item.residualRiskScoreRiskDashboardBusinessTab,
        aggBuBpResidualRiskLevelRiskDashboardBusinessTab:
          item.residualRiskLevelRiskDashboardBusinessTab,
        aggBuBpInherentImpactInMillionDollarsRiskDashboardBusinessTab:
          item.inherentImpactInMillionDollarsRiskDashboardBusinessTab,
        aggBuBpResidualImpactInMillionDollarsRiskDashboardBusinessTab:
          item.residualImpactInMillionDollarsRiskDashboardBusinessTab,
        aggBuBpTargetImpactRiskDashboardBusinessTab:
          item.targetImpactRiskDashboardBusinessTab,
        aggBuBpTargetStrengthRiskDashboardBusinessTab:
          item.targetStrengthRiskDashboardBusinessTab,
        aggBuBpTargetResidualRiskRiskDashboardBusinessTab:
          item.targetResidualRiskRiskDashboardBusinessTab,
        aggBuBpTargetResidualRiskLevelRiskDashboardBusinessTab:
          item.targetResidualRiskLevelRiskDashboardBusinessTab,

        // Process to asset
        businessProcessInherentRiskProcessToAsset:
          item.businessProcessInherentRiskProcessToAsset,
        businessProcessInherentImpactInMillionDollarsProcessToAsset:
          item.businessProcessinherentImpactInMillionDollarsProcessToAsset,

        // CIO dashboard
        aggAssetInherentRiskScoreRiskDashboardCIOTab:
          item.inherentRiskScoreRiskDashboardCIOTab,
        aggAssetInherentRiskLevelRiskDashboardCIOTab:
          item.inherentRiskLevelRiskDashboardCIOTab,
        aggAssetControlStrengthRiskDashboardCIOTab:
          item.controlStrengthRiskDashboardCIOTab,
        aggAssetResidualRiskScoreRiskDashboardCIOTab:
          item.residualRiskScoreRiskDashboardCIOTab,
        aggAssetResidualRiskLevelRiskDashboardCIOTab:
          item.residualRiskLevelRiskDashboardCIOTab,
        aggAssetInherentImpactInMillionDollarsRiskDashboardCIOTab:
          item.inherentImpactInMillionDollarsDRiskDashboardCIOTab,
        aggAssetResidualImpactInMillionDollarsRiskDashboardCIOTab:
          item.residualImpactInMillionDollarsRiskDashboardCIOTab,
        aggAssetTargetImpactRiskDashboardCIOTab:
          item.targetImpactRiskDashboardCIOTab,
        aggAssetTargetStrengthRiskDashboardCIOTab:
          item.targetStrengthRiskDashboardCIOTab,
        aggAssetTargetResidualRiskScoreRiskDashboardCIOTab:
          item.targetResidualRiskScoreRiskDashboardCIOTab,
        aggAssetTargetResidualRiskLevelRiskDashboardCIOTab:
          item.targetResidualRiskLevelRiskDashboardCIOTab,

        // timestamps
        assessmentCreatedTimestamp: item.assessmentCreatedDate,
        assessmentUpdatedTimestamp: item.assessmentModifiedDate,
        createdAt: now,
        updatedAt: now,
      }));

      const result = await models.ReportsMaster.bulkCreate(cleanedRecords, {
        returning: true,
      });

      return result;
    } catch (error) {
      console.error("Error inserting reports:", error);
      throw error;
    }
  }

  static normalizeRiskTypeLabels(name) {
    const map = {
      "financial risk": "financial",
      "regulatory risk": "regulatory",
      "reputational risk": "reputational",
      "operational risk": "operational",
    };

    return map[name] || name; // fallback if not found
  }
  static roundToOneDecimal(value) {
    if (typeof value !== "number") return null;
    return Math.round(value * 10) / 10;
  }

  static convertValueToMillion(value) {
    const num = Number(value);

    if (isNaN(num)) return null; // or return 0 if you prefer
    console.log(num, num / 1_000_000, num / 1000000);
    return num / 1_000_000;
  }

  static generateCSV(formatted, filePath = "./export.csv") {
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
  static aggregateMitreControlsByAsset(assessmentProcesses) {
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

  static calculateAssetScoresForAll(assets) {
    if (!Array.isArray(assets)) {
      throw new Error("Input must be an array of assets");
    }

    return assets.map((asset) => this.calculateAssetScores(asset));
  }

  static calculateAssetScores(asset) {
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
  static async enrichMitreControlsByMitreThreatRecords(assetList) {
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
        "mitreTechniqueId",
        "mitreTechniqueName",
        "subTechniqueId",
        "subTechniqueName",
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
        mitreTechniqueId: record.mitreTechniqueId,
        mitreTechniqueName: record.mitreTechniqueName,
        subTechniqueId: record.subTechniqueId,
        subTechniqueName: record.subTechniqueName,
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

  static createFlatAssessmentMatrixFromProcesses(assessmentProcesses) {
    const flatData = [];

    // --- Iterating through each Assessment Process ---
    for (let process of assessmentProcesses) {
      process = process.toJSON();
      console.log(process);
      const assessmentName = process.assessment.assessmentName;
      const assessmentId = process.assessmentId;
      const orgId = process.assessment.orgId;
      const orgName = process.assessment.orgName;
      const buName = process.assessment.businessUnitName || null;
      const buId = process.assessment.businessUnitId;
      const processName = process.processName;
      const processId = process.orgProcessId;
      const createdDate = process.createdDate;
      const modifiedDate = process.modifiedDate;
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
                assetName: null,
                assetCategory: null,
                mitreControlScores: [],
              },
            ];

      const finalRisks =
        process.riskScenarios.length > 0
          ? process.riskScenarios
          : [
              {
                riskScenario: null,
                riskDescription: null,
                taxonomy: [],
                riskScenarioBusinessImpacts: [],
              },
            ];

      // const proce
      // --- Perform the Cross-Join (Asset X Risk) ---
      for (const asset of finalAssets) {
        for (const risk of finalRisks) {
          const riskScenario = risk.riskScenario;

          const impactMap = risk.taxonomy.reduce((acc, tax) => {
            const name = this.normalizeRiskTypeLabels(
              tax.taxonomyName.toLowerCase()
            );

            acc[name] = {
              severityName: tax.severityName || null,
              severityMinRange: Number(tax.severityMinRange) || null,
              severityMaxRange: Number(tax.severityMaxRange) || null,
              weightage: Number(tax.weightage) || null,
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
            financialWeightage: impactMap.financial?.weightage || null,
            financialMinRange: impactMap.financial?.severityMinRange || null,
            financialMaxRange: impactMap.financial?.severityMaxRange || null,

            regulatory: impactMap.regulatory?.severityName || null,
            regulatoryWeightage: impactMap.regulatory?.weightage || null,
            regulatoryMinRange: impactMap.regulatory?.severityMinRange || null,
            regulatoryMaxRange: impactMap.regulatory?.severityMaxRange || null,

            reputational: impactMap.reputational?.severityName || null,
            reputationalWeightage: impactMap.reputational?.weightage || null,
            reputationalMinRange:
              impactMap.reputational?.severityMinRange || null,
            reputationalMaxRange:
              impactMap.reputational?.severityMaxRange || null,

            operational: impactMap.operational?.severityName || null,
            operationalWeightage: impactMap.operational?.weightage || null,
            operationalMinRange:
              impactMap.operational?.severityMinRange || null,
            operationalMaxRange:
              impactMap.operational?.severityMaxRange || null,
            mitreControlsAndScores: asset.mitreControlScores,
          });
        }
      }
    }

    return flatData;
  }

  static async fetchDataFromAssessment(
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
        console.log(
          `No latest assessments found for organization ID: ${orgId}`
        );
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
        console.log(
          `No latest assessments found for organization ID: ${orgId}`
        );
        return [];
      }

      where.assessmentId = { [Op.in]: organizationAssessmentsIds };
    }

    // --- 2. Fetch all required nested data based on the IDs ---
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
          as: "riskScenarios",
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

  static async insertBusinessAssetRisks(
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
  static mergeAndAddControlStrength(assessmentsArray, scoresArray) {
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
        assetCScore: score.C ?? null,
        assetIScore: score.I ?? null,
        assetAScore: score.A ?? null,
        assetCIAOverallScore: score.OVERALL ?? null,
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

  static risksToImpactCalculations(assessmentRecordsArray) {
    const updated = assessmentRecordsArray.map((item) => {
      let financialMinRange = Number(item.financialMinRange);
      let financialMaxRange = Number(item.financialMaxRange);
      let finacialImpactValueInDollar = this.convertValueToMillion(
        (financialMinRange + financialMaxRange) / 2
      );

      let regulatoryMinRange = Number(item.regulatoryMinRange);
      let regulatoryMaxRange = Number(item.regulatoryMaxRange);
      let regulatoryImpactValueInDollar = this.convertValueToMillion(
        (regulatoryMinRange + regulatoryMaxRange) / 2
      );

      let reputationalMinRange = Number(item.reputationalMinRange);
      let reputationalMaxRange = Number(item.reputationalMaxRange);
      let reputationalImpactValueInDollar = this.convertValueToMillion(
        (reputationalMinRange + reputationalMaxRange) / 2
      );

      let operationalMinRange = Number(item.operationalMinRange);
      let operationalMaxRange = Number(item.operationalMaxRange);
      let operationalImpactValueInDollar = this.convertValueToMillion(
        (operationalMinRange + operationalMaxRange) / 2
      );

      const financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel =
        finacialImpactValueInDollar;
      let rawInherentFinancialExposure =
        finacialImpactValueInDollar +
        (item.regulatoryWeightage * regulatoryImpactValueInDollar +
          item.reputationalWeightage * reputationalImpactValueInDollar +
          item.operationalWeightage * operationalImpactValueInDollar) /
          (item.regulatoryWeightage +
            +item.reputationalWeightage +
            item.operationalWeightage);
      let inherentFinancialExposureInMillionDollar = this.roundToOneDecimal(
        rawInherentFinancialExposure
      );
      let overallImpactScore =
        (item.regulatoryWeightage *
          impactLevelToNumMap[item.regulatory?.toLowerCase()] +
          item.reputationalWeightage *
            impactLevelToNumMap[item.reputational?.toLowerCase()] +
          item.financialWeightage *
            impactLevelToNumMap[item.financial?.toLowerCase()] +
          item.operationalWeightage *
            impactLevelToNumMap[item.operational?.toLowerCase()]) /
        (item.regulatoryWeightage +
          item.reputationalWeightage +
          item.financialWeightage +
          item.operationalWeightage);

      return {
        ...item,
        financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel:
          financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel,
        finacialImpactValueInMillionDollar: finacialImpactValueInDollar,
        regulatoryImpactValueInMillionDollar: regulatoryImpactValueInDollar,
        reputationalImpactValueInMillionDollar: reputationalImpactValueInDollar,
        operationalImpactValueInMillionDollar: operationalImpactValueInDollar,
        inherentFinancialExposure: inherentFinancialExposureInMillionDollar,
        overallImpactScore,
      };
    });
    return updated;
  }

  static riskDashboardERMTab(
    assessmentRecordsArray,
    assetControlScores,
    riskAppetite
  ) {
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

    function getControlStrengthRiskDashboardERMTabForAsset(
      ciaMapping,
      assetId
    ) {
      for (const asset of assetControlScores) {
        if (asset.assetId === assetId) {
          return asset[ciaMapping];
        }
      }
      return null;
    }

    const updated = assessmentRecordsArray.map((item) => {
      let inherentRiskScoreRiskDashboardERMTab = item.overallImpactScore;
      let inherentRiskLevelRiskDashboardERMTab = getRiskLevel(
        inherentRiskScoreRiskDashboardERMTab
      );
      let controlStrengthRiskDashboardERMTab = null;
      let residualRiskScoreRiskDashboardERMTab = null;
      let residualRiskLevelRiskDashboardERMTab = null;
      let inherentImpactInMillionDollarsRiskDashboardERMTab =
        this.roundToOneDecimal(item.inherentFinancialExposure) ?? null;
      let residualImpactInMillionDollarsRiskDashboardERMTab = null;
      let targetImpactInMillionDollarsRiskDashboardERMTab = null;

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
          residualRiskScoreRiskDashboardERMTab = this.roundToOneDecimal(
            rawResidualRiskScoreRiskDashboardERMTab
          );
          residualRiskLevelRiskDashboardERMTab = getRiskLevel(
            residualRiskScoreRiskDashboardERMTab
          );

          let rawResidualImpactInMillionDollarsRiskDashboardERMTab =
            (inherentImpactInMillionDollarsRiskDashboardERMTab *
              (5.25 - controlStrengthRiskDashboardERMTab)) /
            5;
          residualImpactInMillionDollarsRiskDashboardERMTab =
            this.roundToOneDecimal(
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
        organizationRiskAppetiteInMillionDollar: riskAppetite,
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

  static riskDashboardBusinessTab(dataArray, riskAppetite) {
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
        stats?.maxOverallImpactScore ?? null;
      const inherentRiskLevelRiskDashboardBusinessTab = getRiskLevel(
        inherentRiskScoreRiskDashboardBusinessTab
      );
      const controlStrengthRiskDashboardBusinessTab =
        stats?.totalControlStrength / stats?.count ?? null;
      const rawResidualRiskScoreRiskDashboardBusinessTab =
        (inherentRiskScoreRiskDashboardBusinessTab *
          (5.25 - controlStrengthRiskDashboardBusinessTab)) /
        5;
      const residualRiskScoreRiskDashboardBusinessTab = this.roundToOneDecimal(
        rawResidualRiskScoreRiskDashboardBusinessTab
      );
      const residualRiskLevelRiskDashboardBusinessTab = getRiskLevel(
        residualRiskScoreRiskDashboardBusinessTab
      );
      const rawInherentImpactInMillionDollarsRiskDashboardBusinessTab =
        stats.maxInherentFinancialExposure ?? null;
      const inherentImpactInMillionDollarsRiskDashboardBusinessTab =
        this.roundToOneDecimal(
          rawInherentImpactInMillionDollarsRiskDashboardBusinessTab
        ) ?? null;

      const rawResidualImpactInMillionDollarsRiskDashboardBusinessTab =
        (inherentImpactInMillionDollarsRiskDashboardBusinessTab *
          (5.25 - controlStrengthRiskDashboardBusinessTab)) /
        5;
      const residualImpactInMillionDollarsRiskDashboardBusinessTab =
        this.roundToOneDecimal(
          rawResidualImpactInMillionDollarsRiskDashboardBusinessTab
        );

      const targetImpactRiskDashboardBusinessTab =
        residualImpactInMillionDollarsRiskDashboardBusinessTab < riskAppetite
          ? residualImpactInMillionDollarsRiskDashboardBusinessTab
          : riskAppetite;
      const rawtargetStrengthRiskDashboardBusinessTab =
        5 -
        (targetImpactRiskDashboardBusinessTab * 5) /
          inherentImpactInMillionDollarsRiskDashboardBusinessTab;
      const targetStrengthRiskDashboardBusinessTab = this.roundToOneDecimal(
        rawtargetStrengthRiskDashboardBusinessTab
      );
      const rawTargetResidualRiskRiskDashboardBusinessTab =
        (inherentRiskScoreRiskDashboardBusinessTab *
          (5.25 - targetStrengthRiskDashboardBusinessTab)) /
        5;
      const targetResidualRiskRiskDashboardBusinessTab = this.roundToOneDecimal(
        rawTargetResidualRiskRiskDashboardBusinessTab
      );
      const targetResidualRiskLevelRiskDashboardBusinessTab = getRiskLevel(
        targetResidualRiskRiskDashboardBusinessTab
      );
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
        inherentImpactInMillionDollarsRiskDashboardBusinessTab:
          inherentImpactInMillionDollarsRiskDashboardBusinessTab,
        residualImpactInMillionDollarsRiskDashboardBusinessTab:
          residualImpactInMillionDollarsRiskDashboardBusinessTab,
        targetImpactRiskDashboardBusinessTab:
          targetImpactRiskDashboardBusinessTab,
        targetStrengthRiskDashboardBusinessTab:
          targetStrengthRiskDashboardBusinessTab,
        targetResidualRiskRiskDashboardBusinessTab:
          targetResidualRiskRiskDashboardBusinessTab,
        targetResidualRiskLevelRiskDashboardBusinessTab:
          targetResidualRiskLevelRiskDashboardBusinessTab,
      };
    });
  }

  static processToAssetBusinesssProcessLevelCalculations(dataArray) {
    return dataArray.map((item) => {
      const businessProcessInherentRiskProcessToAsset =
        item.inherentRiskScoreRiskDashboardBusinessTab;
      const businessProcessinherentImpactInMillionDollarsProcessToAsset =
        item.inherentImpactInMillionDollarsRiskDashboardBusinessTab;
      return {
        ...item,
        businessProcessInherentRiskProcessToAsset:
          businessProcessInherentRiskProcessToAsset,
        businessProcessinherentImpactInMillionDollarsProcessToAsset:
          businessProcessinherentImpactInMillionDollarsProcessToAsset,
      };
    });
  }
  static riskDashboardCIOTab(dataArray, assetControlScores, riskAppetite) {
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
      return null;
    }
    // 1. Build map with running max only
    for (const item of dataArray) {
      const key = `${item.assetId}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          maxBusinessProcessInherentImpact:
            typeof item.businessProcessinherentImpactInMillionDollarsProcessToAsset ===
            "number"
              ? item.businessProcessinherentImpactInMillionDollarsProcessToAsset
              : 0,
          totalBusinessProcessInherentRisk:
            typeof item.businessProcessInherentRiskProcessToAsset === "number"
              ? item.businessProcessInherentRiskProcessToAsset
              : 0,
          countBusinessProcessInherentRisk:
            typeof item.businessProcessInherentRiskProcessToAsset === "number"
              ? 1
              : 0,
        });
      } else {
        const stats = groupMap.get(key);
        // Update max component
        if (
          typeof item.businessProcessinherentImpactInMillionDollarsProcessToAsset ===
            "number" &&
          item.businessProcessinherentImpactInMillionDollarsProcessToAsset >
            stats.maxBusinessProcessInherentImpact
        ) {
          stats.maxBusinessProcessInherentImpact =
            item.businessProcessinherentImpactInMillionDollarsProcessToAsset;
        }
        // Update average components
        if (typeof item.controlStrengthProcessToAsset === "number") {
          stats.totalBusinessProcessInherentRisk +=
            item.businessProcessInherentRiskProcessToAsset;
          stats.countBusinessProcessInherentRisk += 1;
        }
      }
    }

    return dataArray.map((item) => {
      const key = `${item.assetId}`;
      const stats = groupMap.get(key);
      const rawInherentRiskScoreRiskDashboardCIOTab =
        stats.countBusinessProcessInherentRisk > 0
          ? stats?.totalBusinessProcessInherentRisk ??
            0 / stats.countBusinessProcessInherentRisk
          : 0;
      const inherentRiskScoreRiskDashboardCIOTab = this.roundToOneDecimal(
        rawInherentRiskScoreRiskDashboardCIOTab
      );
      const inherentRiskLevelRiskDashboardCIOTab = getRiskLevel(
        inherentRiskScoreRiskDashboardCIOTab
      );
      const controlStrengthRiskDashboardCIOTab = getControlStrengthForAsset(
        "OVERALL",
        item.assetId
      );
      const rawResidualRiskScoreRiskDashboardCIOTab =
        (inherentRiskScoreRiskDashboardCIOTab *
          (5.25 - controlStrengthRiskDashboardCIOTab)) /
        5;
      const residualRiskScoreRiskDashboardCIOTab = this.roundToOneDecimal(
        rawResidualRiskScoreRiskDashboardCIOTab
      );
      const residualRiskLevelRiskDashboardCIOTab = getRiskLevel(
        residualRiskScoreRiskDashboardCIOTab
      );
      const inherentImpactInMillionDollarsDRiskDashboardCIOTab =
        stats.maxBusinessProcessInherentImpact ?? 0;
      const rawResidualImpactRiskDashboardCIOTab =
        (inherentImpactInMillionDollarsDRiskDashboardCIOTab *
          (5.25 - controlStrengthRiskDashboardCIOTab)) /
        5;
      const residualImpactInMillionDollarsRiskDashboardCIOTab =
        this.roundToOneDecimal(rawResidualImpactRiskDashboardCIOTab);
      const targetImpactRiskDashboardCIOTab =
        residualImpactInMillionDollarsRiskDashboardCIOTab < riskAppetite
          ? residualImpactInMillionDollarsRiskDashboardCIOTab
          : riskAppetite;
      const rawTargetStrengthRiskDashboardCIOTab =
        5 -
        (targetImpactRiskDashboardCIOTab * 5) /
          inherentImpactInMillionDollarsDRiskDashboardCIOTab;
      const targetStrengthRiskDashboardCIOTab = this.roundToOneDecimal(
        rawTargetStrengthRiskDashboardCIOTab
      );
      const rawTargetResidualRiskScoreRiskDashboardCIOTab =
        (inherentRiskScoreRiskDashboardCIOTab *
          (5.25 - targetStrengthRiskDashboardCIOTab)) /
        5;
      const targetResidualRiskScoreRiskDashboardCIOTab = this.roundToOneDecimal(
        rawTargetResidualRiskScoreRiskDashboardCIOTab
      );
      const targetResidualRiskLevelRiskDashboardCIOTab = getRiskLevel(
        targetResidualRiskScoreRiskDashboardCIOTab
      );

      return {
        ...item,
        inherentRiskScoreRiskDashboardCIOTab:
          inherentRiskScoreRiskDashboardCIOTab,
        inherentRiskLevelRiskDashboardCIOTab:
          inherentRiskLevelRiskDashboardCIOTab,
        controlStrengthRiskDashboardCIOTab: controlStrengthRiskDashboardCIOTab,
        residualRiskScoreRiskDashboardCIOTab:
          residualRiskScoreRiskDashboardCIOTab,
        residualRiskLevelRiskDashboardCIOTab:
          residualRiskLevelRiskDashboardCIOTab,
        inherentImpactInMillionDollarsDRiskDashboardCIOTab:
          inherentImpactInMillionDollarsDRiskDashboardCIOTab,
        residualImpactInMillionDollarsRiskDashboardCIOTab:
          residualImpactInMillionDollarsRiskDashboardCIOTab,
        targetImpactRiskDashboardCIOTab: targetImpactRiskDashboardCIOTab,
        targetStrengthRiskDashboardCIOTab: targetStrengthRiskDashboardCIOTab,
        targetResidualRiskScoreRiskDashboardCIOTab:
          targetResidualRiskScoreRiskDashboardCIOTab,
        targetResidualRiskLevelRiskDashboardCIOTab:
          targetResidualRiskLevelRiskDashboardCIOTab,
      };
    });
  }

  static async generateFlatAssessmentMatrix(orgId, active = true) {
    const org = await models.Organization.findOne({
      where: { organizationId: orgId },
      attributes: ["riskAppetite"], // only fetch riskAppetite
    });
    if (!org) {
      throw new Error("Invalid Org ID ");
    }
    const rawRiskAppetite = org ? org.riskAppetite : null;
    const riskAppetite = this.convertValueToMillion(rawRiskAppetite);
    const assessmentProcesses = await this.fetchDataFromAssessment(
      orgId,
      [],
      true
    );
    const d = this.createFlatAssessmentMatrixFromProcesses(assessmentProcesses);
    const b = this.aggregateMitreControlsByAsset(assessmentProcesses);
    const c = await this.enrichMitreControlsByMitreThreatRecords(b);
    const assetControlScores = this.calculateAssetScoresForAll(c);
    const finalArray = this.mergeAndAddControlStrength(d, assetControlScores);
    const riskToImpact = this.risksToImpactCalculations(finalArray);
    const ermTab = this.riskDashboardERMTab(
      riskToImpact,
      assetControlScores,
      riskAppetite
    );
    const businessTab = this.riskDashboardBusinessTab(ermTab, riskAppetite);
    const processToAssetBPLevelValues =
      this.processToAssetBusinesssProcessLevelCalculations(businessTab);
    const cioTab = this.riskDashboardCIOTab(
      processToAssetBPLevelValues,
      assetControlScores,
      riskAppetite
    );
    this.insertReportsMaster(cioTab);
    return cioTab;
  }

  static async getLastSyncupDetails(orgId) {
    const json = {
      businessUnits: 4,
      businessProcesses: 5,
      riskScenarios: 6,
      assets: 4,
      lastDayDateTime: new Date(Date.now() - 86400000).toISOString(),
    };
    return json
  }
}

module.exports = SyncupService;

// async function insertReportsMaster(records) {
//   try {
//     const now = new Date();
//     if (!Array.isArray(records)) {
//       throw new Error("Input must be an array");
//     }

//     // Validate incoming array
//     const cleanedRecords = records.map((item) => ({
//       // Basic assessment
//       assessmentId: item.assessmentId,
//       assessmentName: item.assessmentName,

//       orgId: item.orgId,
//       orgName: item.orgName,
//       organizationRiskAppetiteInMillionDollar:
//         item.organizationRiskAppetiteInMillionDollar,

//       businessUnitId: item.businessUnitId,
//       businessUnit: item.businessUnit,

//       businessProcessId: item.businessProcessId,
//       businessProcess: item.businessProcess,

//       assetId: item.assetId,
//       asset: item.asset,
//       assetCategory: item.assetCategory,

//       riskScenarioId: item.riskScenarioId,
//       riskScenario: item.riskScenario,
//       riskScenarioCIAMapping: item.riskScenarioCIAMapping,

//       // Financial / Regulatory / Reputational / Operational
//       financial: item.financial,
//       financialWeightage: item.financialWeightage,
//       financialMinRange: item.financialMinRange,
//       financialMaxRange: item.financialMaxRange,

//       regulatory: item.regulatory,
//       regulatoryWeightage: item.regulatoryWeightage,
//       regulatoryMinRange: item.regulatoryMinRange,
//       regulatoryMaxRange: item.regulatoryMaxRange,

//       reputational: item.reputational,
//       reputationalWeightage: item.reputationalWeightage,
//       reputationalMinRange: item.reputationalMinRange,
//       reputationalMaxRange: item.reputationalMaxRange,

//       operational: item.operational,
//       operationalWeightage: item.operationalWeightage,
//       operationalMinRange: item.operationalMinRange,
//       operationalMaxRange: item.operationalMaxRange,

//       mitreControlsAndScores: item.mitreControlsAndScores,

//       // CIA Scores
//       aggAssetCScore: item.assetCScore,
//       aggAssetIScore: item.assetIScore,
//       aggAssetAScore: item.assetAScore,
//       aggAssetCIAOverallScore: item.assetCIAOverallScore,

//       // Strength
//       aggAssetControlStrengthProcessToAsset: item.controlStrengthProcessToAsset,
//       aggBuBpControlStrengthRisksToImpacts: item.controlStrengthRisksToImpacts,

//       // Impact values
//       financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModelRisksToImpacts:
//         item.financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel,

//       financialImpactValueInMillionDollar:
//         item.finacialImpactValueInMillionDollar,
//       regulatoryImpactValueInMillionDollar:
//         item.regulatoryImpactValueInMillionDollar,
//       reputationalImpactValueInMillionDollar:
//         item.reputationalImpactValueInMillionDollar,
//       operationalImpactValueInMillionDollar:
//         item.operationalImpactValueInMillionDollar,

//       inherentFinancialExposureRisksToImpacts: item.inherentFinancialExposure,
//       overallImpactScoreRisksToImpacts: item.overallImpactScore,

//       // ERM dashboard
//       inherentRiskScoreRiskDashboardERMTab:
//         item.inherentRiskScoreRiskDashboardERMTab,
//       inherentRiskLevelRiskDashboardERMTab:
//         item.inherentRiskLevelRiskDashboardERMTab,
//       controlStrengthRiskDashboardERMTab:
//         item.controlStrengthRiskDashboardERMTab,
//       residualRiskScoreRiskDashboardERMTab:
//         item.residualRiskScoreRiskDashboardERMTab,
//       residualRiskLevelRiskDashboardERMTab:
//         item.residualRiskLevelRiskDashboardERMTab,
//       inherentImpactInMillionDollarsRiskDashboardERMTab:
//         item.inherentImpactInMillionDollarsRiskDashboardERMTab,
//       residualImpactInMillionDollarsRiskDashboardERMTab:
//         item.residualImpactInMillionDollarsRiskDashboardERMTab,
//       targetImpactInMillionDollarsRiskDashboardERMTab:
//         item.targetImpactInMillionDollarsRiskDashboardERMTab,

//       // Business dashboard
//       aggBuBpInherentRiskScoreRiskDashboardBusinessTab:
//         item.inherentRiskScoreRiskDashboardBusinessTab,
//       aggBuBpInherentRiskLevelRiskDashboardBusinessTab:
//         item.inherentRiskLevelRiskDashboardBusinessTab,
//       aggBuBpControlStrengthRiskDashboardBusinessTab:
//         item.controlStrengthRiskDashboardBusinessTab,
//       aggBuBpResidualRiskScoreRiskDashboardBusinessTab:
//         item.residualRiskScoreRiskDashboardBusinessTab,
//       aggBuBpResidualRiskLevelRiskDashboardBusinessTab:
//         item.residualRiskLevelRiskDashboardBusinessTab,
//       aggBuBpInherentImpactInMillionDollarsRiskDashboardBusinessTab:
//         item.inherentImpactInMillionDollarsRiskDashboardBusinessTab,
//       aggBuBpResidualImpactInMillionDollarsRiskDashboardBusinessTab:
//         item.residualImpactInMillionDollarsRiskDashboardBusinessTab,
//       aggBuBpTargetImpactRiskDashboardBusinessTab:
//         item.targetImpactRiskDashboardBusinessTab,
//       aggBuBpTargetStrengthRiskDashboardBusinessTab:
//         item.targetStrengthRiskDashboardBusinessTab,
//       aggBuBpTargetResidualRiskRiskDashboardBusinessTab:
//         item.targetResidualRiskRiskDashboardBusinessTab,
//       aggBuBpTargetResidualRiskLevelRiskDashboardBusinessTab:
//         item.targetResidualRiskLevelRiskDashboardBusinessTab,

//       // Process to asset
//       businessProcessInherentRiskProcessToAsset:
//         item.businessProcessInherentRiskProcessToAsset,
//       businessProcessInherentImpactInMillionDollarsProcessToAsset:
//         item.businessProcessinherentImpactInMillionDollarsProcessToAsset,

//       // CIO dashboard
//       aggAssetInherentRiskScoreRiskDashboardCIOTab:
//         item.inherentRiskScoreRiskDashboardCIOTab,
//       aggAssetInherentRiskLevelRiskDashboardCIOTab:
//         item.inherentRiskLevelRiskDashboardCIOTab,
//       aggAssetControlStrengthRiskDashboardCIOTab:
//         item.controlStrengthRiskDashboardCIOTab,
//       aggAssetResidualRiskScoreRiskDashboardCIOTab:
//         item.residualRiskScoreRiskDashboardCIOTab,
//       aggAssetResidualRiskLevelRiskDashboardCIOTab:
//         item.residualRiskLevelRiskDashboardCIOTab,
//       aggAssetInherentImpactInMillionDollarsRiskDashboardCIOTab:
//         item.inherentImpactInMillionDollarsDRiskDashboardCIOTab,
//       aggAssetResidualImpactInMillionDollarsRiskDashboardCIOTab:
//         item.residualImpactInMillionDollarsRiskDashboardCIOTab,
//       aggAssetTargetImpactRiskDashboardCIOTab:
//         item.targetImpactRiskDashboardCIOTab,
//       aggAssetTargetStrengthRiskDashboardCIOTab:
//         item.targetStrengthRiskDashboardCIOTab,
//       aggAssetTargetResidualRiskScoreRiskDashboardCIOTab:
//         item.targetResidualRiskScoreRiskDashboardCIOTab,
//       aggAssetTargetResidualRiskLevelRiskDashboardCIOTab:
//         item.targetResidualRiskLevelRiskDashboardCIOTab,

//       // timestamps
//       assessmentCreatedTimestamp: item.assessmentCreatedDate,
//       assessmentUpdatedTimestamp: item.assessmentModifiedDate,
//       createdAt: now,
//       updatedAt: now,
//     }));

//     const result = await models.ReportsMaster.bulkCreate(cleanedRecords, {
//       returning: true,
//     });

//     return result;
//   } catch (error) {
//     console.error("Error inserting reports:", error);
//     throw error;
//   }
// }

// function normalizeRiskTypeLabels(name) {
//   const map = {
//     "financial risk": "financial",
//     "regulatory risk": "regulatory",
//     "reputational risk": "reputational",
//     "operational risk": "operational",
//   };

//   return map[name] || name; // fallback if not found
// }
// function roundToOneDecimal(value) {
//   if (typeof value !== "number") return null;
//   return Math.round(value * 10) / 10;
// }

// function convertValueToMillion(value) {
//   const num = Number(value);

//   if (isNaN(num)) return null; // or return 0 if you prefer
//   console.log(num, num / 1_000_000, num / 1000000);
//   return num / 1_000_000;
// }

// async function generateCSV(formatted, filePath = "./export.csv") {
//   const CSV_COLUMNS = [
//     "id",
//     "assessmentId",
//     "assessmentName",
//     "orgId",
//     "orgName",
//     "businessUnitId",
//     "businessUnit",
//     "businessProcessId",
//     "businessProcess",
//     "assetId",
//     "asset",
//     "assetCategory",
//     "riskScenarioId",
//     "riskScenario",
//     "riskScenarioCIAMapping",
//     "financial",
//     "financialMinRange",
//     "financialMaxRange",
//     "regulatory",
//     "regulatoryMinRange",
//     "regulatoryMaxRange",
//     "reputational",
//     "reputationalMinRange",
//     "reputationalMaxRange",
//     "operational",
//     "operationalMinRange",
//     "operationalMaxRange",
//     "mitreControlsAndScores",
//     "assessmentCreatedTimestamp",
//     "assessmentUpdatedTimestamp",
//   ];

//   return new Promise((resolve, reject) => {
//     const ws = fs.createWriteStream(filePath);

//     const csvStream = format({
//       headers: CSV_COLUMNS,
//     })
//       .on("finish", () => resolve(filePath))
//       .on("error", reject);

//     csvStream.pipe(ws);

//     formatted.forEach((row) => {
//       const outputRow = {};

//       CSV_COLUMNS.forEach((col) => {
//         let value = row[col];

//         // Handle arrays and JSON properly
//         if (col === "riskScenarioCIAMapping" && Array.isArray(value)) {
//           value = value.join(",");
//         }

//         if (col === "mitreControlsAndScores") {
//           value = JSON.stringify(value);
//         }

//         outputRow[col] = value ?? "";
//       });

//       csvStream.write(outputRow);
//     });

//     csvStream.end();
//   });
// }
// function aggregateMitreControlsByAsset(assessmentProcesses) {
//   const assetMap = new Map();

//   // Helper to determine score (0 for null/undefined)
//   const getScore = (responseValue) => {
//     // null or undefined responseValue is treated as 0.
//     return responseValue === null || responseValue === undefined
//       ? 0
//       : responseValue;
//   };

//   // --- 1. Pass 1: Identify the Latest Asset Record and Collect its Controls ---
//   for (const process of assessmentProcesses) {
//     for (const asset of process.assets) {
//       const assetId = asset.id;
//       const assetName = asset.applicationName;
//       const assetCategory = asset.assetCategory;
//       const assetModifiedDate = new Date(asset.modified_date);

//       if (!assetName) continue;

//       const existingAsset = assetMap.get(assetName);

//       // Check if this asset record is newer than the one currently stored
//       if (!existingAsset || assetModifiedDate > existingAsset.modified_date) {
//         // --- This is the new latest asset record, so we overwrite the stored data ---

//         const mitreControlScores = [];

//         // Extract all Mitre Controls and their scores from the questionnaire
//         for (const q of asset.questionnaire) {
//           if (q.questionaire && q.questionaire.mitreControlId) {
//             const score = getScore(q.responseValue);

//             // A single questionnaire entry can cover multiple Mitre Controls
//             for (const controlId of q.questionaire.mitreControlId) {
//               mitreControlScores.push({
//                 id: controlId,
//                 score: score,
//               });
//             }
//           }
//         }

//         // Store the latest asset's details and its complete set of controls
//         assetMap.set(assetName, {
//           assetId: assetId,
//           assetCategory: assetCategory,
//           modified_date: assetModifiedDate,
//           // Use a Set to easily handle duplicates within this single asset's controls
//           Controls: new Map(mitreControlScores.map((c) => [c.id, c.score])),
//         });
//       }
//       // If the current asset record is older, we ignore it completely.
//     }
//   }

//   // --- 2. Pass 2: Final Formatting ---
//   const aggregatedAssets = [];
//   for (const [assetName, assetRecord] of assetMap.entries()) {
//     const formattedControls = [];

//     // Convert the control map (which is already de-duplicated by ID) back into the required array of JSON objects
//     for (const [id, score] of assetRecord["Controls"].entries()) {
//       formattedControls.push({
//         id: id,
//         score: score,
//       });
//     }

//     aggregatedAssets.push({
//       assetId: assetRecord["assetId"],
//       assetName: assetName,
//       assetCategory: assetRecord["assetCategory"],
//       mitreControlsAndScores: formattedControls,
//     });
//   }

//   return aggregatedAssets;
// }

// function calculateAssetScoresForAll(assets) {
//   if (!Array.isArray(assets)) {
//     throw new Error("Input must be an array of assets");
//   }

//   return assets.map((asset) => calculateAssetScores(asset));
// }

// function calculateAssetScores(asset) {
//   const CIA_TYPES = ["C", "I", "A"];

//   // initialize totals
//   const totals = {
//     C: { num: 0, den: 0 },
//     I: { num: 0, den: 0 },
//     A: { num: 0, den: 0 },
//     OVERALL: { num: 0, den: 0 },
//   };

//   for (const control of asset["mitreControlsAndScores"] || []) {
//     const baseScore = control.score || 0;
//     if (baseScore === -1) continue;

//     for (const result of control.results || []) {
//       const priority = result.controlPriority || 0;
//       const typeScore = result.mitreControlType === "MITIGATION" ? 3 : 1;

//       const weight = typeScore * priority;
//       const weightedScore = baseScore * 2.5 * weight;

//       // add to each CIA bucket the result applies to
//       for (const cia of result.ciaMapping || []) {
//         if (CIA_TYPES.includes(cia)) {
//           console.log("adding value", weightedScore, weight);
//           totals[cia].num += weightedScore;
//           totals[cia].den += weight;
//         }
//       }

//       // overall calculation includes ALL results, no CIA filtering
//       totals.OVERALL.num += weightedScore;
//       totals.OVERALL.den += weight;
//     }
//   }

//   // final scores
//   const finalScores = {
//     assetId: asset["assetId"],
//     assetName: asset["assetName"],
//     assetCategory: asset["assetCategory"],
//   };

//   for (const type of CIA_TYPES) {
//     console.log(totals[type].num, totals[type].den);
//     finalScores[type] =
//       totals[type].den === 0
//         ? 0
//         : Number((totals[type].num / totals[type].den).toFixed(2));
//   }

//   finalScores["OVERALL"] =
//     totals.OVERALL.den === 0
//       ? 0
//       : Number((totals.OVERALL.num / totals.OVERALL.den).toFixed(2));

//   return finalScores;
// }
// async function enrichMitreControlsByMitreThreatRecords(assetList) {
//   // 1. Gather unique MITRE control IDs
//   const allControlIds = [
//     ...new Set(
//       assetList.flatMap((asset) =>
//         asset["mitreControlsAndScores"].map((c) => c.id)
//       )
//     ),
//   ];

//   // 2. Fetch all MITRE control rows
//   const controlRecords = await models.MitreThreatControl.findAll({
//     where: { mitreControlId: allControlIds },
//     attributes: [
//       "mitreTechniqueId",
//       "mitreTechniqueName",
//       "subTechniqueId",
//       "subTechniqueName",
//       "mitreControlId",
//       "ciaMapping",
//       "controlPriority",
//       "mitreControlType",
//     ],
//   });

//   // 3. Build lookup map: id → array of rows
//   const controlMap = {};

//   for (const record of controlRecords) {
//     const id = record.mitreControlId;

//     if (!controlMap[id]) {
//       controlMap[id] = [];
//     }

//     controlMap[id].push({
//       mitreTechniqueId: record.mitreTechniqueId,
//       mitreTechniqueName: record.mitreTechniqueName,
//       subTechniqueId: record.subTechniqueId,
//       subTechniqueName: record.subTechniqueName,
//       ciaMapping: record.ciaMapping,
//       controlPriority: record.controlPriority,
//       mitreControlType: record.mitreControlType,
//     });
//   }

//   // 4. Enrich incoming assets
//   const enrichedAssets = assetList.map((asset) => {
//     const updatedControls = asset["mitreControlsAndScores"].map((control) => {
//       const records = controlMap[control.id] || [];

//       return {
//         id: control.id,
//         score: control.score,
//         results: records, // <-- MULTIPLE RESULTS HERE
//       };
//     });

//     return {
//       ...asset,
//       mitreControlsAndScores: updatedControls,
//     };
//   });

//   return enrichedAssets;
// }

// function createFlatAssessmentMatrixFromProcesses(assessmentProcesses) {
//   const flatData = [];

//   // --- Iterating through each Assessment Process ---
//   for (let process of assessmentProcesses) {
//     process = process.toJSON();
//     console.log(process);
//     const assessmentName = process.assessment.assessmentName;
//     const assessmentId = process.assessmentId;
//     const orgId = process.assessment.orgId;
//     const orgName = process.assessment.orgName;
//     const buName = process.assessment.businessUnitName || null;
//     const buId = process.assessment.businessUnitId;
//     const processName = process.processName;
//     const processId = process.orgProcessId;
//     const createdDate = process.createdDate;
//     const modifiedDate = process.modifiedDate;
//     // Extract Mitre Control IDs and Score/Response for each Asset
//     const assetDetails = process.assets.map((asset) => {
//       const mitreControlScores = []; // Array to hold [{id: ..., score: ...}, ...]

//       for (const q of asset.questionnaire) {
//         if (q.questionaire && q.questionaire.mitreControlId) {
//           // Determine the score, using 0 if responseValue is null or undefined
//           const score =
//             q.responseValue === null || q.responseValue === undefined
//               ? 0
//               : q.responseValue;

//           // A single questionnaire entry can cover multiple Mitre Controls
//           for (const controlId of q.questionaire.mitreControlId) {
//             // Push the individual control and its score to the array
//             mitreControlScores.push({
//               id: controlId,
//               score: score,
//             });
//           }
//         }
//       }

//       return {
//         assetId: asset.id,
//         assetModifiedDate: asset.modified_date,
//         assetName: asset.applicationName,
//         assetCategory: asset.assetCategory,
//         mitreControlScores: mitreControlScores,
//       };
//     });

//     // Use default placeholders if no assets or risks are found for cross-joining
//     const finalAssets =
//       assetDetails.length > 0
//         ? assetDetails
//         : [
//             {
//               assetName: null,
//               assetCategory: null,
//               mitreControlScores: [],
//             },
//           ];

//     const finalRisks =
//       process.riskScenarios.length > 0
//         ? process.riskScenarios
//         : [
//             {
//               riskScenario: null,
//               riskDescription: null,
//               taxonomy: [],
//               riskScenarioBusinessImpacts: [],
//             },
//           ];

//     // const proce
//     // --- Perform the Cross-Join (Asset X Risk) ---
//     for (const asset of finalAssets) {
//       for (const risk of finalRisks) {
//         const riskScenario = risk.riskScenario;

//         const impactMap = risk.taxonomy.reduce((acc, tax) => {
//           const name = normalizeRiskTypeLabels(tax.taxonomyName.toLowerCase());

//           acc[name] = {
//             severityName: tax.severityName || null,
//             severityMinRange: Number(tax.severityMinRange) || null,
//             severityMaxRange: Number(tax.severityMaxRange) || null,
//             weightage: Number(tax.weightage) || null,
//           };

//           return acc;
//         }, {});

//         flatData.push({
//           assessmentCreatedDate: createdDate,
//           assessmentModifiedDate: modifiedDate,
//           assessmentId: assessmentId,
//           assessmentName: assessmentName,
//           orgId: orgId,
//           orgName: orgName,
//           businessUnitId: buId,
//           businessUnit: buName,
//           businessProcessId: processId ?? null,
//           businessProcess: processName,
//           assetId: asset.assetId,
//           asset: asset.assetName,
//           assetCategory: asset.assetCategory,
//           riskScenarioId: risk.id,
//           riskScenario: riskScenario,
//           riskScenarioCIAMapping: risk?.orgRiskScenario?.ciaMapping ?? [],
//           financial: impactMap.financial?.severityName || null,
//           financialWeightage: impactMap.financial?.weightage || null,
//           financialMinRange: impactMap.financial?.severityMinRange || null,
//           financialMaxRange: impactMap.financial?.severityMaxRange || null,

//           regulatory: impactMap.regulatory?.severityName || null,
//           regulatoryWeightage: impactMap.regulatory?.weightage || null,
//           regulatoryMinRange: impactMap.regulatory?.severityMinRange || null,
//           regulatoryMaxRange: impactMap.regulatory?.severityMaxRange || null,

//           reputational: impactMap.reputational?.severityName || null,
//           reputationalWeightage: impactMap.reputational?.weightage || null,
//           reputationalMinRange:
//             impactMap.reputational?.severityMinRange || null,
//           reputationalMaxRange:
//             impactMap.reputational?.severityMaxRange || null,

//           operational: impactMap.operational?.severityName || null,
//           operationalWeightage: impactMap.operational?.weightage || null,
//           operationalMinRange: impactMap.operational?.severityMinRange || null,
//           operationalMaxRange: impactMap.operational?.severityMaxRange || null,
//           mitreControlsAndScores: asset.mitreControlScores,
//         });
//       }
//     }
//   }

//   return flatData;
// }

// async function fetchDataFromAssessment(
//   orgId,
//   assessmentIds = [],
//   active = false
// ) {
//   if (!models || !models.sequelize || !models.Sequelize) {
//     throw new Error(
//       "Sequelize models object, sequelize instance, and Sequelize package object (for Op) are required."
//     );
//   }

//   const Op = models.Sequelize.Op;
//   let latestAssessmentIds = [];
//   let organizationAssessmentsIds = [];

//   if (!orgId) {
//     throw new Error("Organization ID (orgId) is required.");
//   }
//   const where = {
//     isDeleted: false,
//   };

//   if (assessmentIds.length > 0) {
//     where.assessmentId = { [Op.in]: assessmentIds };
//   } else if (active == true) {
//     // --- 1. Find the Assessment IDs (Latest per Business Unit, filtered by Org ID) ---
//     const latestAssessmentsQuery = `
//         SELECT
//             "assessment_id"
//         FROM (
//             SELECT
//                 "assessment_id",
//                 "business_unit_id",
//                 "created_date",
//                 "modified_date",
//                 ROW_NUMBER() OVER (PARTITION BY "business_unit_id" ORDER BY "modified_date" DESC) as rn
//             FROM public."assessment"
//             WHERE
//                 "business_unit_id" IS NOT NULL
//                 AND "is_deleted" = FALSE
//                 AND "org_id" = :orgId
//         ) AS subquery
//         WHERE rn = 1;
//     `;

//     const rawQueryResult = await models.sequelize.query(
//       latestAssessmentsQuery,
//       {
//         replacements: { orgId: orgId },
//         type: models.sequelize.QueryTypes.SELECT,
//       }
//     );

//     // Handle the different return formats of raw queries to ensure we have an array
//     const queryResults =
//       Array.isArray(rawQueryResult) && Array.isArray(rawQueryResult[0])
//         ? rawQueryResult[0]
//         : rawQueryResult;

//     if (!Array.isArray(queryResults)) {
//       console.error("Raw SQL query did not return a map-able array.");
//       return [];
//     }

//     latestAssessmentIds = queryResults.map((r) => r.assessment_id);

//     if (latestAssessmentIds.length === 0) {
//       console.log(`No latest assessments found for organization ID: ${orgId}`);
//       return [];
//     }

//     where.assessmentId = { [Op.in]: latestAssessmentIds };
//   } else {
//     const organizationAssessmentsQuery = `
//       SELECT "assessment_id"
//       FROM public."assessment"
//       WHERE
//           "org_id" = :orgId
//           AND "is_deleted" = FALSE
//           AND "assessment_id" IS NOT NULL;
//     `;

//     const rawQueryResult = await models.sequelize.query(
//       organizationAssessmentsQuery,
//       {
//         replacements: { orgId: orgId },
//         type: models.sequelize.QueryTypes.SELECT,
//       }
//     );

//     // Handle the different return formats of raw queries to ensure we have an array
//     const queryResults =
//       Array.isArray(rawQueryResult) && Array.isArray(rawQueryResult[0])
//         ? rawQueryResult[0]
//         : rawQueryResult;

//     if (!Array.isArray(queryResults)) {
//       console.error("Raw SQL query did not return a map-able array.");
//       return [];
//     }

//     organizationAssessmentsIds = queryResults.map((r) => r.assessment_id);

//     if (organizationAssessmentsIds.length === 0) {
//       console.log(`No latest assessments found for organization ID: ${orgId}`);
//       return [];
//     }

//     where.assessmentId = { [Op.in]: organizationAssessmentsIds };
//   }

//   // --- 2. Fetch all required nested data based on the IDs ---
//   const assessmentProcesses = await models.AssessmentProcess.findAll({
//     where,
//     attributes: {
//       include: [
//         ["id", "orgProcessId"], // alias id → processId
//       ],
//     },
//     include: [
//       {
//         model: models.Assessment,
//         as: "assessment",
//         attributes: [
//           "assessmentName",
//           "assessmentId",
//           "orgId",
//           "orgName",
//           "businessUnitId",
//           "businessUnitName",
//         ],
//         required: true,
//       },
//       {
//         model: models.AssessmentProcessAsset,
//         as: "assets",
//         attributes: [
//           "id",
//           "applicationName",
//           "assetCategory",
//           "assessmentProcessAssetId",
//           "modified_date",
//         ],
//         where: { isDeleted: false },
//         required: false,
//         include: [
//           {
//             model: models.AssessmentQuestionaire,
//             as: "questionnaire",
//             include: [
//               {
//                 model: models.LibraryQuestionnaire,
//                 as: "questionaire",
//                 attributes: ["mitreControlId", "question"],
//               },
//             ],
//             attributes: ["questionnaireId", "responseValue"],
//             where: { isDeleted: false },
//             required: false,
//           },
//         ],
//       },
//       {
//         model: models.AssessmentProcessRiskScenario,
//         as: "riskScenarios",
//         attributes: [
//           "id",
//           "riskScenario",
//           "riskDescription",
//           "assessmentProcessRiskId",
//           "created_date",
//           "modified_date",
//         ],
//         where: { isDeleted: false },
//         required: false,
//         include: [
//           {
//             model: models.OrganizationRiskScenario,
//             as: "orgRiskScenario",
//             attributes: ["ciaMapping"],
//             where: { isDeleted: false },
//             required: false,
//           },
//           {
//             model: models.AssessmentRiskTaxonomy,
//             as: "taxonomy",
//             attributes: [
//               "taxonomyName",
//               "taxonomyId",
//               "severityName",
//               "severityId",
//               "severityMinRange",
//               "severityMaxRange",
//               "weightage",
//               "created_date",
//               "modified_date",
//             ],
//             where: { isDeleted: false },
//             required: false,
//           },
//           // {
//           //   model: models.AssessmentRiskScenarioBusinessImpact,
//           //   as: "riskScenarioBusinessImpacts",      COMMENTING THIS BECAUSE THIS IS NOT BEING USED
//           //   attributes: ["riskThreshold", "riskThresholdValue"],
//           //   where: { isDeleted: false },
//           //   required: false,
//           // },
//         ],
//       },
//     ],
//   });

//   return assessmentProcesses;
// }

// async function insertBusinessAssetRisks(
//   dataArray,
//   dbModel = models.ReportsMaster,
//   clearOldRecords = false
// ) {
//   if (!Array.isArray(dataArray)) {
//     throw new Error("Input must be an array of JSON objects");
//   }

//   const t = await models.sequelize.transaction();

//   try {
//     // 1. Optional: Clear all old data
//     if (clearOldRecords === true) {
//       await dbModel.destroy({
//         where: {},
//         truncate: true,
//         cascade: true,
//         transaction: t,
//       });
//     }

//     // 2. Format each row for insertion to match ReportsMaster fields
//     const formatted = dataArray.map((item) => ({
//       assessmentId: item.assessmentId,
//       assessmentName: item.assessmentName,
//       orgId: item.orgId,
//       orgName: item.orgName,

//       businessUnitId: item.businessUnitId,
//       businessUnit: item.businessUnit,

//       businessProcessId: item.businessProcessId,
//       businessProcess: item.businessProcess,

//       assetId: item.assetId,
//       asset: item.asset,
//       assetCategory: item.assetCategory,

//       riskScenarioId: item.riskScenarioId,
//       riskScenario: item.riskScenario,
//       riskScenarioCIAMapping: item.riskScenarioCIAMapping,

//       // --- FINANCIAL ---
//       financial: item.financial,
//       financialMinRange: item.financialMinRange,
//       financialMaxRange: item.financialMaxRange,

//       // --- REGULATORY ---
//       regulatory: item.regulatory,
//       regulatoryMinRange: item.regulatoryMinRange,
//       regulatoryMaxRange: item.regulatoryMaxRange,

//       // --- REPUTATIONAL ---
//       reputational: item.reputational,
//       reputationalMinRange: item.reputationalMinRange,
//       reputationalMaxRange: item.reputationalMaxRange,

//       // --- OPERATIONAL ---
//       operational: item.operational,
//       operationalMinRange: item.operationalMinRange,
//       operationalMaxRange: item.operationalMaxRange,

//       // MITRE CONTROLS
//       mitreControlsAndScores: item.mitreControlsAndScores,

//       // timestamps
//       assessmentCreatedTimestamp: item.assessmentCreatedDate,
//       assessmentUpdatedTimestamp: item.assessmentModifiedDate,
//     }));

//     // 3. Insert new data
//     await dbModel.bulkCreate(formatted, {
//       returning: true,
//       transaction: t,
//     });

//     // 4. Commit
//     await t.commit();
//     return { status: "success", inserted: formatted.length };
//   } catch (err) {
//     // Rollback on error
//     await t.rollback();
//     throw err;
//   }
// }
// function mergeAndAddControlStrength(assessmentsArray, scoresArray) {
//   // Convert scoresArray into a lookup table by assetId
//   const scoreMap = new Map();
//   for (const s of scoresArray) {
//     scoreMap.set(s.assetId, s);
//   }

//   // 1. Merge scores into assessments
//   const merged = assessmentsArray.map((a) => {
//     const score = scoreMap.get(a.assetId) || {};
//     return {
//       ...a,
//       assetCScore: score.C ?? null,
//       assetIScore: score.I ?? null,
//       assetAScore: score.A ?? null,
//       assetCIAOverallScore: score.OVERALL ?? null,
//       controlStrengthProcessToAsset: score.OVERALL ?? 0,
//     };
//   });

//   // 2. Group by businessUnit + businessProcess
//   const groupMap = new Map();

//   for (const row of merged) {
//     const key = `${row.businessUnit}___${row.businessProcess}`;

//     if (!groupMap.has(key)) {
//       groupMap.set(key, []);
//     }

//     groupMap.get(key).push(row.controlStrengthProcessToAsset);
//   }

//   // 3. Calculate average per group
//   const avgMap = new Map();

//   for (const [key, overalls] of groupMap.entries()) {
//     const valid = overalls.filter((v) => typeof v === "number");
//     const avg =
//       valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;

//     avgMap.set(key, Number(avg.toFixed(2)));
//   }

//   // 4. Add controlStrength to each final row
//   return merged.map((row) => {
//     const key = `${row.businessUnit}___${row.businessProcess}`;
//     return {
//       ...row,
//       controlStrengthRisksToImpacts: avgMap.get(key),
//     };
//   });
// }

// function risksToImpactCalculations(assessmentRecordsArray) {
//   const updated = assessmentRecordsArray.map((item) => {
//     let financialMinRange = Number(item.financialMinRange);
//     let financialMaxRange = Number(item.financialMaxRange);
//     let finacialImpactValueInDollar = convertValueToMillion(
//       (financialMinRange + financialMaxRange) / 2
//     );

//     let regulatoryMinRange = Number(item.regulatoryMinRange);
//     let regulatoryMaxRange = Number(item.regulatoryMaxRange);
//     let regulatoryImpactValueInDollar = convertValueToMillion(
//       (regulatoryMinRange + regulatoryMaxRange) / 2
//     );

//     let reputationalMinRange = Number(item.reputationalMinRange);
//     let reputationalMaxRange = Number(item.reputationalMaxRange);
//     let reputationalImpactValueInDollar = convertValueToMillion(
//       (reputationalMinRange + reputationalMaxRange) / 2
//     );

//     let operationalMinRange = Number(item.operationalMinRange);
//     let operationalMaxRange = Number(item.operationalMaxRange);
//     let operationalImpactValueInDollar = convertValueToMillion(
//       (operationalMinRange + operationalMaxRange) / 2
//     );

//     const financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel =
//       finacialImpactValueInDollar;
//     let rawInherentFinancialExposure =
//       finacialImpactValueInDollar +
//       (item.regulatoryWeightage * regulatoryImpactValueInDollar +
//         item.reputationalWeightage * reputationalImpactValueInDollar +
//         item.operationalWeightage * operationalImpactValueInDollar) /
//         (item.regulatoryWeightage +
//           +item.reputationalWeightage +
//           item.operationalWeightage);
//     let inherentFinancialExposureInMillionDollar = roundToOneDecimal(
//       rawInherentFinancialExposure
//     );
//     let overallImpactScore =
//       (item.regulatoryWeightage *
//         impactLevelToNumMap[item.regulatory?.toLowerCase()] +
//         item.reputationalWeightage *
//           impactLevelToNumMap[item.reputational?.toLowerCase()] +
//         item.financialWeightage *
//           impactLevelToNumMap[item.financial?.toLowerCase()] +
//         item.operationalWeightage *
//           impactLevelToNumMap[item.operational?.toLowerCase()]) /
//       (item.regulatoryWeightage +
//         item.reputationalWeightage +
//         item.financialWeightage +
//         item.operationalWeightage);

//     return {
//       ...item,
//       financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel:
//         financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModel,
//       finacialImpactValueInMillionDollar: finacialImpactValueInDollar,
//       regulatoryImpactValueInMillionDollar: regulatoryImpactValueInDollar,
//       reputationalImpactValueInMillionDollar: reputationalImpactValueInDollar,
//       operationalImpactValueInMillionDollar: operationalImpactValueInDollar,
//       inherentFinancialExposure: inherentFinancialExposureInMillionDollar,
//       overallImpactScore,
//     };
//   });
//   return updated;
// }

// function riskDashboardERMTab(
//   assessmentRecordsArray,
//   assetControlScores,
//   riskAppetite
// ) {
//   const residualRiskThreshold = {
//     critical: 4,
//     high: 3,
//     moderate: 2,
//     low: 1,
//     "very low": 0,
//   };
//   function getRiskLevel(value) {
//     // Sort the keys by threshold in descending order
//     const levels = Object.entries(residualRiskThreshold).sort(
//       (a, b) => b[1] - a[1]
//     );

//     for (const [level, threshold] of levels) {
//       if (value >= threshold) {
//         return level;
//       }
//     }

//     return "very low";
//   }

//   function getControlStrengthRiskDashboardERMTabForAsset(ciaMapping, assetId) {
//     for (const asset of assetControlScores) {
//       if (asset.assetId === assetId) {
//         return asset[ciaMapping];
//       }
//     }
//     return null;
//   }

//   const updated = assessmentRecordsArray.map((item) => {
//     let inherentRiskScoreRiskDashboardERMTab = item.overallImpactScore;
//     let inherentRiskLevelRiskDashboardERMTab = getRiskLevel(
//       inherentRiskScoreRiskDashboardERMTab
//     );
//     let controlStrengthRiskDashboardERMTab = null;
//     let residualRiskScoreRiskDashboardERMTab = null;
//     let residualRiskLevelRiskDashboardERMTab = null;
//     let inherentImpactInMillionDollarsRiskDashboardERMTab =
//       roundToOneDecimal(item.inherentFinancialExposure) ?? null;
//     let residualImpactInMillionDollarsRiskDashboardERMTab = null;
//     let targetImpactInMillionDollarsRiskDashboardERMTab = null;

//     if (item.riskScenarioCIAMapping?.length > 0 && item.assetId != null) {
//       controlStrengthRiskDashboardERMTab =
//         getControlStrengthRiskDashboardERMTabForAsset(
//           item.riskScenarioCIAMapping[0],
//           item.assetId
//         );
//       if (typeof controlStrengthRiskDashboardERMTab === "number") {
//         let rawResidualRiskScoreRiskDashboardERMTab =
//           (inherentRiskScoreRiskDashboardERMTab *
//             (5.25 - controlStrengthRiskDashboardERMTab)) /
//           5;
//         residualRiskScoreRiskDashboardERMTab = roundToOneDecimal(
//           rawResidualRiskScoreRiskDashboardERMTab
//         );
//         residualRiskLevelRiskDashboardERMTab = getRiskLevel(
//           residualRiskScoreRiskDashboardERMTab
//         );

//         let rawResidualImpactInMillionDollarsRiskDashboardERMTab =
//           (inherentImpactInMillionDollarsRiskDashboardERMTab *
//             (5.25 - controlStrengthRiskDashboardERMTab)) /
//           5;
//         residualImpactInMillionDollarsRiskDashboardERMTab = roundToOneDecimal(
//           rawResidualImpactInMillionDollarsRiskDashboardERMTab
//         );

//         targetImpactInMillionDollarsRiskDashboardERMTab =
//           residualImpactInMillionDollarsRiskDashboardERMTab < riskAppetite
//             ? residualImpactInMillionDollarsRiskDashboardERMTab
//             : riskAppetite;
//       }
//     }

//     return {
//       ...item,
//       organizationRiskAppetiteInMillionDollar: riskAppetite,
//       inherentRiskScoreRiskDashboardERMTab:
//         inherentRiskScoreRiskDashboardERMTab,
//       inherentRiskLevelRiskDashboardERMTab:
//         inherentRiskLevelRiskDashboardERMTab,
//       controlStrengthRiskDashboardERMTab: controlStrengthRiskDashboardERMTab,
//       residualRiskScoreRiskDashboardERMTab:
//         residualRiskScoreRiskDashboardERMTab,
//       residualRiskLevelRiskDashboardERMTab:
//         residualRiskLevelRiskDashboardERMTab,
//       inherentImpactInMillionDollarsRiskDashboardERMTab:
//         inherentImpactInMillionDollarsRiskDashboardERMTab,
//       residualImpactInMillionDollarsRiskDashboardERMTab:
//         residualImpactInMillionDollarsRiskDashboardERMTab,
//       targetImpactInMillionDollarsRiskDashboardERMTab:
//         targetImpactInMillionDollarsRiskDashboardERMTab,
//     };
//   });
//   return updated;
// }

// function riskDashboardBusinessTab(dataArray, riskAppetite) {
//   const groupMap = new Map();

//   const residualRiskThreshold = {
//     critical: 4,
//     high: 3,
//     moderate: 2,
//     low: 1,
//     "very low": 0,
//   };
//   function getRiskLevel(value) {
//     // Sort the keys by threshold in descending order
//     const levels = Object.entries(residualRiskThreshold).sort(
//       (a, b) => b[1] - a[1]
//     );

//     for (const [level, threshold] of levels) {
//       if (value >= threshold) {
//         return level;
//       }
//     }

//     return "very low";
//   }
//   // 1. Build map with running max only
//   for (const item of dataArray) {
//     const key = `${item.businessUnitId}___${item.businessProcessId}`;

//     if (!groupMap.has(key)) {
//       groupMap.set(key, {
//         maxOverallImpactScore:
//           typeof item.overallImpactScore === "number"
//             ? item.overallImpactScore
//             : null,
//         maxInherentFinancialExposure:
//           typeof item.overallImpactScore === "number"
//             ? item.inherentFinancialExposure
//             : null,
//         totalControlStrength:
//           typeof item.controlStrengthProcessToAsset === "number"
//             ? item.controlStrengthProcessToAsset
//             : 0,
//         count: typeof item.controlStrengthProcessToAsset === "number" ? 1 : 0,
//       });
//     } else {
//       const stats = groupMap.get(key);

//       // Update max
//       if (typeof item.overallImpactScore === "number") {
//         if (
//           stats.maxOverallImpactScore === null ||
//           item.overallImpactScore > stats.maxOverallImpactScore
//         ) {
//           stats.maxOverallImpactScore = item.overallImpactScore;
//         }
//       }

//       // Update average components
//       if (typeof item.controlStrengthProcessToAsset === "number") {
//         stats.totalControlStrength += item.controlStrengthProcessToAsset;
//         stats.count += 1;
//       }
//       if (typeof item.inherentFinancialExposure === "number") {
//         if (
//           stats.inherentFinancialExposure === null ||
//           item.inherentFinancialExposure > stats.maxInherentFinancialExposure
//         ) {
//           stats.maxInherentFinancialExposure = item.inherentFinancialExposure;
//         }
//       }
//     }
//   }

//   // 2. Add max value back to each record
//   return dataArray.map((item) => {
//     const key = `${item.businessUnitId}___${item.businessProcessId}`;
//     const stats = groupMap.get(key);
//     const inherentRiskScoreRiskDashboardBusinessTab =
//       stats?.maxOverallImpactScore ?? null;
//     const inherentRiskLevelRiskDashboardBusinessTab = getRiskLevel(
//       inherentRiskScoreRiskDashboardBusinessTab
//     );
//     const controlStrengthRiskDashboardBusinessTab =
//       stats?.totalControlStrength / stats?.count ?? null;
//     const rawResidualRiskScoreRiskDashboardBusinessTab =
//       (inherentRiskScoreRiskDashboardBusinessTab *
//         (5.25 - controlStrengthRiskDashboardBusinessTab)) /
//       5;
//     const residualRiskScoreRiskDashboardBusinessTab = roundToOneDecimal(
//       rawResidualRiskScoreRiskDashboardBusinessTab
//     );
//     const residualRiskLevelRiskDashboardBusinessTab = getRiskLevel(
//       residualRiskScoreRiskDashboardBusinessTab
//     );
//     const rawInherentImpactInMillionDollarsRiskDashboardBusinessTab =
//       stats.maxInherentFinancialExposure ?? null;
//     const inherentImpactInMillionDollarsRiskDashboardBusinessTab =
//       roundToOneDecimal(
//         rawInherentImpactInMillionDollarsRiskDashboardBusinessTab
//       ) ?? null;

//     const rawResidualImpactInMillionDollarsRiskDashboardBusinessTab =
//       (inherentImpactInMillionDollarsRiskDashboardBusinessTab *
//         (5.25 - controlStrengthRiskDashboardBusinessTab)) /
//       5;
//     const residualImpactInMillionDollarsRiskDashboardBusinessTab =
//       roundToOneDecimal(
//         rawResidualImpactInMillionDollarsRiskDashboardBusinessTab
//       );

//     const targetImpactRiskDashboardBusinessTab =
//       residualImpactInMillionDollarsRiskDashboardBusinessTab < riskAppetite
//         ? residualImpactInMillionDollarsRiskDashboardBusinessTab
//         : riskAppetite;
//     const rawtargetStrengthRiskDashboardBusinessTab =
//       5 -
//       (targetImpactRiskDashboardBusinessTab * 5) /
//         inherentImpactInMillionDollarsRiskDashboardBusinessTab;
//     const targetStrengthRiskDashboardBusinessTab = roundToOneDecimal(
//       rawtargetStrengthRiskDashboardBusinessTab
//     );
//     const rawTargetResidualRiskRiskDashboardBusinessTab =
//       (inherentRiskScoreRiskDashboardBusinessTab *
//         (5.25 - targetStrengthRiskDashboardBusinessTab)) /
//       5;
//     const targetResidualRiskRiskDashboardBusinessTab = roundToOneDecimal(
//       rawTargetResidualRiskRiskDashboardBusinessTab
//     );
//     const targetResidualRiskLevelRiskDashboardBusinessTab = getRiskLevel(
//       targetResidualRiskRiskDashboardBusinessTab
//     );
//     return {
//       ...item,
//       inherentRiskScoreRiskDashboardBusinessTab:
//         inherentRiskScoreRiskDashboardBusinessTab,
//       inherentRiskLevelRiskDashboardBusinessTab:
//         inherentRiskLevelRiskDashboardBusinessTab,
//       controlStrengthRiskDashboardBusinessTab:
//         controlStrengthRiskDashboardBusinessTab,
//       residualRiskScoreRiskDashboardBusinessTab:
//         residualRiskScoreRiskDashboardBusinessTab,
//       residualRiskLevelRiskDashboardBusinessTab:
//         residualRiskLevelRiskDashboardBusinessTab,
//       inherentImpactInMillionDollarsRiskDashboardBusinessTab:
//         inherentImpactInMillionDollarsRiskDashboardBusinessTab,
//       residualImpactInMillionDollarsRiskDashboardBusinessTab:
//         residualImpactInMillionDollarsRiskDashboardBusinessTab,
//       targetImpactRiskDashboardBusinessTab:
//         targetImpactRiskDashboardBusinessTab,
//       targetStrengthRiskDashboardBusinessTab:
//         targetStrengthRiskDashboardBusinessTab,
//       targetResidualRiskRiskDashboardBusinessTab:
//         targetResidualRiskRiskDashboardBusinessTab,
//       targetResidualRiskLevelRiskDashboardBusinessTab:
//         targetResidualRiskLevelRiskDashboardBusinessTab,
//     };
//   });
// }

// function processToAssetBusinesssProcessLevelCalculations(dataArray) {
//   return dataArray.map((item) => {
//     const businessProcessInherentRiskProcessToAsset =
//       item.inherentRiskScoreRiskDashboardBusinessTab;
//     const businessProcessinherentImpactInMillionDollarsProcessToAsset =
//       item.inherentImpactInMillionDollarsRiskDashboardBusinessTab;
//     return {
//       ...item,
//       businessProcessInherentRiskProcessToAsset:
//         businessProcessInherentRiskProcessToAsset,
//       businessProcessinherentImpactInMillionDollarsProcessToAsset:
//         businessProcessinherentImpactInMillionDollarsProcessToAsset,
//     };
//   });
// }
// function riskDashboardCIOTab(dataArray, assetControlScores, riskAppetite) {
//   const groupMap = new Map();

//   const residualRiskThreshold = {
//     critical: 4,
//     high: 3,
//     moderate: 2,
//     low: 1,
//     "very low": 0,
//   };
//   function getRiskLevel(value) {
//     // Sort the keys by threshold in descending order
//     const levels = Object.entries(residualRiskThreshold).sort(
//       (a, b) => b[1] - a[1]
//     );

//     for (const [level, threshold] of levels) {
//       if (value >= threshold) {
//         return level;
//       }
//     }

//     return "very low";
//   }
//   function getControlStrengthForAsset(ciaMapping = "OVERALL", assetId) {
//     for (const asset of assetControlScores) {
//       if (asset.assetId === assetId) {
//         return asset[ciaMapping];
//       }
//     }
//     return null;
//   }
//   // 1. Build map with running max only
//   for (const item of dataArray) {
//     const key = `${item.assetId}`;

//     if (!groupMap.has(key)) {
//       groupMap.set(key, {
//         maxBusinessProcessInherentImpact:
//           typeof item.businessProcessinherentImpactInMillionDollarsProcessToAsset ===
//           "number"
//             ? item.businessProcessinherentImpactInMillionDollarsProcessToAsset
//             : 0,
//         totalBusinessProcessInherentRisk:
//           typeof item.businessProcessInherentRiskProcessToAsset === "number"
//             ? item.businessProcessInherentRiskProcessToAsset
//             : 0,
//         countBusinessProcessInherentRisk:
//           typeof item.businessProcessInherentRiskProcessToAsset === "number"
//             ? 1
//             : 0,
//       });
//     } else {
//       const stats = groupMap.get(key);
//       // Update max component
//       if (
//         typeof item.businessProcessinherentImpactInMillionDollarsProcessToAsset ===
//           "number" &&
//         item.businessProcessinherentImpactInMillionDollarsProcessToAsset >
//           stats.maxBusinessProcessInherentImpact
//       ) {
//         stats.maxBusinessProcessInherentImpact =
//           item.businessProcessinherentImpactInMillionDollarsProcessToAsset;
//       }
//       // Update average components
//       if (typeof item.controlStrengthProcessToAsset === "number") {
//         stats.totalBusinessProcessInherentRisk +=
//           item.businessProcessInherentRiskProcessToAsset;
//         stats.countBusinessProcessInherentRisk += 1;
//       }
//     }
//   }

//   return dataArray.map((item) => {
//     const key = `${item.assetId}`;
//     const stats = groupMap.get(key);
//     const rawInherentRiskScoreRiskDashboardCIOTab =
//       stats.countBusinessProcessInherentRisk > 0
//         ? stats?.totalBusinessProcessInherentRisk ??
//           0 / stats.countBusinessProcessInherentRisk
//         : 0;
//     const inherentRiskScoreRiskDashboardCIOTab = roundToOneDecimal(
//       rawInherentRiskScoreRiskDashboardCIOTab
//     );
//     const inherentRiskLevelRiskDashboardCIOTab = getRiskLevel(
//       inherentRiskScoreRiskDashboardCIOTab
//     );
//     const controlStrengthRiskDashboardCIOTab = getControlStrengthForAsset(
//       "OVERALL",
//       item.assetId
//     );
//     const rawResidualRiskScoreRiskDashboardCIOTab =
//       (inherentRiskScoreRiskDashboardCIOTab *
//         (5.25 - controlStrengthRiskDashboardCIOTab)) /
//       5;
//     const residualRiskScoreRiskDashboardCIOTab = roundToOneDecimal(
//       rawResidualRiskScoreRiskDashboardCIOTab
//     );
//     const residualRiskLevelRiskDashboardCIOTab = getRiskLevel(
//       residualRiskScoreRiskDashboardCIOTab
//     );
//     const inherentImpactInMillionDollarsDRiskDashboardCIOTab =
//       stats.maxBusinessProcessInherentImpact ?? 0;
//     const rawResidualImpactRiskDashboardCIOTab =
//       (inherentImpactInMillionDollarsDRiskDashboardCIOTab *
//         (5.25 - controlStrengthRiskDashboardCIOTab)) /
//       5;
//     const residualImpactInMillionDollarsRiskDashboardCIOTab = roundToOneDecimal(
//       rawResidualImpactRiskDashboardCIOTab
//     );
//     const targetImpactRiskDashboardCIOTab =
//       residualImpactInMillionDollarsRiskDashboardCIOTab < riskAppetite
//         ? residualImpactInMillionDollarsRiskDashboardCIOTab
//         : riskAppetite;
//     const rawTargetStrengthRiskDashboardCIOTab =
//       5 -
//       (targetImpactRiskDashboardCIOTab * 5) /
//         inherentImpactInMillionDollarsDRiskDashboardCIOTab;
//     const targetStrengthRiskDashboardCIOTab = roundToOneDecimal(
//       rawTargetStrengthRiskDashboardCIOTab
//     );
//     const rawTargetResidualRiskScoreRiskDashboardCIOTab =
//       (inherentRiskScoreRiskDashboardCIOTab *
//         (5.25 - targetStrengthRiskDashboardCIOTab)) /
//       5;
//     const targetResidualRiskScoreRiskDashboardCIOTab = roundToOneDecimal(
//       rawTargetResidualRiskScoreRiskDashboardCIOTab
//     );
//     const targetResidualRiskLevelRiskDashboardCIOTab = getRiskLevel(
//       targetResidualRiskScoreRiskDashboardCIOTab
//     );

//     return {
//       ...item,
//       inherentRiskScoreRiskDashboardCIOTab:
//         inherentRiskScoreRiskDashboardCIOTab,
//       inherentRiskLevelRiskDashboardCIOTab:
//         inherentRiskLevelRiskDashboardCIOTab,
//       controlStrengthRiskDashboardCIOTab: controlStrengthRiskDashboardCIOTab,
//       residualRiskScoreRiskDashboardCIOTab:
//         residualRiskScoreRiskDashboardCIOTab,
//       residualRiskLevelRiskDashboardCIOTab:
//         residualRiskLevelRiskDashboardCIOTab,
//       inherentImpactInMillionDollarsDRiskDashboardCIOTab:
//         inherentImpactInMillionDollarsDRiskDashboardCIOTab,
//       residualImpactInMillionDollarsRiskDashboardCIOTab:
//         residualImpactInMillionDollarsRiskDashboardCIOTab,
//       targetImpactRiskDashboardCIOTab: targetImpactRiskDashboardCIOTab,
//       targetStrengthRiskDashboardCIOTab: targetStrengthRiskDashboardCIOTab,
//       targetResidualRiskScoreRiskDashboardCIOTab:
//         targetResidualRiskScoreRiskDashboardCIOTab,
//       targetResidualRiskLevelRiskDashboardCIOTab:
//         targetResidualRiskLevelRiskDashboardCIOTab,
//     };
//   });
// }

// async function generateFlatAssessmentMatrix(orgId, active = true) {
//   const org = await models.Organization.findOne({
//     where: { organizationId: orgId },
//     attributes: ["riskAppetite"], // only fetch riskAppetite
//   });
//   if (!org) {
//     throw new Error("Invalid Org ID ");
//   }
//   const rawRiskAppetite = org ? org.riskAppetite : null;
//   const riskAppetite = convertValueToMillion(rawRiskAppetite);
//   const assessmentProcesses = await fetchDataFromAssessment(orgId, [], true);
//   const d = createFlatAssessmentMatrixFromProcesses(assessmentProcesses);
//   const b = aggregateMitreControlsByAsset(assessmentProcesses);
//   const c = await enrichMitreControlsByMitreThreatRecords(b);
//   const assetControlScores = calculateAssetScoresForAll(c);
//   const finalArray = mergeAndAddControlStrength(d, assetControlScores);
//   const riskToImpact = risksToImpactCalculations(finalArray);
//   const ermTab = riskDashboardERMTab(
//     riskToImpact,
//     assetControlScores,
//     riskAppetite
//   );
//   const businessTab = riskDashboardBusinessTab(ermTab, riskAppetite);
//   const processToAssetBPLevelValues =
//     processToAssetBusinesssProcessLevelCalculations(businessTab);
//   const cioTab = riskDashboardCIOTab(
//     processToAssetBPLevelValues,
//     assetControlScores,
//     riskAppetite
//   );
//   insertReportsMaster(cioTab);
//   return cioTab;
// }

// module.exports = {
//   generateFlatAssessmentMatrix,
//   fetchDataFromAssessment,
//   createFlatAssessmentMatrixFromProcesses,
//   enrichMitreControlsByMitreThreatRecords,
//   calculateAssetScoresForAll,
//   insertBusinessAssetRisks,
//   generateCSV,
// };
