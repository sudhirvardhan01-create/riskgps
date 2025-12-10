const {
  sequelize,
  Organization,
  OrganizationBusinessUnit,
  OrganizationProcess,
  OrganizationRiskScenario,
  OrganizationProcessRelationship,
  OrganizationAsset,
  ReportsMaster,
  OrganizationFrameworkControl,
  FrameWorkControl,
  ReportsAssetNistControlScore,
} = require("../models");
const { isDeleted } = require("../models/common_fields");

const severityMap = {
  critical: "Critical",
  high: "High",
  moderate: "Moderate",
  low: "Low",
  veryLow: "Very Low",
};

function convertMillionToValue(valueInMillions) {
  const num = Number(valueInMillions);

  if (isNaN(num)) return null; // or return 0 if you prefer
  return num * 1_000_000;
}

class ReportsService {
  static async getOrganizationalDependencyData(orgId = null) {
    console.log("Fetching all Organization Dependecy map details");

    if (!orgId) {
      throw new Error("Organization ID requried");
    }
    const data = await Organization.findByPk(orgId, {
      include: [
        {
          model: OrganizationBusinessUnit,
          as: "businessUnits",
          where: { isDeleted: false },
          required: false,
          attributes: [
            "orgBusinessUnitId",
            "name",
            "createdBy",
            "modifiedBy",
            "createdDate",
            "modifiedDate",
          ],
        },
      ],
    });
    if (!data) {
      throw new Error("No Organization Found");
    }

    const organization = data.toJSON();
    if (organization.businessUnits?.length) {
      await Promise.all(
        organization.businessUnits.map(async (bu) => {
          const buId = bu.orgBusinessUnitId;
          if (buId) {
            bu.processes = await this.getOrganizationalProcessDependencyData(
              orgId,
              buId
            );
          }
        })
      );
    }

    return organization;
  }

  static async getOrganizationalProcessDependencyData(
    orgId = null,
    buId = null
  ) {
    console.log("Fetching all processes");

    if (!orgId) {
      throw new Error("Organization ID requried");
    }

    const includeRelations = [
      {
        model: OrganizationRiskScenario,
        as: "riskScenarios",
        attributes: [
          "id",
          "riskCode",
          "riskScenario",
          "riskDescription",
          "ciaMapping",
          "status",
        ],
        include: [],
        through: { attributes: [] },
      },
      {
        model: OrganizationAsset,
        as: "assets",
        attributes: [
          "id",
          "assetCode",
          "applicationName",
          "hosting",
          "hostingFacility",
          "cloudServiceProvider",
          "geographicLocation",
        ],
        include: [],
        through: { attributes: [] },
      },
      {
        model: OrganizationProcessRelationship,
        as: "sourceRelationships",
      },
      {
        model: OrganizationProcessRelationship,
        as: "targetRelationships",
      },
    ];

    const whereClause = {
      organizationId: orgId,
      isDeleted: false,
    };

    if (buId) {
      whereClause.orgBusinessUnitId = buId;
    }

    const data = await OrganizationProcess.findAll({
      where: whereClause,
      include: includeRelations,
    });

    let processes = data.map((s) => s.toJSON());

    for (let i = 0; i < processes.length; i++) {
      const p = processes[i];

      p.processDependency = [];

      if (p?.sourceRelationships?.length > 0) {
        p.processDependency.push(
          ...p.sourceRelationships.map((val) => ({
            sourceProcessId: val.sourceProcessId,
            targetProcessId: val.targetProcessId,
            relationshipType: val.relationshipType,
          }))
        );
      }

      if (p?.targetRelationships?.length > 0) {
        p.processDependency.push(
          ...p.targetRelationships.map((val) => ({
            sourceProcessId: val.sourceProcessId,
            targetProcessId: val.targetProcessId,
            relationshipType: val.relationshipType,
          }))
        );
      }

      delete p.sourceRelationships;
      delete p.targetRelationships;
    }
    return processes;
  }

  static async getLatestTimeStampFromReportsTableForOrg(orgId) {
    if (!orgId) throw new Error("Org id required");
    const latest = await ReportsMaster.findOne({
      where: { orgId },
      order: [["updatedAt", "DESC"]],
      attributes: ["updatedAt"],
    });
    if (!latest) throw new Error("no data found for org");

    return latest.updatedAt;
  }

