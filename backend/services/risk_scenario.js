const {
    RiskScenario,
    RiskScenarioAttribute,
    MetaData,
    sequelize,
    Process,
    ProcessRiskScenarioMappings,
} = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { ALLOWED_SORT_ORDER, RISK_SCENARIO, GENERAL } = require("../constants/library");



class RiskScenarioService {
    static async createRiskScenario(data) {
        const {
            risk_scenario,
            risk_description,
            risk_statement,
            status,
            risk_field_1,
            risk_field_2,
            attributes,
            related_processes,
        } = data;

        return await sequelize.transaction(async (t) => {
            if (!risk_scenario) {
                console.log("[createRiskScenario] Missing risk_scenario");
                throw new CustomError(Messages.RISK_SCENARIO.REQUIRED, HttpStatus.BAD_REQUEST);
            }

            console.log("[createRiskScenario] Creating risk scenario", data);

            const statusSupportedValues = ["draft", "published", "not_published"];
            if (status && !statusSupportedValues.includes(status)) {
                console.log("[createRiskScenario] Invalid status:", status);
                throw new CustomError(Messages.RISK_SCENARIO.INVALID_STATUS, HttpStatus.BAD_REQUEST);
            }

            const scenario = await RiskScenario.create(
                {
                    risk_scenario,
                    risk_description,
                    risk_statement,
                    status,
                    risk_field_1,
                    risk_field_2,
                },
                { transaction: t }
            );

            if (Array.isArray(related_processes)) {
                for (const process of related_processes) {
                    if (typeof process !== "number" || process < 0) {
                        console.log("[createRiskScenario] Invalid related process:", process);
                        throw new CustomError(Messages.RISK_SCENARIO.INVALID_PROCESS_MAPPING, HttpStatus.BAD_REQUEST);
                    }

                    const processData = await Process.findByPk(process);
                    if (!processData) {
                        console.log("[createRiskScenario] Related process not found:", process);
                        throw new CustomError(Messages.RISK_SCENARIO.INVALID_PROCESS_MAPPING, HttpStatus.NOT_FOUND);
                    }

                    await ProcessRiskScenarioMappings.create(
                        {
                            risk_scenario_id: scenario.id,
                            process_id: process,
                        },
                        { transaction: t }
                    );
                }
            }

            if (Array.isArray(attributes)) {
                for (const attr of attributes) {
                    if (!attr.meta_data_key_id || !attr.values) {
                        console.log("[createRiskScenario] Invalid attribute:", attr);
                        throw new CustomError(Messages.RISK_SCENARIO.MISSING_ATTRIBUTE_FIELD, HttpStatus.BAD_REQUEST);
                    }

                    const metaData = await MetaData.findByPk(attr.meta_data_key_id, { transaction: t });
                    if (!metaData) {
                        throw new CustomError(Messages.RISK_SCENARIO.METADATA_NOT_FOUND(attr.meta_data_key_id), HttpStatus.NOT_FOUND);
                    }

                    const supportedValues = metaData.supported_values;
                    if (
                        supportedValues?.length > 0 &&
                        !attr.values.every((value) => supportedValues.includes(value))
                    ) {
                        throw new CustomError(Messages.RISK_SCENARIO.INVALID_ATTRIBUTE_VALUE(attr.meta_data_key_id), HttpStatus.BAD_REQUEST);
                    }

                    await RiskScenarioAttribute.create(
                        {
                            risk_scenario_id: scenario.id,
                            meta_data_key_id: attr.meta_data_key_id,
                            values: attr.values,
                        },
                        { transaction: t }
                    );
                }
            }

            return scenario;
        });
    }

    static async getAllRiskScenarios(page = 0, limit = 6,  searchPattern = null, sortBy = 'created_at', sortOrder = 'ASC') {
        const offset = page * limit;
        let whereClause = {};
        console.log(sortOrder)

        if (!RISK_SCENARIO.RISK_SCENARIO_SORT_FIELDS.includes(sortBy)) {
            sortBy = "created_at";
        }

        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = 'ASC';
        }

        if (searchPattern) {
          whereClause = {
            [Op.or]: [
              { risk_scenario: { [Op.iLike]: `%${searchPattern}%` } },
              { risk_description: { [Op.iLike]: `%${searchPattern}%` } },
              { risk_statement: { [Op.iLike]: `%${searchPattern}%` } },
            ],
          };
        }

        const total = await RiskScenario.count({
            where: whereClause
        });
        const data = await RiskScenario.findAll({
            limit,
            offset,
            order: [[sortBy, sortOrder]],
            where: whereClause,
            include: [
                {
                    model: RiskScenarioAttribute,
                    as: "attributes",
                    include: [{ model: MetaData, as: "metaData" }],
                },
                { model: Process, as: "processes" },
            ],
        });

        const scenarios = data.map((s) => {
            const scenario = s.toJSON();
            scenario.industry = scenario.attributes?.filter((a) => a.metaData?.name?.toLowerCase() === "industry")?.flatMap((a) => a.values);
            scenario.domain = scenario.attributes?.filter((a) => a.metaData?.name?.toLowerCase() === "domain")?.flatMap((a) => a.values);
            scenario.attributes = scenario.attributes.map((a) => ({ meta_data_key_id: a.meta_data_key_id, values: a.values }));
            scenario.related_processes = scenario.processes.map((p) => p.id);
            delete scenario.processes;
            return scenario;
        });

