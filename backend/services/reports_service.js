const {
  OrganizationProcess,
  OrganizationRiskScenario,
  OrganizationProcessRelationship,
  OrganizationAsset,
} = require("../models");
class ReportsService {
  static async getOrganizationalDependencyData(orgId = null, buId = null) {
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
      }

      if (buId) {
        whereClause.orgBusinessUnitId = buId;
      }

    const data = await OrganizationProcess.findAll({
      where: whereClause,
      // attributes: [
      //   "id",
      //   "processCode",
      //   "organizationId",
      //   "orgBusinessUnitId",
      //   "processName",
      // ],
      include: includeRelations,
    });

    let processes = data.map((s) => s.toJSON());

    for (let i = 0; i < processes.length; i++) {
      const p = processes[i];

      p.processDependency = [];

      if (p?.sourceRelationships?.length > 0) {
        p.processDependency.push(
          ...p.sourceRelationships.map((val) => ({
            sourceProcessId: val.source_process_id,
            targetProcessId: val.target_process_id,
            relationshipType: val.relationship_type,
          }))
        );
      }

      if (p?.targetRelationships?.length > 0) {
        p.processDependency.push(
          ...p.targetRelationships.map((val) => ({
            sourceProcessId: val.source_process_id,
            targetProcessId: val.target_process_id,
            relationshipType: val.relationship_type,
          }))
        );
      }

      delete p.sourceRelationships;
      delete p.targetRelationships;
    }
    return processes;
  }
}

module.exports = ReportsService;