  static async getLatestTimeStampFromReportsAssetNistControlScoreTableForOrg(
    orgId
  ) {
    if (!orgId) throw new Error("Org id required");
    const latest = await ReportsAssetNistControlScore.findOne({
      where: { orgId },
      order: [["updatedAt", "DESC"]],
      attributes: ["updatedAt"],
    });
    if (!latest) throw new Error("no data found for org");

    return latest.updatedAt;
  }

  static buildHierarchy(data) {
    if (!data.length) return {};

    const orgId = data[0].orgId; // all rows belong to the same org

    const result = {
      orgId,
      buUnits: [],
    };

    const buMap = new Map();

    data.forEach((item) => {
      // --- Group by Business Unit ---
      if (!buMap.has(item.businessUnitId)) {
        buMap.set(item.businessUnitId, {
          organizationId: item.orgId,
          orgName: item.orgName,
          businessUnitId: item.businessUnitId,
          businessUnit: item.businessUnit,
          businessProcesses: [],
        });
      }

      const buEntry = buMap.get(item.businessUnitId);

      // --- Group by Business Process inside BU ---
      let bpEntry = buEntry.businessProcesses.find(
        (bp) => bp.businessProcessId === item.businessProcessId
      );

      if (!bpEntry) {
        bpEntry = {
          businessProcessId: item.businessProcessId,
          businessProcess: item.businessProcess,
          riskScenarios: [],
          assets: [],
        };
        buEntry.businessProcesses.push(bpEntry);
      }

      // --- Add risk scenarios ---
      bpEntry.riskScenarios.push({
        riskScenarioId: item.riskScenarioId,
        riskScenario: item.riskScenario,
        riskScenarioCIAMapping: item.riskScenarioCIAMapping,
        // add more fields if needed
      });

      // --- Add asset (ensure uniqueness per BP) ---
      if (!bpEntry.assets.some((a) => a.assetId === item.assetId)) {
        bpEntry.assets.push({
          assetId: item.assetId,
          asset: item.asset,
          assetCategory: item.assetCategory,
          // add more fields if needed
        });
      }
    });

    result.buUnits = Array.from(buMap.values());
    return result;
  }

  static getProcessesRiskExposureChartData(data) {
    const result = [];

    const map = new Map(); // key → buId|bpId

    data.forEach((item) => {
      const key = `${item.businessUnitId}|${item.businessProcessId}`;

      if (!map.has(key)) {
        map.set(key, {
          assessmentId: item.assessmentId,
          assessmentName: item.assessmentName,
          orgId: item.orgId,
          orgName: item.orgName,
          businessUnitId: item.businessUnitId,
          businessUnitName: item.businessUnit,
          businessProcessId: item.businessProcessId,
          processName: item.businessProcess,
          severity: item.aggBuBpResidualRiskLevelRiskDashboardBusinessTab,
          riskAppetite: convertMillionToValue(
            item.organizationRiskAppetiteInMillionDollar
          ),
          maxRiskExposure: 0,
          maxNetExposure: 0,
          risks: [],
          assets: [],
        });
      }

      const entry = map.get(key);

      // ---- Add Risk Scenario (no duplicates) ----
      if (
        !entry.risks.some((rs) => rs.riskScenarioId === item.riskScenarioId)
      ) {
        entry.risks.push({
          riskScenarioId: item.riskScenarioId,
          riskScenario: item.riskScenario,
          riskScenarioCIAMapping: item.riskScenarioCIAMapping[0] ?? null,
          riskExposure: convertMillionToValue(
            item.inherentImpactInMillionDollarsRiskDashboardERMTab
          ),
          riskExposureLevel: item.inherentRiskLevelRiskDashboardERMTab,
          netExposure: convertMillionToValue(
            item.residualImpactInMillionDollarsRiskDashboardERMTab
          ),
          netExposureLevel: item.residualRiskLevelRiskDashboardERMTab,
        });
        if (
          entry.maxRiskExposure <
          convertMillionToValue(
            item.aggBuBpInherentImpactInMillionDollarsRiskDashboardBusinessTab
          )
        ) {
          entry.maxRiskExposure = convertMillionToValue(
            item.aggBuBpInherentImpactInMillionDollarsRiskDashboardBusinessTab
          );
        }
        if (
          entry.maxNetExposure <
          convertMillionToValue(
            item.aggBuBpResidualImpactInMillionDollarsRiskDashboardBusinessTab
          )
        ) {
          entry.maxNetExposure = convertMillionToValue(
            item.aggBuBpResidualImpactInMillionDollarsRiskDashboardBusinessTab
          );
        }
      }

      // ---- Add Asset (no duplicates) ----
      if (!entry.assets.some((a) => a.assetId === item.assetId)) {
        entry.assets.push({
          assetId: item.assetId,
          applicationName: item.asset,
          controlStrength: item.aggAssetControlStrengthRiskDashboardCIOTab,
          targetStrength: item.aggAssetTargetImpactRiskDashboardCIOTab,
          riskExposure: convertMillionToValue(
            item.aggAssetInherentImpactInMillionDollarsRiskDashboardCIOTab
          ),
          riskExposureLevel: item.aggAssetInherentRiskLevelRiskDashboardCIOTab,
          netExposure: convertMillionToValue(
            item.aggAssetResidualImpactInMillionDollarsRiskDashboardCIOTab
          ),
          netExposureLevel: item.aggAssetResidualRiskLevelRiskDashboardCIOTab,
          // add more if needed
        });
      }
    });

    return Array.from(map.values());
  }

