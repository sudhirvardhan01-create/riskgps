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
        attributes: ["id", "risk_code", "risk_scenario", "risk_description", "cia_mapping", "status"], 
        include: [], 
        through: { attributes: [] }

      },
      {
        model: Asset,
        as: "assets",
        attributes: ["id", "asset_code", "application_name", "hosting", "hosting_facility", "cloud_service_provider", "geographic_location"], 
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
      attributes: ["id", "process_code", "process_name"],
      include: includeRelations,
    });

    let processes = data.map((s) => s.toJSON());

    for (let i = 0; i < processes.length; i++) {
      const p = processes[i];

      p.process_dependency = [];

      if (p?.sourceRelationships?.length > 0) {
        console.log
        p.process_dependency.push(
          ...p.sourceRelationships.map((val) => ({
            source_process_id: val.source_process_id,
            target_process_id: val.target_process_id,
            relationship_type: val.relationship_type,
          }))
        );
      }

      if (p?.targetRelationships?.length > 0) {
        p.process_dependency.push(
          ...p.targetRelationships.map((val) => ({
            source_process_id: val.source_process_id,
            target_process_id: val.target_process_id,
            relationship_type: val.relationship_type,
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
