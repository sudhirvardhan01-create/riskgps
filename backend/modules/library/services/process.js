const { STATUS_SUPPORTED_VALUES } = require("../../../constants/library");
const { PROCESS_RELATIONSHIP_TYPES } = require("../../../constants/process");
const {
  Process,
  sequelize,
  ProcessRelationship,
  MetaData,
  ProcessAttribute,
  RiskScenario,
} = require("../../../models");
const { validateProcessData } = require("../utils/process");

class ProcessService {
  
  static async createProcess(data) {
    return await sequelize.transaction(async (t) => {
      validateProcessData(data);

      const processData = this.handleProcessDataColumnMapping(data);
      console.log(processData);
      const newProcess = await Process.create(processData, { transaction: t });

      if (
        Array.isArray(data.process_dependency) &&
        data.process_dependency.length > 0
      ) {
        await this.handleProcessDependencies(
          newProcess.id,
          data.process_dependency,
          t
        );
      }

      if (Array.isArray(data.attributes) && data.attributes.length > 0) {
        await this.handleProcessAttributes(newProcess.id, data.attributes, t);
      }

      return newProcess;
    });
  }

  static async getAllProcesses(page = 0, limit = 6, filters = {}) {
    const offset = page * limit;
    const total = await Process.count();

    const whereClause = {};

    // Optional filter by name
    if (filters.name) {
      whereClause.process_name = {
        [Op.iLike]: `%${filters.name}%`,
      };
    }
    let data;
    if (limit == 0) {
      data = await Process.findAll({
        order: [["created_at", "DESC"]], // sort by created date
        include: [
          {
            model: ProcessAttribute,
            as: "attributes",
            include: [
              {
                model: MetaData,
                as: "metaData",
              },
            ],
          },
          {
            model: RiskScenario,
            as: "riskScenarios",
          },
          { 
            model: ProcessRelationship, 
            as: "sourceRelationships" 
          },
          { 
            model: ProcessRelationship, 
            as: "targetRelationships" 
          },
        ],
      });
    } else {
      data = await Process.findAll({
      limit,
      offset,
      order: [["created_at", "DESC"]], // sort by created date
      include: [
        {
          model: ProcessAttribute,
          as: "attributes",
          include: [
            {
              model: MetaData,
              as: "metaData",
            },
          ],
        },
        {
          model: RiskScenario,
          as: "riskScenarios",
        },
        { 
          model: ProcessRelationship, 
          as: "sourceRelationships" 
        },
        { 
          model: ProcessRelationship, 
          as: "targetRelationships" 
        },
      ],
    });
    }
    let processes = data.map(s => s.toJSON())
    for (let i = 0; i  < processes.length; i++) {
      processes[i].industry = processes[i].attributes?.filter((val) => val.metaData?.name?.toLowerCase() == "industry")?.flatMap(val => val.values);
      processes[i].domain = processes[i].attributes?.filter((val) => val.metaData?.name?.toLowerCase() == "domain")?.flatMap(val => val.values);
      processes[i].attributes = processes[i].attributes.map((val) => { return {meta_data_key_id: val.meta_data_key_id, values: val.values} })
      processes[i].process_dependency = [];
      if (processes[i]?.sourceRelationships?.length > 0) {
          processes[i].process_dependency.push(...processes[i]?.sourceRelationships.map((val)=> {
            return {
              source_process_id: val.source_process_id,
              target_process_id: val.target_process_id,
              relationship_type: val.relationship_type
            }
          }))
      }
      if ( processes[i]?.targetRelationships?.length > 0 ) {
          processes[i].process_dependency.push(...processes[i]?.targetRelationships.map((val)=> {
            return {
              source_process_id: val.target_process_id,
              target_process_id: val.source_process_id, 
              relationship_type: val.relationship_type === "follows" ? "precedes" : "follows"
            }
          }))
      }
      delete processes[i].sourceRelationships;
      delete processes[i].targetRelationships;
    }
    return {
      data: processes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getProcessById(id) {
    const process = await Process.findByPk(id);

    if (!process) {
      throw new Error("Process not found.");
    }

    return process;
  }

  static async updateProcess(id, data) {
    return await sequelize.transaction(async (t) => {
        const process = await Process.findByPk(id, { transaction: t });
        
        if (!process) {
          console.log("No process found", id , data);
          throw new Error("No Process found.")
        }
        validateProcessData(data);

        const processData = this.handleProcessDataColumnMapping(data);
        await process.update(processData, { transaction: t });
        
        await ProcessAttribute.destroy({
          where: {
            process_id: id
          }, 
          transaction: t
        });

        await ProcessRelationship.destroy({
          where: {
            source_process_id: id
          },
          transaction: t
        });

        if (
          Array.isArray(data.process_dependency) &&
          data.process_dependency.length > 0
        ) {
          await this.handleProcessDependencies(
            id,
            data.process_dependency,
            t
          );
        }

        if (Array.isArray(data.attributes) && data.attributes.length > 0) {
          await this.handleProcessAttributes(id, data.attributes, t);
        }
        

    })
  }

    /**
   * 
   * @param {number} id 
   * @param {string} status 
   * @returns 
   */
  static async updateProcessStatus(id, status) {

    if (!STATUS_SUPPORTED_VALUES.includes(status)) {
      console.log("[updateProcessStatus] invalid operation", id, status);
      throw new Error(`Failed to update process status failed`);
    }

    const [updatedRowsCount] = await Process.update(
      { status },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      console.log("[updateProcessStatus] no process Found by Id ", id);
      throw new Error(`Invalid process ID ${id}`);
    }
    console.log("[updateProcessStatus] status updated successfully", id, status);
    return {message: "process status updated succesfully"};

  }

  static async deleteProcess(id) {
    const process = await Process.findByPk(id);

    if (!process) {
      throw new Error("Process not found.");
    }

    await process.destroy();
    return { message: "Process deleted successfully." };
  }

  static handleProcessDataColumnMapping(data) {
    const processFields = [
      "process_name",
      "process_description",
      "senior_executive__owner_name",
      "senior_executive__owner_email",
      "operations__owner_name",
      "operations__owner_email",
      "technology_owner_name",
      "technology_owner_email",
      "organizational_revenue_impact_percentage",
      "financial_materiality",
      "third_party_involvement",
      "users_customers",
      "regulatory_and_compliance",
      "criticality_of_data_processed",
      "data_processed",
      "status",
    ];

    const processData = Object.fromEntries(
      processFields.map((key) => [key, data[key]])
    );

    return processData
  }

  static async handleProcessDependencies(
    sourceProcessId,
    dependencies,
    transaction
  ) {
    for (const dependency of dependencies) {
      if (
        !dependency.relationship_type ||
        !PROCESS_RELATIONSHIP_TYPES.includes(dependency.relationship_type)
      ) {
        throw new Error(
          "Invalid Process dependency Mapping: invalid relationship type"
        );
      }

      if (
        !dependency.target_process_id ||
        typeof dependency.target_process_id !== "number"
      ) {
        throw new Error(
          "Invalid Process dependency Mapping: missing or invalid target_process_id"
        );
      }

      const targetProcess = await Process.findByPk(
        dependency.target_process_id
      );
      if (!targetProcess) {
        throw new Error(
          "Invalid Process Dependency Mapping: target process not found"
        );
      }

      await ProcessRelationship.create(
        {
          source_process_id: sourceProcessId,
          target_process_id: dependency.target_process_id,
          relation: dependency.relationship_type,
        },
        { transaction }
      );
    }
  }

  static async handleProcessAttributes(processId, attributes, transaction) {
    for (const attr of attributes) {
      if (!attr.meta_data_key_id || !attr.values) {
        throw new Error(
          "Each attribute must have meta_data_key_id and values."
        );
      }

      const metaData = await MetaData.findByPk(attr.meta_data_key_id, {
        transaction,
      });
      if (!metaData) {
        throw new Error(`MetaData not found for ID: ${attr.meta_data_key_id}`);
      }

      const supportedValues = metaData.supported_values;
      if (
        supportedValues?.length > 0 &&
        !attr.values.every((v) => supportedValues.includes(v))
      ) {
        throw new Error(
          `Invalid Value For Meta Data: ${attr.meta_data_key_id}`
        );
      }

      await ProcessAttribute.create(
        {
          process_id: processId,
          meta_data_key_id: attr.meta_data_key_id,
          values: attr.values,
        },
        { transaction }
      );
    }
  }
}

module.exports = ProcessService;
