const { Op } = require("sequelize");
const {
    Process,
    sequelize,
    ProcessRelationship,
    MetaData,
    ProcessAttribute,
    RiskScenario,
} = require("../models");

const {GENERAL, PROCESS } = require("../constants/library");

const CustomError = require("../utils/CustomError");
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
// const { search } = require("../routes/process");



class ProcessService {
    static async createProcess(data) {
        return await sequelize.transaction(async (t) => {
            this.validateProcessData(data);

            const processData = this.handleProcessDataColumnMapping(data);
            console.log("Creating process with data:", processData);

            const newProcess = await Process.create(processData, { transaction: t });

            if (Array.isArray(data.process_dependency) && data.process_dependency.length > 0) {
                await this.handleProcessDependencies(newProcess.id, data.process_dependency, t);
            }

            if (Array.isArray(data.attributes) && data.attributes.length > 0) {
                await this.handleProcessAttributes(newProcess.id, data.attributes, t);
            }

            return newProcess;
        });
    }

    static async getAllProcesses(page = 0, limit = 6, searchPattern = null, sortBy = 'created_at', sortOrder = 'ASC') {
        console.log("Fetching all processes");
        
        const offset = page * limit;
        let whereClause = {};

        if (!PROCESS.PROCESS_ALLOWED_SORT_FIELDS.includes(sortBy)) {
            sortBy = 'created_at';
        }

        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = 'ASC';
        }