  static getBusinessUnitHeatmapChartData(data) {
    const map = new Map(); // key → buId|bpId

    data.forEach((item) => {
      const key = `${item.businessUnitId}`;

      if (!map.has(key)) {
        map.set(key, {
          businessUnitId: item.businessUnitId,
          businessUnitName: item.businessUnit,
          critical: 0,
          high: 0,
          moderate: 0,
          low: 0,
          veryLow: 0,
        });
      }

      const entry = map.get(key);
      const residualRiskLevelRiskDashboardBusinessTab =
        item.residualRiskLevelRiskDashboardERMTab;
      if (residualRiskLevelRiskDashboardBusinessTab == "critical") {
        entry.critical++;
      } else if (residualRiskLevelRiskDashboardBusinessTab == "high") {
        entry.high++;
      } else if (residualRiskLevelRiskDashboardBusinessTab == "moderate") {
        entry.moderate++;
      } else if (residualRiskLevelRiskDashboardBusinessTab == "low") {
        entry.low++;
      } else if (residualRiskLevelRiskDashboardBusinessTab == "very low") {
        entry.veryLow++;
      }
    });

    const convertedTogetBusinessUnitHeatmapChartFormat = Array.from(
      map.values()
    ).flatMap((item) =>
      Object.entries(severityMap).map(([key, label]) => ({
        businessUnitId: item.businessUnitId,
        x: label,
        y: item.businessUnitName,
        value: item[key] || 0,
      }))
    );
    return convertedTogetBusinessUnitHeatmapChartFormat;
  }

  static getBusinessUnitRadarChartData(data) {
    const map = new Map(); // key → buId|bpId

    data.forEach((item) => {
      const key = `${item.businessUnitId}`;

      if (!map.has(key)) {
        map.set(key, {
          businessUnitId: item.businessUnitId,
          businessUnitName: item.businessUnit,
          riskScenarioIds: [],
          totalRiskExposure: 0,
          totalNetExposure: 0,
          netExposureCount: 0,
          financialImpactSum: 0,
          operationalImpactSum: 0,
          regulatoryImpactSum: 0,
          reputationalImpactSum: 0,
        });
      }

      const entry = map.get(key);
      if (!entry.riskScenarioIds?.includes(item.riskScenarioId)) {
        entry.riskScenarioIds.push(item.riskScenarioId);
        entry.totalRiskExposure =
          entry.totalRiskExposure +
          convertMillionToValue(
            item.inherentImpactInMillionDollarsRiskDashboardERMTab
          );
        entry.financialImpactSum =
          entry.financialImpactSum +
          convertMillionToValue(item.financialImpactValueInMillionDollar);
        entry.operationalImpactSum =
          entry.operationalImpactSum +
          convertMillionToValue(item.operationalImpactValueInMillionDollar);
        entry.regulatoryImpactSum =
          entry.regulatoryImpactSum +
          convertMillionToValue(item.regulatoryImpactValueInMillionDollar);
        entry.reputationalImpactSum =
          entry.reputationalImpactSum +
          convertMillionToValue(item.reputationalImpactValueInMillionDollar);
      }
    });
    const resultArray = Array.from(map.values());
    const metrics = [
      {
        metric: "Total Risk Exposure",
        values: {},
      },
      {
        metric: "Financial Impact",
        values: {},
      },
      {
        metric: "Operational Impact",
        values: {},
      },
      {
        metric: "Regulatory Impact",
        values: {},
      },
      {
        metric: "Reputational Impact",
        values: {},
      },
    ];

    resultArray.forEach((item) => {
      const name = item.businessUnitName;

      metrics[0].values[name] = item.totalRiskExposure;
      metrics[1].values[name] = item.financialImpactSum;
      metrics[2].values[name] = item.operationalImpactSum;
      metrics[3].values[name] = item.regulatoryImpactSum;
      metrics[4].values[name] = item.reputationalImpactSum;
    });
    return metrics;
  }