        return {
            data: scenarios,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    static async getRiskScenarioById(id) {
        const scenario = await RiskScenario.findByPk(id, {
            include: [
                {
                    model: RiskScenarioAttribute,
                    as: "attributes",
                    include: [{ model: MetaData, as: "metaData" }],
                },
            ],
        });

        if (!scenario) {
            throw new CustomError(Messages.RISK_SCENARIO.NOT_FOUND(id), HttpStatus.NOT_FOUND);
        }

        return scenario;
    }

    static async updateRiskScenario(id, data) {
        const {
            risk_scenario,
            risk_description,
            risk_statement,
            status,
            risk_field_1,
            risk_field_2,
            related_processes,
            attributes,
        } = data;

        return await sequelize.transaction(async (t) => {
            const scenario = await RiskScenario.findByPk(id, { transaction: t });

            if (!scenario) {
                throw new CustomError(Messages.RISK_SCENARIO.NOT_FOUND(id), HttpStatus.NOT_FOUND);
            }

            if (risk_scenario === undefined) {
                throw new CustomError(Messages.RISK_SCENARIO.REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const statusSupportedValues = ["draft", "published", "not_published"];
            if (status && !statusSupportedValues.includes(status)) {
                throw new CustomError(Messages.RISK_SCENARIO.INVALID_STATUS, HttpStatus.BAD_REQUEST);
            }

            await scenario.update(
                {
                    risk_scenario,
                    risk_description,
                    risk_statement,
                    status,
                    risk_field_1,
                    risk_field_2,
                },
                { transaction: t }
            );

            if (Array.isArray(related_processes)) {
                await ProcessRiskScenarioMappings.destroy({ where: { risk_scenario_id: id }, transaction: t });

                for (const process of related_processes) {
                    if (typeof process !== "number" || process < 0) {
                        throw new CustomError(Messages.RISK_SCENARIO.INVALID_PROCESS_MAPPING, HttpStatus.BAD_REQUEST);
                    }

                    const processData = await Process.findByPk(process);
                    if (!processData) {
                        throw new CustomError(Messages.RISK_SCENARIO.INVALID_PROCESS_MAPPING, HttpStatus.NOT_FOUND);
                    }

                    await ProcessRiskScenarioMappings.create(
                        {
                            risk_scenario_id: scenario.id,
                            process_id: process,
                        },
                        { transaction: t }
                    );
                }
            }

            if (Array.isArray(attributes)) {
                await RiskScenarioAttribute.destroy({ where: { risk_scenario_id: id }, transaction: t });

                for (const attr of attributes) {
                    if (!attr.meta_data_key_id || !attr.values) {
                        throw new CustomError(Messages.RISK_SCENARIO.MISSING_ATTRIBUTE_FIELD, HttpStatus.BAD_REQUEST);
                    }

                    const metaData = await MetaData.findByPk(attr.meta_data_key_id, { transaction: t });

                    if (!metaData) {
                        throw new CustomError(Messages.RISK_SCENARIO.METADATA_NOT_FOUND(attr.meta_data_key_id), HttpStatus.NOT_FOUND);
                    }

                    const supportedValues = metaData.supported_values;
                    if (supportedValues?.length > 0 && !attr.values.every((v) => supportedValues.includes(v))) {
                        throw new CustomError(Messages.RISK_SCENARIO.INVALID_ATTRIBUTE_VALUE(attr.meta_data_key_id), HttpStatus.BAD_REQUEST);
                    }

                    await RiskScenarioAttribute.create(
                        {
                            risk_scenario_id: id,
                            meta_data_key_id: attr.meta_data_key_id,
                            values: attr.values,
                        },
                        { transaction: t }
                    );
                }
            }

            return scenario;
        });
    }

    static async deleteRiskScenarioById(id) {
        const riskScenario = await RiskScenario.findByPk(id);

        if (!riskScenario) {
            console.log("[deleteRiskScenario] Not found:", id);
            throw new CustomError(Messages.RISK_SCENARIO.NOT_FOUND(id), HttpStatus.NOT_FOUND);
        }

        await riskScenario.destroy();
        return { message: Messages.RISK_SCENARIO.DELETED };
    }

    static async updateRiskScenarioStatus(id, status) {
        const allowed_status_values = ["published", "not_published", "draft"];

        if (!allowed_status_values.includes(status)) {
            console.log("[updateRiskScenarioStatus] Invalid status:", id, status);
            throw new CustomError(Messages.RISK_SCENARIO.INVALID_STATUS, HttpStatus.BAD_REQUEST);
        }

        const [updatedRowsCount] = await RiskScenario.update({ status }, { where: { id } });

        if (updatedRowsCount === 0) {
            console.log("[updateRiskScenarioStatus] Not found:", id);
            throw new CustomError(Messages.RISK_SCENARIO.NOT_FOUND(id), HttpStatus.NOT_FOUND);
        }

        console.log("[updateRiskScenarioStatus] Updated:", id, status);
        return { message: Messages.RISK_SCENARIO.STATUS_UPDATED };
    }
}

module.exports = RiskScenarioService;