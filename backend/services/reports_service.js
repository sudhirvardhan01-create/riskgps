const {
  Organization,
  OrganizationBusinessUnit,
  OrganizationProcess,
  OrganizationRiskScenario,
  OrganizationProcessRelationship,
  OrganizationAsset,
} = require("../models");
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
}

module.exports = ReportsService;