  static async getRiskScenarioTableData(reportsData) {
    return reportsData.map((item, index) => {
      return {
        assessmentId: item.assessmentId,
        assessmentName: item.assessmentName,
        orgId: item.orgId,
        orgName: item.orgName,
        organizationRiskAppetite: convertMillionToValue(
          item.organizationRiskAppetiteInMillionDollar
        ),
        businessUnitId: item.businessUnitId,
        businessUnit: item.businessUnit,
        businessProcessId: item.businessProcessId,
        businessProcess: item.businessProcess,
        riskScenarioId: item.riskScenarioId,
        riskScenario: item.riskScenario,
        riskScenarioCIAMapping: item.riskScenarioCIAMapping[0],
        inherentRiskScore: item.inherentRiskScoreRiskDashboardERMTab,
        riskExposure: convertMillionToValue(
          item.inherentImpactInMillionDollarsRiskDashboardERMTab
        ),
        riskExposureLevel: item.inherentRiskLevelRiskDashboardERMTab,
        controlStrengthRisk: item.controlStrengthRiskDashboardERMTab,
        residualRiskScoreRisk: item.residualRiskScoreRiskDashboardERMTab,
        netExposure: convertMillionToValue(
          item.residualImpactInMillionDollarsRiskDashboardERMTab
        ),
        netExposureLevel: item.residualRiskLevelRiskDashboardERMTab,

        targetImpact: convertMillionToValue(
          item.targetImpactInMillionDollarsRiskDashboardERMTab
        ),
      };
    });
  }

  /**
   *
   * @param {*} orgId
   * @param {*} businessUnitId
   * @param {*} businessProcessId
   * @param {*} riskScenarioId
   * @param {*} assetId
   * @returns
   */
  static async processesRiskExposureChartData(
    orgId,
    businessUnitId = null,
    businessProcessId = null,
    riskScenarioId = null,
    assetId = null
  ) {
    const latestTimeStamp = await this.getLatestTimeStampFromReportsTableForOrg(
      orgId
    );
    const reportsData = await ReportsMaster.findAll({
      where: {
        orgId,
        updatedAt: latestTimeStamp,
      },
    });

    const processesRiskExposureChartData =
      this.getProcessesRiskExposureChartData(reportsData);

    return processesRiskExposureChartData;
  }

  /**
   *
   * @param {*} orgId
   * @param {*} businessUnitId
   * @param {*} businessProcessId
   * @param {*} riskScenarioId
   * @param {*} assetId
   * @returns
   */
  static async businessUnitHeatmapChart(
    orgId,
    businessUnitId = null,
    businessProcessId = null,
    riskScenarioId = null,
    assetId = null
  ) {
    const latestTimeStamp = await this.getLatestTimeStampFromReportsTableForOrg(
      orgId
    );
    const reportsData = await ReportsMaster.findAll({
      where: {
        orgId,
        updatedAt: latestTimeStamp,
      },
    });

    const businessUnitHeatmapChartData =
      this.getBusinessUnitHeatmapChartData(reportsData);

    return businessUnitHeatmapChartData;
  }

  static async riskScenarioTableData(orgId) {
    if (!orgId) {
      throw new Error("Org ID not found");
    }
    const latestTimeStamp = await this.getLatestTimeStampFromReportsTableForOrg(
      orgId
    );
    const reportsData = await ReportsMaster.findAll({
      where: {
        orgId,
        updatedAt: latestTimeStamp,
      },
    });

    const riskScenarioTableDataRes = this.getRiskScenarioTableData(reportsData);
    return riskScenarioTableDataRes;
  }

