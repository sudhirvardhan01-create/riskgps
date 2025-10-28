const ProcessService = require("./process");
const { Process, RiskScenario, ProcessRelationship, Asset } = require("../models");
class DashboardService {
  static async getOrganizationalDependencyData(
    organizationName = null,
    businessUnit = null
  ) {
    const process = await ProcessService.getAllProcesses();
    console.log("Fetching all processes");

    const includeRelations = [
      {
        model: RiskScenario,
        as: "riskScenarios",
        attributes: ["id", "riskCode", "riskScenario", "riskDescription", "ciaMapping", "status"], 
        include: [], 
        through: { attributes: [] }

      },
      {
        model: Asset,
        as: "assets",
        attributes: ["id", "assetCode", "applicationName", "hosting", "hostingFacility", "cloudServiceProvider", "geographicLocation"], 
        include: [], 
        through: { attributes: [] }
      },
      {
        model: ProcessRelationship,
        as: "sourceRelationships",
      },
      {
        model: ProcessRelationship,
        as: "targetRelationships",
      },
    ];

    const data = await Process.findAll({
      attributes: ["id", "processCode", "processName"],
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

module.exports = DashboardService;