        const includeRelations = [
            {
                model: ProcessAttribute,
                as: "attributes",
                include: [{ model: MetaData, as: "metaData" }],
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
      ];

      if (searchPattern) {
        whereClause = {
          [Op.or]: [
            { process_name: { [Op.iLike]: `%${searchPattern}%` } },
            { process_description: { [Op.iLike]: `%${searchPattern}%` } },
          ],
        };
      }
        const total = await Process.count({
            where: whereClause
        });

        const data = await Process.findAll({
          ...(limit > 0 ? { limit, offset } : {}),
          where: whereClause,
          order: [[sortBy, sortOrder]],
          include: includeRelations,
        });

        let processes = data.map((s) => s.toJSON());

        for (let i = 0; i < processes.length; i++) {
            const p = processes[i];

            p.industry = p.attributes?.filter((val) => val.metaData?.name?.toLowerCase() === "industry")
                ?.flatMap((val) => val.values);
            p.domain = p.attributes?.filter((val) => val.metaData?.name?.toLowerCase() === "domain")
                ?.flatMap((val) => val.values);

            p.attributes = p.attributes.map((val) => ({
                meta_data_key_id: val.meta_data_key_id,
                values: val.values,
            }));

            p.process_dependency = [];

            if (p?.sourceRelationships?.length > 0) {
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
                        source_process_id: val.target_process_id,
                        target_process_id: val.source_process_id,
                        relationship_type: val.relationship_type === "follows" ? "precedes" : "follows",
                    }))
                );
            }

            delete p.sourceRelationships;
            delete p.targetRelationships;
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
            console.log("Process not found:", id);
            throw new CustomError(Messages.PROCESS.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return process;
    }

    static async updateProcess(id, data) {
        return await sequelize.transaction(async (t) => {
            const process = await Process.findByPk(id, { transaction: t });

            if (!process) {
                console.log("No process found:", id);
                throw new CustomError(Messages.PROCESS.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            this.validateProcessData(data);

            const processData = this.handleProcessDataColumnMapping(data);
            await process.update(processData, { transaction: t });

            await ProcessAttribute.destroy({ where: { process_id: id }, transaction: t });
            await ProcessRelationship.destroy({ where: { source_process_id: id }, transaction: t });

            if (Array.isArray(data.process_dependency) && data.process_dependency.length > 0) {
                await this.handleProcessDependencies(id, data.process_dependency, t);
            }

            if (Array.isArray(data.attributes) && data.attributes.length > 0) {
                await this.handleProcessAttributes(id, data.attributes, t);
            }

            console.log("Process updated successfully:", id);
        });
    }

    static async updateProcessStatus(id, status) {
        if (!GENERAL.STATUS_SUPPORTED_VALUES.includes(status)) {
            console.log("[updateProcessStatus] Invalid status:", status);
            throw new CustomError(Messages.PROCESS.INVALID_STATUS, HttpStatus.BAD_REQUEST);
        }

        const [updatedRowsCount] = await Process.update({ status }, { where: { id } });

        if (updatedRowsCount === 0) {
            console.log("[updateProcessStatus] No process found:", id);
            throw new CustomError(Messages.PROCESS.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        console.log("[updateProcessStatus] Status updated successfully:", id);
        return { message: Messages.PROCESS.STATUS_UPDATED };
    }

    static async deleteProcess(id) {
        const process = await Process.findByPk(id);

        if (!process) {
            console.log("Delete failed - process not found:", id);
            throw new CustomError(Messages.PROCESS.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        await process.destroy();
        console.log("Process deleted successfully:", id);
        return { message: Messages.PROCESS.DELETED };
    }

    static validateProcessData = (data) => {
    const { process_name, status } = data;

    if (!process_name) {
        throw new CustomError(Messages.PROCESS.PROCESS_NAME_REQUIRED, HttpStatus.BAD_REQUEST);
    }

    if (status && !GENERAL.STATUS_SUPPORTED_VALUES.includes(status)) {
        throw new CustomError(Messages.PROCESS.INVALID_VALUE, HttpStatus.BAD_REQUEST);
    }
    };

    static handleProcessDataColumnMapping(data) {
        const fields = [
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

        return Object.fromEntries(fields.map((key) => [key, data[key]]));
    }

    static async handleProcessDependencies(sourceProcessId, dependencies, transaction) {
        for (const dependency of dependencies) {
            if (
                !dependency.relationship_type ||
                !PROCESS.PROCESS_RELATIONSHIP_TYPES.includes(dependency.relationship_type)
            ) {
                console.log("Invalid relationship type in dependency:", dependency);
                throw new CustomError(Messages.PROCESS.INVALID_RELATIONSHIP_TYPE, HttpStatus.BAD_REQUEST);
            }

            if (
                !dependency.target_process_id ||
                typeof dependency.target_process_id !== "number"
            ) {
                console.log("Invalid or missing target_process_id:", dependency);
                throw new CustomError(Messages.PROCESS.MISSING_TARGET_ID, HttpStatus.BAD_REQUEST);
            }

            const targetProcess = await Process.findByPk(dependency.target_process_id);
            if (!targetProcess) {
                console.log("Target process not found:", dependency.target_process_id);
                throw new CustomError(Messages.PROCESS.TARGET_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            await ProcessRelationship.create(
                {
                    source_process_id: sourceProcessId,
                    target_process_id: dependency.target_process_id,
                    relationship_type: dependency.relationship_type,
                },
                { transaction }
            );
        }
    }

    static async handleProcessAttributes(processId, attributes, transaction) {
        for (const attr of attributes) {
            if (!attr.meta_data_key_id || !attr.values) {
                console.log("Missing meta_data_key_id or values:", attr);
                throw new CustomError(Messages.PROCESS.MISSING_ATTRIBUTE_FIELD, HttpStatus.BAD_REQUEST);
            }

            const metaData = await MetaData.findByPk(attr.meta_data_key_id, { transaction });
            if (!metaData) {
                console.log("MetaData not found:", attr.meta_data_key_id);
                throw new CustomError(Messages.PROCESS.METADATA_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const supportedValues = metaData.supported_values;
            if (supportedValues?.length > 0 && !attr.values.every((v) => supportedValues.includes(v))) {
                console.log("Unsupported values in attribute:", attr);
                throw new CustomError(Messages.PROCESS.INVALID_ATTRIBUTE_VALUE, HttpStatus.BAD_REQUEST);
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