  static async reportsTableData(orgId) {
    if (!orgId) {
      throw new Error("Org ID not found");
    }
    const latestTimeStamp = await this.getLatestTimeStampFromReportsTableForOrg(
      orgId
    );
    const reportsData = await ReportsMaster.findAll({
      where: {
        orgId,
        updatedAt: latestTimeStamp,
      },
    });

    return reportsData;
  }

  static async businessUnitRadarChart(orgId, businessUnitId = null) {
    if (!orgId) {
      throw new Error("Org ID not found");
    }
    const latestTimeStamp = await this.getLatestTimeStampFromReportsTableForOrg(
      orgId
    );
    let whereClause = {
      orgId,
      updatedAt: latestTimeStamp,
    };

    if (businessUnitId) {
      whereClause.businessUnitId = businessUnitId;
    }
    const reportsData = await ReportsMaster.findAll({
      where: whereClause,
    });
    const businessUnitRadarChartRes =
      this.getBusinessUnitRadarChartData(reportsData);

    return businessUnitRadarChartRes;
  }

  static async fetchOrganizationNistControlScores(orgId) {
    return sequelize.transaction(async (t) => {
      let orgControls = await OrganizationFrameworkControl.findAll({
        where: {
          organizationId: orgId,
          frameWorkName: "NIST",
        },
        transaction: t,
      });

      const defaultControls = await FrameWorkControl.findAll({
        where: { frameWorkName: "NIST" },
        transaction: t,
      });

      const existingParentIds = new Set(
        orgControls.map((c) => c.parentObjectId)
      );

      const missingControls = defaultControls.filter(
        (dc) => !existingParentIds.has(dc.id)
      );

      if (missingControls.length > 0) {
        const toInsert = missingControls.map((dc) => ({
          organizationId: orgId,
          parentObjectId: dc.id,

          frameWorkName: dc.frameWorkName,
          frameWorkControlCategoryId: dc.frameWorkControlCategoryId,
          frameWorkControlCategory: dc.frameWorkControlCategory,
          frameWorkControlDescription: dc.frameWorkControlDescription,
          frameWorkControlSubCategoryId: dc.frameWorkControlSubCategoryId,
          frameWorkControlSubCategory: dc.frameWorkControlSubCategory,

          currentScore: null,
          targetScore: null,
        }));

        await OrganizationFrameworkControl.bulkCreate(toInsert, {
          transaction: t,
        });
      }

      const updatedOrgControls = await OrganizationFrameworkControl.findAll({
        where: {
          organizationId: orgId,
          frameWorkName: "NIST",
        },
        attributes: {
          exclude: ["modifiedBy"], // put your 2 column names here
        },
        transaction: t,
      });

      return updatedOrgControls;
    });
  }

  static async updateOrganizationNistControlScores(orgId, controls = []) {
    if (!orgId) {
      throw new Error("Organization id required");
    }
    if (!Array.isArray(controls) || controls.length === 0) {
      throw new Error("No controls provided for update");
    }

    await sequelize.transaction(async (t) => {
      for (const row of controls) {
        await OrganizationFrameworkControl.update(
          {
            currentScore: row.currentScore,
            targetScore: row.targetScore,
            modifiedDate: new Date(),
          },
          {
            where: { organizationId: orgId, orgControlId: row.orgControlId },
            transaction: t,
          }
        );
      }
    });
  }

  static async organizationMitreToNistScoreMapping(orgId) {
    if (!orgId) {
      throw new Error("Organization id required");
    }
    const latestTimeStampFromAssetNistControlScoreTable =
      await this.getLatestTimeStampFromReportsAssetNistControlScoreTableForOrg(
        orgId
      );
    const latestTimeStamp = await this.getLatestTimeStampFromReportsTableForOrg(
      orgId
    );

    const calculatedMitreToNistScores =
      await ReportsAssetNistControlScore.findAll({
        where: {
          orgId: orgId,
          updatedAt: latestTimeStampFromAssetNistControlScoreTable,
        },
      });
    const parentIds = calculatedMitreToNistScores.map(
      (item) => item.nistControlId
    );
    const organizationNistControlScores =
      await OrganizationFrameworkControl.findAll({
        where: {
          parentObjectId: parentIds,
          organizationId: orgId,
          frameWorkName: "NIST",
        },
      });
    const controlMap = new Map(
      organizationNistControlScores.map((c) => [
        c.parentObjectId,
        {
          currentScore: c.currentScore,
          targetScore: c.targetScore,
        },
      ])
    );

    let assetMitreToNistControlScore = [];
    for (const asset of calculatedMitreToNistScores) {
      const match = controlMap.get(asset.nistControlId);

      assetMitreToNistControlScore.push({
        assetId: asset.assetId,
        assetName: asset.assetName,
        assetCategory: asset.assetCategory,
        controlCategoryId: asset.controlCategoryId,
        controlCategory: asset.controlCategory,
        controlSubCategoryId: asset.controlSubCategoryId,
        controlSubCategory: asset.controlSubCategory,

        calcultatedControlScore: asset.calcultatedControlScore,
        currentScore: match ? match.currentScore : null,
        targetScore: match ? match.targetScore : null,
      });
    }
    let assetLevelReportsData = Object.values(
      assetMitreToNistControlScore.reduce((acc, item) => {
        if (!acc[item.assetId]) {
          acc[item.assetId] = {
            assetId: item.assetId,
            assetName: item.assetName,
            assetCategory: item.assetCategory,
            controls: [],
          };
        }

        acc[item.assetId].controls.push({
          controlCategoryId: item.controlCategoryId,
          controlCategory: item.controlCategory,
          controlSubCategoryId: item.controlSubCategoryId,
          controlSubCategory: item.controlSubCategory,
          calcultatedControlScore: item.calcultatedControlScore,
          currentScore: item.currentScore,
          targetScore: item.targetScore,
        });

        return acc;
      }, {})
    );

    let whereClause = {
      orgId,
      updatedAt: latestTimeStamp,
    };

    const reportsMasterData = await ReportsMaster.findAll({
      where: whereClause,
    });
    const assetDataLookUp = assetLevelReportsData.reduce((acc, item) => {
      acc[item.assetId] = item;
      return acc;
    }, {});

    const reportsMasterDataGrouped = [];
    const seen = new Set();

    reportsMasterData.forEach((item) => {
      const key = `${item.businessUnitId}_${item.businessProcessId}_${item.assetId}`;

      if (!seen.has(key)) {
        seen.add(key);
        reportsMasterDataGrouped.push(item);
      }
    });
    assetLevelReportsData = reportsMasterDataGrouped.map((data) => {
      const mitreNistControlData =
        assetDataLookUp[data.assetId]?.controls ?? null;
      return {
        orgId: data.orgId,
        orgName: data.orgName,
        organizationRiskAppetiteInMillionDollar:
          data.organizationRiskAppetiteInMillionDollar,
        businessUnitId: data.businessUnitId,
        businessUnit: data.businessUnit,
        businessProcessId: data.businessProcessId,
        businessProcess: data.businessProcess,
        assetId: data.assetId,
        asset: data.asset,
        assetCategory: data.assetCategory,
        controlStrength: data.aggAssetControlStrengthRiskDashboardCIOTab,
        inherentRiskScore: data.aggAssetInherentRiskScoreRiskDashboardCIOTab,
        inherentRiskLevel: data.aggAssetInherentRiskLevelRiskDashboardCIOTab,
        residualRiskScore: data.aggAssetResidualRiskScoreRiskDashboardCIOTab,
        residualRiskLevel: data.aggAssetResidualRiskLevelRiskDashboardCIOTab,
        inherentImpactInDollar: convertMillionToValue(
          data.aggAssetInherentImpactInMillionDollarsRiskDashboardCIOTab
        ),
        residualImpactInDollar: convertMillionToValue(
          data.aggAssetResidualImpactInMillionDollarsRiskDashboardCIOTab
        ),
        targetImpactInDollar: convertMillionToValue(
          data.aggAssetTargetImpactRiskDashboardCIOTab
        ),
        targetStrength: data.aggAssetTargetStrengthRiskDashboardCIOTab,
        targetResidualRiskScore:
          data.aggAssetTargetResidualRiskScoreRiskDashboardCIOTab,
        targetResidualRiskLevel:
          data.aggAssetTargetResidualRiskLevelRiskDashboardCIOTab,
        controls: mitreNistControlData,
      };
    });
    return assetLevelReportsData;
  }
}

module.exports = ReportsService;
