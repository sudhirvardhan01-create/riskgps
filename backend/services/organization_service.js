const {
    Organization,
    OrganizationBusinessUnit,
    OrganizationProcess,
    OrganizationRiskScenario,
    Sequelize,
    Taxonomy,
    SeverityLevel,
    MetaData,
    OrganizationAsset,
    OrganizationAssetProcessMappings,
    OrganizationProcessRiskScenarioMappings,
    OrganizationRiskScenarioAttribute,
    OrganizationAssetAttribute,
    OrganizationProcessAttribute,
    OrganizationProcessRelationship,
    OrganizationThreat,
    MitreThreatControl,
    Process,
    Asset,
    RiskScenario,
    sequelize,
} = require("../models");
const { Op } = Sequelize;
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const OrganizationRiskScenarioService = require("./organization_risk_scenario_service");
const OrganizationProcessService = require("./organization_process_service");
const OrganizationAssetService = require("./organization_asset_service");

class OrganizationService {
    /**
     * Get all organizations with pagination, search & sorting, including business units
     */
    static async getAllOrganizations(
        page = 0,
        limit = 10,
        searchPattern = "",
        sortBy = "name",
        sortOrder = "ASC"
    ) {
        try {
            const offset = page * limit;

            const whereClause = {
                isDeleted: false,
            };

            if (searchPattern) {
                whereClause[Op.or] = [
                    { name: { [Op.iLike]: `%${searchPattern}%` } },
                    { orgCode: { [Op.iLike]: `%${searchPattern}%` } },
                ];
            }

            const { rows, count } = await Organization.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                order: [[sortBy, sortOrder]],
                include: [
                    {
                        model: OrganizationBusinessUnit,
                        as: "businessUnits",
                        where: { isDeleted: false },
                        required: false,
                        attributes: [
                            "orgBusinessUnitId",
                            "name",
                            "description",
                            "createdBy",
                            "modifiedBy",
                            "createdDate",
                            "modifiedDate",
                        ],
                    },
                ],
            });

            return {
                total: count,
                page,
                limit,
                organizations: rows,
            };
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organizations",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get organization by ID with business units
     */
    static async getOrganizationById(id) {
        try {
            const organization = await Organization.findByPk(id, {
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

            if (!organization) {
                throw new CustomError("Organization not found", HttpStatus.NOT_FOUND);
            }

            return organization;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get processes for an organization + business unit (both mandatory)
     */
    static async getOrganizationProcessesForListing(
        orgId,
        businessUnitId = null
    ) {
        try {
            if (!orgId) {
                throw new CustomError(
                    "Organization ID are required",
                    HttpStatus.BAD_REQUEST
                );
            }
            const whereClause = {
                organizationId: orgId,
                isDeleted: false,
            };
            if (businessUnitId) {
                whereClause.orgBusinessUnitId = businessUnitId;
            }

            const processes = await OrganizationProcess.findAll({
                where: whereClause,
                attributes: [
                    "id",
                    "parentObjectId",
                    "organizationId",
                    "orgBusinessUnitId",
                    "autoIncrementId",
                    "processCode",
                    "processName",
                    "processDescription",
                    "seniorExecutiveOwnerName",
                    "seniorExecutiveOwnerEmail",
                    "operationsOwnerName",
                    "operationsOwnerEmail",
                    "technologyOwnerName",
                    "technologyOwnerEmail",
                    "organizationalRevenueImpactPercentage",
                    "financialMateriality",
                    "thirdPartyInvolvement",
                    "usersCustomers",
                    "regulatoryAndCompliance",
                    "criticalityOfDataProcessed",
                    "dataProcessed",
                    "status",
                    "createdBy",
                    "modifiedBy",
                    "createdDate",
                    "modifiedDate",
                ],
                order: [["createdDate", "DESC"]],
            });

            if (!processes || processes.length === 0) {
                throw new CustomError(
                    "No processes found for given organization",
                    HttpStatus.NOT_FOUND
                );
            }

            return processes;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization processes for listing",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
 * Get processes for an organization.
 * Business unit is optional.
 */
    static async getOrganizationProcesses(orgId, businessUnitId) {
        try {
            if (!orgId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const whereCondition = {
                organizationId: orgId,
                isDeleted: false,
            };

            // Add business unit filter only if provided
            if (businessUnitId) {
                whereCondition.orgBusinessUnitId = businessUnitId;
            }

            const processes = await OrganizationProcess.findAll({
                where: whereCondition,
                attributes: [
                    "id",
                    "parentObjectId",
                    "organizationId",
                    "orgBusinessUnitId",
                    "autoIncrementId",
                    "processCode",
                    "processName",
                    "processDescription",
                    "seniorExecutiveOwnerName",
                    "seniorExecutiveOwnerEmail",
                    "operationsOwnerName",
                    "operationsOwnerEmail",
                    "technologyOwnerName",
                    "technologyOwnerEmail",
                    "organizationalRevenueImpactPercentage",
                    "financialMateriality",
                    "thirdPartyInvolvement",
                    "usersCustomers",
                    "regulatoryAndCompliance",
                    "criticalityOfDataProcessed",
                    "dataProcessed",
                    "status",
                    "createdBy",
                    "modifiedBy",
                    "createdDate",
                    "modifiedDate",
                ],
                order: [["createdDate", "DESC"]],
            });

            if (!processes || processes.length === 0) {
                throw new CustomError(
                    "No processes found for given criteria",
                    HttpStatus.NOT_FOUND
                );
            }

            return processes;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization processes",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    /**
     * Get processes for an organization.
     * Business unit is optional.
     */
    static async getOrganizationProcessesV2(orgId, businessUnitId) {
        try {
            if (!orgId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const processes =
                await OrganizationProcessService.fetchOrganizationProcess(
                    orgId,
                    businessUnitId || null
                );

            return processes;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization processes",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    static async addProcessByOrgIdAndBuId(orgId, buId, createBody) {
        if (!orgId) {
            throw new CustomError("Organization ID is required", HttpStatus.BAD_REQUEST);
        }

        if (!createBody) {
            throw new CustomError("Invalid request body", HttpStatus.BAD_REQUEST);
        }

        return await sequelize.transaction(async (t) => {
            const data = createBody;

            OrganizationProcessService.validateProcessData(data);

            const processData =
                OrganizationProcessService.handleProcessDataColumnMapping(data);

            processData.organizationId = orgId;
            processData.isDeleted = false;

            // Set business unit only if provided
            if (buId) {
                processData.orgBusinessUnitId = buId;
            }

            console.log("Creating process with data:", processData);

            const [process] = await OrganizationProcess.upsert(processData, {
                returning: true,
                transaction: t,
            });

            const paddedId = String(process.autoIncrementId).padStart(5, "0");
            const code = `BP${paddedId}`;
            await process.update({ processCode: code }, { transaction: t });

            // Cleanup old attributes & relationships
            await OrganizationProcessAttribute.destroy({
                where: { processId: process.id },
                transaction: t,
            });

            await OrganizationProcessRelationship.destroy({
                where: {
                    [Op.or]: [
                        { sourceProcessId: process.id },
                        { targetProcessId: process.id },
                    ],
                },
                transaction: t,
            });

            if (
                Array.isArray(data.processDependency) &&
                data.processDependency.length > 0
            ) {
                await OrganizationProcessService.handleProcessDependencies(
                    process.id,
                    data.processDependency,
                    t
                );
            }

            if (Array.isArray(data.attributes) && data.attributes.length > 0) {
                await OrganizationProcessService.handleProcessAttributes(
                    process.id,
                    data.attributes,
                    t
                );
            }

            return createBody;
        });
    }


    static async createProcessByOrgIdAndBuId(orgId, buId, createBody) {
        if (!orgId) {
            throw new CustomError("Organization ID is required", HttpStatus.BAD_REQUEST);
        }

        if (!createBody || !Array.isArray(createBody)) {
            throw new CustomError("Invalid body", HttpStatus.BAD_REQUEST);
        }

        return await sequelize.transaction(async (t) => {
            let insertedCount = 0;

            const idsToKeep = createBody
                .map((item) => item.id)
                .filter((id) => id !== undefined && id !== null);

            const deleteCondition = {
                organizationId: orgId,
            };

            // Apply BU filter only if provided
            if (buId) {
                deleteCondition.orgBusinessUnitId = buId;
            } else {
                deleteCondition.orgBusinessUnitId = null;
            }

            if (idsToKeep.length > 0) {
                deleteCondition.id = { [Op.notIn]: idsToKeep };
            }

            await OrganizationProcess.destroy({
                where: deleteCondition,
                transaction: t,
            });

            for (let i = 0; i < createBody.length; i++) {
                const data = createBody[i];

                OrganizationProcessService.validateProcessData(data);

                const processData =
                    OrganizationProcessService.handleProcessDataColumnMapping(data);

                processData.organizationId = orgId;
                processData.isDeleted = false;

                // Set BU only if provided
                if (buId) {
                    processData.orgBusinessUnitId = buId;
                } else {
                    processData.orgBusinessUnitId = null;
                }

                console.log("Creating process with data:", processData);

                const [process] = await OrganizationProcess.upsert(processData, {
                    returning: true,
                    transaction: t,
                });

                const paddedId = String(process.autoIncrementId).padStart(5, "0");
                const code = `BP${paddedId}`;
                await process.update({ processCode: code }, { transaction: t });

                insertedCount++;

                await OrganizationProcessAttribute.destroy({
                    where: { processId: process.id },
                    transaction: t,
                });

                await OrganizationProcessRelationship.destroy({
                    where: {
                        [Op.or]: [
                            { sourceProcessId: process.id },
                            { targetProcessId: process.id },
                        ],
                    },
                    transaction: t,
                });

                if (
                    Array.isArray(data.processDependency) &&
                    data.processDependency.length > 0
                ) {
                    await OrganizationProcessService.handleProcessDependencies(
                        process.id,
                        data.processDependency,
                        t
                    );
                }

                if (Array.isArray(data.attributes) && data.attributes.length > 0) {
                    await OrganizationProcessService.handleProcessAttributes(
                        process.id,
                        data.attributes,
                        t
                    );
                }
            }

            return insertedCount;
        });
    }


    static async updateProcess(id, orgId, buId, createBody) {
        if (!id || !orgId) {
            throw new CustomError(
                "Process ID and Organization ID are required",
                HttpStatus.BAD_REQUEST
            );
        }

        return await sequelize.transaction(async (t) => {
            const data = createBody;

            OrganizationProcessService.validateProcessData(data);

            const processData =
                OrganizationProcessService.handleProcessDataColumnMapping(data);

            // Set BU only if provided
            if (buId) {
                processData.orgBusinessUnitId = buId;
            } else {
                processData.orgBusinessUnitId = null;
            }

            const whereCondition = {
                id,
                organizationId: orgId,
            };

            // Apply BU filter only if provided
            if (buId) {
                whereCondition.orgBusinessUnitId = buId;
            } else {
                whereCondition.orgBusinessUnitId = null;
            }

            const [updatedCount, updatedRows] =
                await OrganizationProcess.update(processData, {
                    where: whereCondition,
                    returning: true,
                    transaction: t,
                });

            if (updatedCount < 1) {
                throw new CustomError("No process found.", HttpStatus.NOT_FOUND);
            }

            await OrganizationProcessAttribute.destroy({
                where: { processId: id },
                transaction: t,
            });

            await OrganizationProcessRelationship.destroy({
                where: {
                    [Op.or]: [{ sourceProcessId: id }, { targetProcessId: id }],
                },
                transaction: t,
            });

            if (
                Array.isArray(data.processDependency) &&
                data.processDependency.length > 0
            ) {
                await OrganizationProcessService.handleProcessDependencies(
                    id,
                    data.processDependency,
                    t
                );
            }

            if (Array.isArray(data.attributes) && data.attributes.length > 0) {
                await OrganizationProcessService.handleProcessAttributes(
                    id,
                    data.attributes,
                    t
                );
            }

            return updatedRows;
        });
    }

    static async updateProcessesForBusinessUnit(orgId, buId, processIds) {
        if (!orgId || !buId || !Array.isArray(processIds) || processIds.length === 0) {
            throw new CustomError(
                "Organization ID, Business Unit ID and processIds are required",
                HttpStatus.BAD_REQUEST
            );
        }

        const [updatedCount, updatedRows] =
            await OrganizationProcess.update(
                {
                    orgBusinessUnitId: buId,
                },
                {
                    where: {
                        organizationId: orgId,
                        id: {
                            [Op.in]: processIds,
                        },
                    },
                    returning: true,
                }
            );

        if (updatedCount < 1) {
            throw new CustomError(
                "No matching processes found to update",
                HttpStatus.NOT_FOUND
            );
        }

        return {
            updatedCount,
            processes: updatedRows,
        };
    }


    static async deleteProcess(ids, orgId, buId) {
        if (!ids || !Array.isArray(ids) || !orgId) {
            throw new CustomError(
                "Process ID array and Organization ID are required",
                HttpStatus.BAD_REQUEST
            );
        }

        let deletedCount = 0;

        return await sequelize.transaction(async (t) => {
            for (const id of ids) {
                const whereCondition = {
                    id,
                    organizationId: orgId,
                };

                // Apply BU filter only if provided
                if (buId) {
                    whereCondition.orgBusinessUnitId = buId;
                } else {
                    whereCondition.orgBusinessUnitId = null;
                }

                const [updatedCount] = await OrganizationProcess.update(
                    { isDeleted: true },
                    {
                        where: whereCondition,
                        returning: true,
                        transaction: t,
                    }
                );

                if (updatedCount > 0) {
                    deletedCount++;
                }

                await OrganizationProcessAttribute.destroy({
                    where: { processId: id },
                    transaction: t,
                });

                await OrganizationProcessRelationship.destroy({
                    where: {
                        [Op.or]: [
                            { sourceProcessId: id },
                            { targetProcessId: id },
                        ],
                    },
                    transaction: t,
                });

                await OrganizationAssetProcessMappings.destroy({
                    where: { processId: id },
                    transaction: t,
                });

                await OrganizationProcessRiskScenarioMappings.destroy({
                    where: { processId: id },
                    transaction: t,
                });
            }

            return deletedCount;
        });
    }

    /**
     * Get all risk scenarios by organizationId
     */
    static async getRiskScenariosByOrgId(organizationId) {
        try {
            if (!organizationId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const scenarios = await OrganizationRiskScenario.findAll({
                where: {
                    organizationId,
                    isDeleted: false,
                },
                attributes: [
                    "parentObjectId",
                    "id",
                    "organizationId",
                    "autoIncrementId",
                    "riskCode",
                    "riskScenario",
                    "riskDescription",
                    "riskStatement",
                    "ciaMapping",
                    "status",
                    "riskField1",
                    "riskField2",
                    "createdBy",
                    "modifiedBy",
                    "createdDate",
                    "modifiedDate",
                ],
                order: [["createdDate", "DESC"]],
            });

            return scenarios;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization risk scenarios",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    static async getRiskScenariosByOrgIdV2(organizationId) {
        try {
            if (!organizationId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const scenarios = await OrganizationRiskScenario.findAll({
                where: {
                    organizationId,
                    isDeleted: false,
                },
                include: [
                    {
                        model: OrganizationRiskScenarioAttribute,
                        as: "attributes",
                        include: [{ model: MetaData, as: "metaData" }],
                    },
                    { model: OrganizationProcess, as: "processes" },
                ],
                order: [["createdDate", "DESC"]],
            });

            return scenarios;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization risk scenarios",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async addRiskScenariosByOrgId(organizationId, createBody) {
        try {
            if (!organizationId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }
            if (!createBody) {
                throw new CustomError("invalid body", HttpStatus.BAD_REQUEST);
            }
            return await sequelize.transaction(async (t) => {
                let insertedCount = 0;
                const data = createBody;
                console.log("[createRiskScenariosByOrgId] request received", data);

                OrganizationRiskScenarioService.validateRiskScenarioData(data);

                const riskScenarioData =
                    OrganizationRiskScenarioService.handleRiskScenarioColumnMapping(data);
                riskScenarioData.organizationId = organizationId;
                riskScenarioData.isDeleted = false;
                console.log(
                    "[createRiskScenariosByOrgId], risk scenario mapped values",
                    riskScenarioData
                );

                const [scenario, created] = await OrganizationRiskScenario.upsert(
                    riskScenarioData,
                    {
                        returning: true,
                        transaction: t,
                    }
                );

                const paddedId = String(scenario.autoIncrementId).padStart(5, "0");
                const code = `RS${paddedId}`;
                await scenario.update({ riskCode: code }, { transaction: t });

                insertedCount++;

                await OrganizationRiskScenarioService.handleRiskScenarioProcessMapping(
                    scenario.id,
                    data.relatedProcesses ?? [],
                    t
                );

                await OrganizationRiskScenarioService.handleRiskScenarioAttributes(
                    scenario.id,
                    data.attributes ?? [],
                    t
                );
                return createBody;
            });
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create createRiskScenariosByOrgId",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async createRiskScenariosByOrgId(organizationId, createBody) {
        try {
            if (!organizationId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }
            if (!createBody || !Array.isArray(createBody)) {
                throw new CustomError("invalid body", HttpStatus.BAD_REQUEST);
            }
            return await sequelize.transaction(async (t) => {
                let insertedCount = 0;
                const idsToKeep = createBody
                    .map((item) => item.id)
                    .filter((id) => id !== undefined && id !== null);

                // Delete all OrganizationRiskScenario rows for this organizationId
                // that are NOT in the idsToKeep array
                await OrganizationRiskScenario.destroy({
                    where: {
                        organizationId: organizationId,
                        ...(idsToKeep.length > 0 ? { id: { [Op.notIn]: idsToKeep } } : {}),
                    },
                });
                for (let i = 0; i < createBody.length; i++) {
                    const data = createBody[i];
                    console.log("[createRiskScenariosByOrgId] request received", data);

                    OrganizationRiskScenarioService.validateRiskScenarioData(data);

                    const riskScenarioData =
                        OrganizationRiskScenarioService.handleRiskScenarioColumnMapping(
                            data
                        );
                    riskScenarioData.organizationId = organizationId;
                    riskScenarioData.isDeleted = false;
                    console.log(
                        "[createRiskScenariosByOrgId], risk scenario mapped values",
                        riskScenarioData
                    );

                    const [scenario, created] = await OrganizationRiskScenario.upsert(
                        riskScenarioData,
                        {
                            returning: true,
                            transaction: t,
                        }
                    );

                    const paddedId = String(scenario.autoIncrementId).padStart(5, "0");
                    const code = `RS${paddedId}`;
                    await scenario.update({ riskCode: code }, { transaction: t });

                    insertedCount++;

                    await OrganizationRiskScenarioService.handleRiskScenarioProcessMapping(
                        scenario.id,
                        data.relatedProcesses ?? [],
                        t
                    );

                    await OrganizationRiskScenarioService.handleRiskScenarioAttributes(
                        scenario.id,
                        data.attributes ?? [],
                        t
                    );
                }

                return insertedCount;
            });
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create createRiskScenariosByOrgId",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async updateRiskScenario(id, organizationId, createBody) {
        try {
            if (!id || !organizationId) {
                throw new CustomError(
                    "Risk scenario Id and Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }
            if (!createBody) {
                throw new CustomError("invalid body", HttpStatus.BAD_REQUEST);
            }
            return await sequelize.transaction(async (t) => {
                const data = createBody;
                console.log("[createRiskScenariosByOrgId] request received", data);

                OrganizationRiskScenarioService.validateRiskScenarioData(data);

                const riskScenarioData =
                    OrganizationRiskScenarioService.handleRiskScenarioColumnMapping(data);
                console.log(
                    "[createRiskScenariosByOrgId], risk scenario mapped values",
                    riskScenarioData
                );
                const [updatedCount, created] = await OrganizationRiskScenario.update(
                    riskScenarioData,
                    {
                        where: {
                            id,
                            organizationId: organizationId,
                        },
                        returning: true,
                        transaction: t,
                    }
                );
                if (updatedCount < 1) {
                    throw new Error("No risk scenario found");
                }
                await OrganizationRiskScenarioService.handleRiskScenarioProcessMapping(
                    id,
                    data.relatedProcesses ?? [],
                    t
                );

                await OrganizationRiskScenarioService.handleRiskScenarioAttributes(
                    id,
                    data.attributes ?? [],
                    t
                );

                return created;
            });
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create createRiskScenariosByOrgId",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async deleteRiskScenario(ids, orgId) {
        let deletedCount = 0;
        if (!Array.isArray(ids) || !orgId) {
            throw new Error("risk scenario id array, OrgID required");
        }

        return await sequelize.transaction(async (t) => {
            for (const id of ids) {
                console.log("deleting risk scenario :", id, orgId);

                const [updatedCount, updatedRows] =
                    await OrganizationRiskScenario.update(
                        {
                            isDeleted: true,
                        },
                        {
                            where: {
                                id,
                                organizationId: orgId,
                            },
                            returning: true,
                            transaction: t,
                        }
                    );

                if (updatedCount > 0) {
                    deletedCount++;
                }

                await OrganizationProcessRiskScenarioMappings.destroy({
                    where: { riskScenarioId: id },
                    transaction: t,
                });
                await OrganizationRiskScenarioAttribute.destroy({
                    where: { riskScenarioId: id },
                    transaction: t,
                });
            }

            return deletedCount;
        });
    }

    static async getOrganizationMitreThreatsByOrgId(organizationId) {
        try {
            if (!organizationId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const data = await OrganizationThreat.findAll({
                where: {
                    organizationId,
                    isDeleted: false,
                },
                order: [["createdDate", "DESC"]],
            });
            const grouped = Object.values(
                data.reduce((acc, row) => {
                    const key =
                        row.mitreTechniqueId +
                        (row.subTechniqueId ? "." + row.subTechniqueId : "");
                    if (!acc[key]) {
                        acc[key] = {
                            id: row.id,
                            platforms: row.platforms,
                            mitreTechniqueId: row.mitreTechniqueId,
                            mitreTechniqueName: row.mitreTechniqueName,
                            ciaMapping: row.ciaMapping,
                            subTechniqueId: row.subTechniqueId,
                            subTechniqueName: row.subTechniqueName,
                            controls: [],
                            status: row.status,
                            created_at: row.created_at,
                            updated_at: row.updated_at,
                        };
                    }
                    acc[key].controls.push({
                        parentObjectId: row.parentObjectId ?? null,
                        id: row.id,
                        mitreControlId: row.mitreControlId,
                        mitreControlName: row.mitreControlName,
                        mitreControlType: row.mitreControlType,
                        controlPriority: row.controlPriority,
                        mitreControlDescription: row.mitreControlDescription,
                        bluOceanControlDescription: row.bluOceanControlDescription,
                    });
                    return acc;
                }, {})
            );

            return grouped;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization mitre threat",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async createMitreThreatByOrgId(organizationId, createBody) {
        try {
            if (!organizationId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }
            if (!createBody || !Array.isArray(createBody)) {
                throw new CustomError("invalid body", HttpStatus.BAD_REQUEST);
            }

            return await sequelize.transaction(async (t) => {
                const idsToKeep = createBody
                    .map((item) => item.id)
                    .filter((id) => id !== undefined && id !== null);

                await OrganizationThreat.destroy({
                    where: {
                        organizationId: organizationId,
                        ...(idsToKeep.length > 0 ? { id: { [Op.notIn]: idsToKeep } } : {}),
                    },
                });

                let insertedCount = 0;
                for (let i = 0; i < createBody.length; i++) {
                    const data = createBody[i];
                    console.log(
                        "[createMitreThreatControlByOrgId] Creating mitre threat control",
                        data
                    );
                    this.validateMitreThreatControlData(data);
                    const controls = data.controls ?? [];
                    const payloads = controls.map((control) => ({
                        parentObjectId: data?.parentObjectId ?? null,
                        organizationId: organizationId,
                        platforms: data.platforms,
                        mitreTechniqueId: data.mitreTechniqueId,
                        mitreTechniqueName: data.mitreTechniqueName,
                        ciaMapping: data.ciaMapping,
                        subTechniqueId: data.subTechniqueId ?? null,
                        subTechniqueName: data.subTechniqueName ?? null,
                        mitreControlId: control.mitreControlId,
                        mitreControlName: control.mitreControlName,
                        mitreControlType: control.mitreControlType,
                        mitreControlDescription: control.mitreControlDescription,
                        controlPriority: control.controlPriority,
                        bluOceanControlDescription: control.bluOceanControlDescription,
                        status: data.status ?? "published",
                    }));
                    const mitreThreatControlRecord = await OrganizationThreat.bulkCreate(
                        payloads,
                        {
                            transaction: t,
                        }
                    );
                    insertedCount = insertedCount + payloads.length ?? 0;
                }
                return insertedCount;
            });
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create createRiskScenariosByOrgId",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get all taxonomies with severity levels for an organization
     */
    static async getTaxonomiesWithSeverity(orgId) {
        try {
            if (!orgId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const taxonomies = await Taxonomy.findAll({
                where: {
                    organizationId: orgId,
                    isDeleted: false,
                },
                attributes: [
                    "taxonomyId",
                    "name",
                    "organizationId",
                    "createdBy",
                    "modifiedBy",
                    "createdDate",
                    "modifiedDate",
                    "weightage",
                    "order",
                    "isEdited",
                    "isActive",
                ],
                include: [
                    {
                        model: SeverityLevel,
                        as: "severityLevels",
                        where: { isDeleted: false },
                        required: false,
                        attributes: [
                            "severityId",
                            "taxonomyId",
                            "name",
                            "minRange",
                            "maxRange",
                            "createdBy",
                            "modifiedBy",
                            "createdDate",
                            "modifiedDate",
                            "color",
                            "order",
                        ],
                    },
                ],
                order: [
                    ["order", "ASC"], // sort taxonomies
                    [{ model: SeverityLevel, as: "severityLevels" }, "order", "ASC"], // sort severityLevels
                ],
            });

            return taxonomies;
        } catch (err) {
            throw new CustomError(
                err.message ||
                "Failed to fetch organization taxonomies with severity levels",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async getOrganizationAssetById(id, orgId) {
        const asset = await OrganizationAsset.findOne({
            where: {
                organizationId: orgId,
                id: id,
            },
            include: [
                {
                    model: OrganizationProcess,
                    as: "processes",
                    attributes: [
                        "id",
                        "processCode",
                        "processName",
                        "processDescription",
                        "status",
                    ],
                    include: [],
                    through: { attributes: [] },
                },
                {
                    model: OrganizationAssetAttribute,
                    as: "attributes",
                    include: [{ model: MetaData, as: "metaData" }],
                },
            ],
        });

        if (!asset) {
            console.log("Asset not found with id", id);
            throw new CustomError(Messages.ASSET.NOT_FOUND(id), HttpStatus.NOT_FOUND);
        }
        const assetData = asset.toJSON();
        const assetCategory = assetData.assetCategory;
        if (assetCategory) {
            const mitreThreatControls = await MitreThreatControl.findAll({
                where: {
                    platforms: {
                        [Op.contains]: [assetCategory],
                    },
                },
                attributes: [
                    "id",
                    "platforms",
                    "mitreTechniqueId",
                    "mitreTechniqueName",
                    "subTechniqueId",
                    "subTechniqueName",
                    "mitreControlId",
                    "mitreControlName",
                    "controlPriority",
                ],
            });
            assetData.mitreControls = mitreThreatControls;
        }

        return assetData;
    }
    /**
     * Get all assets for a given organization
     */
    static async getAssetsByOrgId(orgId) {
        try {
            if (!orgId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const assets = await OrganizationAsset.findAll({
                where: {
                    organizationId: orgId,
                    isDeleted: false,
                },
                attributes: [
                    "parentObjectId",
                    "id",
                    "organizationId",
                    "autoIncrementId",
                    "assetCode",
                    "applicationName",
                    "applicationOwner",
                    "applicationItOwner",
                    "isThirdPartyManagement",
                    "thirdPartyName",
                    "thirdPartyLocation",
                    "hosting",
                    "hostingFacility",
                    "cloudServiceProvider",
                    "geographicLocation",
                    "hasRedundancy",
                    "databases",
                    "hasNetworkSegmentation",
                    "networkName",
                    "assetCategory",
                    "assetDescription",
                    "status",
                    "createdBy",
                    "modifiedBy",
                    "createdDate",
                    "modifiedDate",
                ],
                order: [["createdDate", "DESC"]],
            });

            return assets;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization assets",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get all assets for a given organization
     */
    static async getAssetsByOrgIdV2(orgId) {
        try {
            if (!orgId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const assets = await OrganizationAsset.findAll({
                where: {
                    organizationId: orgId,
                    isDeleted: false,
                },
                order: [["createdDate", "DESC"]],
                include: [
                    {
                        model: OrganizationAssetAttribute,
                        as: "attributes",
                        include: [{ model: MetaData, as: "metaData" }],
                    },
                    { model: OrganizationProcess, as: "processes" },
                ],
            });

            return assets;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization assets",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async addAssetByOrgId(organizationId, createBody) {
        try {
            if (!organizationId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            if (!createBody) {
                throw new CustomError("invalid body", HttpStatus.BAD_REQUEST);
            }
            return await sequelize.transaction(async (t) => {
                let insertedCount = 0;

                const data = createBody;
                console.log("[createAssetByOrgId] request received", data);

                OrganizationAssetService.validateAssetData(data);

                const assetData =
                    OrganizationAssetService.handleAssetDataColumnMapping(data);
                assetData.organizationId = organizationId;
                assetData.isDeleted = false;

                console.log("[createAssetByOrgId], asset mapped values", assetData);
                const [asset, created] = await OrganizationAsset.upsert(assetData, {
                    returning: true,
                    transaction: t,
                });

                const paddedId = String(asset.autoIncrementId).padStart(5, "0");
                const code = `AT${paddedId}`;
                await asset.update({ assetCode: code }, { transaction: t });

                insertedCount += 1;

                await OrganizationAssetService.handleAssetProcessMapping(
                    asset.id,
                    data.relatedProcesses ?? [],
                    t
                );

                await OrganizationAssetService.handleAssetAttributes(
                    asset.id,
                    data.attributes ?? [],
                    t
                );

                return createBody;
            });
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to add asset by org id",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    static async createAssetByOrgId(organizationId, createBody) {
        try {
            if (!organizationId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            if (!createBody || !Array.isArray(createBody)) {
                throw new CustomError("invalid body", HttpStatus.BAD_REQUEST);
            }
            return await sequelize.transaction(async (t) => {
                const idsToKeep = createBody
                    .map((item) => item.id)
                    .filter((id) => id !== undefined && id !== null);

                await OrganizationAsset.destroy({
                    where: {
                        organizationId: organizationId,
                        ...(idsToKeep.length > 0 ? { id: { [Op.notIn]: idsToKeep } } : {}),
                    },
                });

                let insertedCount = 0;

                for (let i = 0; i < createBody.length; i++) {
                    const data = createBody[i];
                    console.log("[createAssetByOrgId] request received", data);

                    OrganizationAssetService.validateAssetData(data);

                    const assetData =
                        OrganizationAssetService.handleAssetDataColumnMapping(data);
                    assetData.organizationId = organizationId;
                    assetData.isDeleted = false;

                    console.log("[createAssetByOrgId], asset mapped values", assetData);
                    const [asset, created] = await OrganizationAsset.upsert(assetData, {
                        returning: true,
                        transaction: t,
                    });

                    const paddedId = String(asset.autoIncrementId).padStart(5, "0");
                    const code = `AT${paddedId}`;
                    await asset.update({ assetCode: code }, { transaction: t });

                    insertedCount += 1;

                    await OrganizationAssetService.handleAssetProcessMapping(
                        asset.id,
                        data.relatedProcesses ?? [],
                        t
                    );

                    await OrganizationAssetService.handleAssetAttributes(
                        asset.id,
                        data.attributes ?? [],
                        t
                    );
                }

                return insertedCount;
            });
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create createAssetByOrgId",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async updateAsset(id, organizationId, createBody) {
        try {
            if (!id || !organizationId) {
                throw new CustomError(
                    "ID and Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            if (!createBody) {
                throw new CustomError("invalid body", HttpStatus.BAD_REQUEST);
            }
            return await sequelize.transaction(async (t) => {
                const data = createBody;

                console.log("[createAssetByOrgId] request received", data);

                OrganizationAssetService.validateAssetData(data);

                const assetData =
                    OrganizationAssetService.handleAssetDataColumnMapping(data);

                console.log("[createAssetByOrgId], asset mapped values", assetData);
                const [updatedCount, created] = await OrganizationAsset.update(
                    assetData,
                    {
                        where: {
                            id,
                            organizationId: organizationId,
                        },
                        returning: true,
                        transaction: t,
                    }
                );

                if (updatedCount < 1) {
                    throw new Error("failed to update asset");
                }
                await OrganizationAssetService.handleAssetProcessMapping(
                    id,
                    data.relatedProcesses ?? [],
                    t
                );

                await OrganizationAssetService.handleAssetAttributes(
                    id,
                    data.attributes ?? [],
                    t
                );

                return created;
            });
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create createAssetByOrgId",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async deleteAsset(ids, orgId) {
        if (!ids || !Array.isArray(ids) || !orgId) {
            throw new Error("asset id array, OrgID required");
        }
        let deletedCount = 0;
        return await sequelize.transaction(async (t) => {
            for (const id of ids) {
                console.log("deleting asset:", id, orgId);

                const [updatedCount, updatedRows] = await OrganizationAsset.update(
                    {
                        isDeleted: true,
                    },
                    {
                        where: {
                            id,
                            organizationId: orgId,
                        },
                        returning: true,
                        transaction: t,
                    }
                );

                if (updatedCount > 0) {
                    deletedCount++;
                }

                await OrganizationAssetProcessMappings.destroy({
                    where: { assetId: id },
                    transaction: t,
                });
                await OrganizationAssetAttribute.destroy({
                    where: { assetId: id },
                    transaction: t,
                });
            }

            return deletedCount;
        });
    }

    /**
     * Generate next OrgCode based on the last OrgCode in the database
     */
    static async generateOrgCode() {
        const lastOrg = await Organization.findOne({
            order: [["created_date", "DESC"]],
            attributes: ["orgCode"],
        });

        let newOrgCode = "OR0001";

        if (lastOrg) {
            const lastOrgId = lastOrg.orgCode;
            const orgNumber = parseInt(lastOrgId.slice(2), 10); // Get the number after 'OR'
            const nextOrgNumber = orgNumber + 1;
            newOrgCode = `OR${nextOrgNumber.toString().padStart(4, "0")}`;
        }

        return newOrgCode;
    }

    /**
     * Create a new organization
     */
    static async createOrganization(payload) {
        try {
            const { orgName, desc, tags, businessContext = {} } = payload;

            // Generate the new OrgCode
            const orgCode = await this.generateOrgCode();

            const newOrg = await Organization.create({
                orgCode: orgCode,
                name: orgName,
                desc: desc || "",
                industryVertical: businessContext.industryVertical,
                regionOfOperation: businessContext.regionOfOperation,
                numberOfEmployees: businessContext.numberOfEmployees,
                cisoName: businessContext.cisoName,
                cisoEmail: businessContext.cisoEmail,
                annualRevenue: businessContext.annualRevenue,
                riskAppetite: businessContext.riskAppetite,
                cybersecurityBudget: businessContext.cybersecurityBudget,
                insuranceCoverage: businessContext.insuranceCoverage,
                insuranceCarrier: businessContext.insuranceCarrier,
                numberOfClaims: businessContext.numberOfClaims,
                claimsValue: businessContext.claimsValue,
                regulators: businessContext.regulators,
                regulatoryRequirements: businessContext.regulatoryRequirements,
                additionalInformation: businessContext.additionalInformation,
                recordTypes: businessContext.recordTypes || [],
                certifications: businessContext.certifications || [],
                piiRecordsCount: businessContext.piiRecordsCount,
                pfiRecordsCount: businessContext.pfiRecordsCount,
                phiRecordsCount: businessContext.phiRecordsCount,
                governmentRecordsCount: businessContext.governmentRecordsCount,
                intellectualPropertyPercentage:
                    businessContext.intellectualPropertyPercentage,
                tags: tags || [],
            });

            return newOrg;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create organization",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async updateOrganizationById(id, updateData, userId) {
        try {
            const allowedUpdateFields = [
                "name",
                "desc",
                "tags",
                "industryVertical",
                "regionOfOperation",
                "numberOfEmployees",
                "cisoName",
                "cisoEmail",
                "annualRevenue",
                "riskAppetite",
                "cybersecurityBudget",
                "insuranceCoverage",
                "insuranceCarrier",
                "numberOfClaims",
                "claimsValue",
                "regulators",
                "regulatoryRequirements",
                "additionalInformation",
                "recordTypes",
                "piiRecordsCount",
                "pfiRecordsCount",
                "phiRecordsCount",
                "governmentRecordsCount",
                "certifications",
                "intellectualPropertyPercentage",
                "modifiedBy",
            ];

            const organization = await Organization.findByPk(id);

            if (!organization) {
                throw new CustomError("Organization not found", HttpStatus.NOT_FOUND);
            }

            // Flatten the nested businessContext into the main data
            const { businessContext, ...otherData } = updateData;
            let filteredData = { ...otherData };

            if (businessContext) {
                // Extract fields from businessContext and add them to the filtered data
                const businessFields = [
                    "industryVertical",
                    "regionOfOperation",
                    "numberOfEmployees",
                    "cisoName",
                    "cisoEmail",
                    "annualRevenue",
                    "riskAppetite",
                    "cybersecurityBudget",
                    "insuranceCoverage",
                    "insuranceCarrier",
                    "numberOfClaims",
                    "claimsValue",
                    "regulators",
                    "regulatoryRequirements",
                    "additionalInformation",
                    "recordTypes",
                    "piiRecordsCount",
                    "pfiRecordsCount",
                    "phiRecordsCount",
                    "governmentRecordsCount",
                    "certifications",
                    "intellectualPropertyPercentage",
                ];

                businessFields.forEach((field) => {
                    if (businessContext[field]) {
                        filteredData[field] = businessContext[field];
                    }
                });
            }

            // Add audit fields
            //filteredData.modifiedBy = userId;
            filteredData.modifiedDate = new Date();

            // Filter only the allowed fields
            filteredData = Object.keys(filteredData).reduce((acc, key) => {
                if (allowedUpdateFields.includes(key)) {
                    acc[key] = filteredData[key];
                }
                return acc;
            }, {});

            //Update in DB
            await organization.update(filteredData);

            return organization;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to update organization",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async deleteOrganizationById(id, userId) {
        try {
            const organization = await Organization.findByPk(id);

            if (!organization) {
                throw new CustomError("Organization not found", HttpStatus.NOT_FOUND);
            }

            // Instead of hard delete, do a soft delete (isDeleted = true)
            await organization.update({
                isDeleted: true,
                modifiedBy: userId,
                modifiedDate: new Date(),
            });

            return { message: "Organization deleted successfully" };
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to delete organization",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // ---------------------------------------------------------------------------
    // BUSINESS UNIT
    // ---------------------------------------------------------------------------

    static async getBusinessUnitsByOrganizationId(
        orgId,
        page = 0,
        limit = 10,
        searchPattern = "",
        sortBy = "created_date",
        sortOrder = "DESC"
    ) {
        if (!orgId) {
            throw new CustomError(
                "Organization ID is required",
                HttpStatus.BAD_REQUEST
            );
        }

        const offset = page * limit;
        const whereClause = {
            isDeleted: false,
            organizationId: orgId,
        };

        if (searchPattern) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchPattern}%` } },
                { desc: { [Op.iLike]: `%${searchPattern}%` } },
            ];
        }

        try {
            const { count, rows } = await OrganizationBusinessUnit.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                order: [[sortBy, sortOrder]],
                attributes: [
                    "orgBusinessUnitId",
                    "organizationId",
                    "name",
                    "head",
                    "pocBiso",
                    "itPoc",
                    "financeLead",
                    "tags",
                    "createdBy",
                    "modifiedBy",
                    "createdDate",
                    "modifiedDate",
                    "isDeleted",
                    "status",
                ],
            });

            return {
                total: count,
                page,
                limit,
                businessUnits: rows,
            };
        } catch (error) {
            console.error("Error in getBusinessUnitsByOrganizationId:", error);
            throw new CustomError(
                "Failed to fetch business units",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async getBusinessUnitById(id) {
        if (!id) {
            throw new CustomError(
                "Business unit ID is required",
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            const bu = await OrganizationBusinessUnit.findOne({
                where: {
                    orgBusinessUnitId: id,
                    isDeleted: false,
                },
                attributes: [
                    "orgBusinessUnitId",
                    "organizationId",
                    "name",
                    "head",
                    "pocBiso",
                    "itPoc",
                    "financeLead",
                    "tags",
                    "createdBy",
                    "modifiedBy",
                    "createdDate",
                    "modifiedDate",
                    "isDeleted",
                    "status",
                ],
            });

            if (!bu) {
                throw new CustomError("Business unit not found", HttpStatus.NOT_FOUND);
            }

            return bu;
        } catch (error) {
            console.error("Error fetching Business Unit by ID:", error);
            throw new CustomError(
                "Failed to fetch Business Unit",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async createBusinessUnit(orgId, data) {
        if (!data || !data.name) {
            throw new CustomError(
                "Business unit name is required",
                HttpStatus.BAD_REQUEST
            );
        }

        // Prepare payload for DB insert
        const payload = {
            organizationId: orgId,
            name: data.name,
            head: data.head || null,
            pocBiso: data.pocBiso || null,
            itPoc: data.itPoc || null,
            financeLead: data.financeLead || null,
            tags: Array.isArray(data.tags) ? data.tags : [],
            createdBy: data.createdBy || null,
            createdDate: new Date(),
            status: data.status,
        };

        try {
            const newBusinessUnit = await OrganizationBusinessUnit.create(payload);
            return newBusinessUnit;
        } catch (error) {
            console.error("Error creating Business Unit:", error);
            throw new CustomError(
                "Failed to create Business Unit",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async updateBusinessUnitById(id, data) {
        if (!id) {
            throw new CustomError(
                "Business unit ID is required",
                HttpStatus.BAD_REQUEST
            );
        }

        const bu = await OrganizationBusinessUnit.findOne({
            where: { orgBusinessUnitId: id, isDeleted: false },
        });

        if (!bu) {
            throw new CustomError("Business unit not found", HttpStatus.NOT_FOUND);
        }

        // Prepare allowed fields to update
        const updateData = {
            name: data.name ?? bu.name,
            head: data.head ?? bu.head,
            pocBiso: data.pocBiso ?? bu.pocBiso,
            itPoc: data.itPoc ?? bu.itPoc,
            financeLead: data.financeLead ?? bu.financeLead,
            tags: data.tags ?? bu.tags,
            modifiedBy: data.modifiedBy || "system",
            modifiedDate: new Date(),
            status: data.status ?? bu.status,
        };

        await bu.update(updateData);

        return bu;
    }

    static async deleteBusinessUnitById(id, userId) {
        const bu = await OrganizationBusinessUnit.findByPk(id);
        if (!bu)
            throw new CustomError("Business unit not found", HttpStatus.NOT_FOUND);

        await bu.update({
            isDeleted: true,
            modifiedBy: userId,
            modifiedDate: new Date(),
        });

        return { message: "Business unit deleted successfully" };
    }

    /**
     * Save or update taxonomies with severity levels for an organization (Option B)
     */
    static async saveTaxonomiesWithSeverity(orgId, taxonomies) {
        try {
            if (!orgId) {
                throw new CustomError(
                    "Organization ID is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const savedTaxonomies = [];

            for (const taxonomyData of taxonomies) {
                const {
                    taxonomyId,
                    name,
                    weightage,
                    createdBy,
                    order,
                    isEdited,
                    isActive,
                    severityLevels = [],
                } = taxonomyData;

                let taxonomy;

                if (taxonomyId) {
                    taxonomy = await Taxonomy.findOne({
                        where: {
                            taxonomyId,
                            organizationId: orgId,
                            isDeleted: false,
                        },
                    });

                    if (taxonomy) {
                        await taxonomy.update({
                            name,
                            weightage,
                            order: order ?? taxonomy.order,
                            isEdited: isEdited ?? true,
                            isActive: isActive ?? taxonomy.isActive,
                            modifiedBy: createdBy,
                            modifiedDate: new Date(),
                        });
                    } else {
                        taxonomy = await Taxonomy.create({
                            name,
                            weightage,
                            organizationId: orgId,
                            createdBy,
                            createdDate: new Date(),
                            isEdited: isEdited ?? false,
                            isActive: isActive ?? true,
                            order: order ?? 0,
                        });
                    }
                } else {
                    taxonomy = await Taxonomy.create({
                        name,
                        weightage,
                        organizationId: orgId,
                        createdBy,
                        createdDate: new Date(),
                        isEdited: isEdited ?? false,
                        isActive: isActive ?? true,
                        order: order ?? 0,
                    });
                }

                const savedSeverities = [];

                for (const level of severityLevels) {
                    const {
                        severityId,
                        name,
                        minRange,
                        maxRange,
                        color,
                        createdBy,
                        order,
                    } = level;

                    let severity;

                    if (severityId) {
                        severity = await SeverityLevel.findOne({
                            where: {
                                severityId,
                                taxonomyId: taxonomy.taxonomyId,
                                isDeleted: false,
                            },
                        });

                        if (severity) {
                            await severity.update({
                                name,
                                minRange,
                                maxRange,
                                color,
                                order: order ?? severity.order,
                                modifiedBy: createdBy,
                                modifiedDate: new Date(),
                            });
                        } else {
                            severity = await SeverityLevel.create({
                                taxonomyId: taxonomy.taxonomyId,
                                name,
                                minRange,
                                maxRange,
                                color,
                                createdBy,
                                createdDate: new Date(),
                                isEdited: isEdited ?? false,
                                isActive: isActive ?? true,
                                order: order ?? 0,
                            });
                        }
                    } else {
                        severity = await SeverityLevel.create({
                            taxonomyId: taxonomy.taxonomyId,
                            name,
                            minRange,
                            maxRange,
                            color,
                            createdBy,
                            createdDate: new Date(),
                            order: order ?? 0,
                        });
                    }

                    savedSeverities.push(severity);
                }

                savedTaxonomies.push({
                    ...taxonomy.get({ plain: true }),
                    severityLevels: savedSeverities,
                });
            }

            return savedTaxonomies;

        } catch (err) {
            throw new CustomError(
                err.message || "Failed to save or update taxonomies with severity levels",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    static async syncLibraries({ organizationId, libraryNames, orgBusinessUnitId, userId }) {
        const output = {};

        for (const name of libraryNames) {
            switch (name) {

                case "process":
                case "process_attribute":
                case "process":
                case "process_relation":
                case "riskScenario":
                case "risk_scenario_attribute":
                case "risk_scenario_process":
                case "asset":
                case "asset_attribute":
                case "asset_process":
                    output[name] = await this.syncSingleLibrary(
                        name,
                        organizationId,
                        orgBusinessUnitId,
                        userId
                    );
                    break;

                default:
                    output[name] = { skipped: true, error: "Unknown library type." };
            }
        }
        return output;
    }

    static async syncSingleLibrary(name, organizationId, orgBusinessUnitId, userId) {

        let GenericModel, OrgModel, mappingFields;

        switch (name) {

            // -------------------------------------------------
            // PROCESS
            // -------------------------------------------------
            case "process":
                GenericModel = Process;
                OrgModel = OrganizationProcess;
                mappingFields = (item) => ({
                    parentObjectId: item.id,
                    organizationId,
                    orgBusinessUnitId,
                    processCode: item.processCode,
                    processName: item.processName,
                    processDescription: item.processDescription,
                    seniorExecutiveOwnerName: item.seniorExecutiveOwnerName,
                    seniorExecutiveOwnerEmail: item.seniorExecutiveOwnerEmail,
                    operationsOwnerName: item.operationsOwnerName,
                    operationsOwnerEmail: item.operationsOwnerEmail,
                    technologyOwnerName: item.technologyOwnerName,
                    technologyOwnerEmail: item.technologyOwnerEmail,
                    organizationalRevenueImpactPercentage: item.organizationalRevenueImpactPercentage,
                    financialMateriality: item.financialMateriality,
                    thirdPartyInvolvement: item.thirdPartyInvolvement,
                    usersCustomers: item.usersCustomers,
                    regulatoryAndCompliance: item.regulatoryAndCompliance,
                    criticalityOfDataProcessed: item.criticalityOfDataProcessed,
                    dataProcessed: item.dataProcessed,
                    status: item.status,
                    createdBy: userId,
                });
                break;

            // -------------------------------------------------
            // PROCESS ATTRIBUTE
            // -------------------------------------------------
            case "process-attribute":
                GenericModel = ProcessAttribute;
                OrgModel = OrganizationProcessAttribute;
                mappingFields = (item) => ({
                    processId: null,
                    metaDataKeyId: item.meta_data_key_id,
                    values: item.values,
                });
                break;

            // -------------------------------------------------
            // PROCESS RELATION
            // -------------------------------------------------
            case "process-relation":
                GenericModel = ProcessRelationship;
                OrgModel = OrganizationProcessRelationship;
                mappingFields = (item) => ({
                    sourceProcessId: null,
                    targetProcessId: null,
                    relationshipType: item.relationship_type,
                    description: item.description,
                });
                break;

            // -------------------------------------------------
            // ASSET
            // -------------------------------------------------
            case "asset":
                GenericModel = Asset;
                OrgModel = OrganizationAsset;
                mappingFields = (item) => ({
                    parentObjectId: item.id,
                    organizationId,
                    applicationName: item.applicationName,
                    applicationOwner: item.applicationOwner,
                    applicationItOwner: item.applicationItOwner,
                    isThirdPartyManagement: item.isThirdPartyManagement,
                    thirdPartyName: item.thirdPartyName,
                    thirdPartyLocation: item.thirdPartyLocation,
                    hosting: item.hosting,
                    hostingFacility: item.hostingFacility,
                    cloudServiceProvider: item.cloudServiceProvider,
                    geographicLocation: item.geographicLocation,
                    hasRedundancy: item.hasRedundancy,
                    databases: item.databases,
                    hasNetworkSegmentation: item.hasNetworkSegmentation,
                    networkName: item.networkName,
                    assetCategory: item.assetCategory,
                    assetDescription: item.assetDescription,
                    status: item.status,
                    createdBy: userId,
                });
                break;

            // -------------------------------------------------
            // ASSET ATTRIBUTE
            // -------------------------------------------------
            case "asset-attribute":
                GenericModel = AssetAttribute;
                OrgModel = OrganizationAssetAttribute;
                mappingFields = (item) => ({
                    assetId: null,
                    metaDataKeyId: item.meta_data_key_id,
                    values: item.values,
                });
                break;

            // -------------------------------------------------
            // ASSET-PROCESS
            // -------------------------------------------------
            case "asset-process":
                GenericModel = AssetProcessMappings;
                OrgModel = OrganizationAssetProcessMappings;
                mappingFields = () => ({
                    assetId: null,
                    processId: null,
                });
                break;

            // -------------------------------------------------
            // RISK SCENARIO
            // -------------------------------------------------
            case "risk-scenario":
                GenericModel = RiskScenario;
                OrgModel = OrganizationRiskScenario;
                mappingFields = (item) => ({
                    parentObjectId: item.id,
                    organizationId,
                    riskScenario: item.riskScenario,
                    riskDescription: item.riskDescription,
                    riskStatement: item.riskStatement,
                    ciaMapping: item.ciaMapping,
                    status: item.status,
                    createdBy: userId,
                });
                break;

            // -------------------------------------------------
            // RISK SCENARIO ATTRIBUTE
            // -------------------------------------------------
            case "risk-scenario-attribute":
                GenericModel = RiskScenarioAttribute;
                OrgModel = OrganizationRiskScenarioAttribute;

                mappingFields = (item) => ({
                    riskScenarioId: null,
                    metaDataKeyId: item.meta_data_key_id,
                    values: item.values,
                });
                break;

            // -------------------------------------------------
            // RISK SCENARIO PROCESS
            // -------------------------------------------------
            case "risk-scenario-process":
                GenericModel = ProcessRiskScenarioMappings;
                OrgModel = OrganizationProcessRiskScenarioMappings;

                mappingFields = () => ({
                    riskScenarioId: null,
                    processId: null,
                });
                break;

            // -------------------------------------------------
            // MITRE THREAT
            // -------------------------------------------------
            case "mitre-threat":
                GenericModel = MitreThreatControl;
                OrgModel = OrganizationThreat;

                mappingFields = (item) => ({
                    parentObjectId: item.id,
                    organizationId,
                    platforms: item.platforms,
                    mitreTechniqueId: item.mitreTechniqueId,
                    mitreTechniqueName: item.mitreTechniqueName,
                    ciaMapping: item.ciaMapping,
                    subTechniqueId: item.subTechniqueId,
                    subTechniqueName: item.subTechniqueName,
                    mitreControlId: item.mitreControlId,
                    mitreControlName: item.mitreControlName,
                    mitreControlType: item.mitreControlType,
                    mitreControlDescription: item.mitreControlDescription,
                    controlPriority: item.controlPriority,
                    bluOceanControlDescription: item.bluOceanControlDescription,
                    status: item.status,
                    createdBy: userId,
                });
                break;

            default:
                return { error: "Invalid library type" };
        }

        // -------------------------------------------------
        // FETCH GENERIC ITEMS
        // -------------------------------------------------
        const genericItems = await GenericModel.findAll();
        let inserted = 0, skipped = 0;

        for (const g of genericItems) {

            // PROCESS ATTRIBUTE
            if (name === "process-attribute") {

                const orgProcess = await OrganizationProcess.findOne({
                    where: { parentObjectId: g.process_id, organizationId }
                });

                if (!orgProcess) { skipped++; continue; }

                const exists = await OrgModel.findOne({
                    where: { processId: orgProcess.id, metaDataKeyId: g.meta_data_key_id }
                });

                if (exists) { skipped++; continue; }

                const data = mappingFields(g);
                data.processId = orgProcess.id;
                data.createdBy = userId;

                await OrgModel.create(data);
                inserted++;
                continue;
            }

            // PROCESS RELATION
            if (name === "process-relation") {

                const src = await OrganizationProcess.findOne({
                    where: { parentObjectId: g.source_process_id, organizationId }
                });

                const trg = await OrganizationProcess.findOne({
                    where: { parentObjectId: g.target_process_id, organizationId }
                });

                if (!src || !trg) { skipped++; continue; }

                const exists = await OrgModel.findOne({
                    where: { sourceProcessId: src.id, targetProcessId: trg.id }
                });

                if (exists) { skipped++; continue; }

                const data = mappingFields(g);
                data.sourceProcessId = src.id;
                data.targetProcessId = trg.id;
                data.createdBy = userId;

                await OrgModel.create(data);
                inserted++;
                continue;
            }

            // -----------------------------------------------------
            // ASSET ATTRIBUTE
            // -----------------------------------------------------
            if (name === "asset-attribute") {

                const orgAsset = await OrganizationAsset.findOne({
                    where: { parentObjectId: g.asset_id, organizationId }
                });

                if (!orgAsset) { skipped++; continue; }

                const exists = await OrgModel.findOne({
                    where: { assetId: orgAsset.id, metaDataKeyId: g.meta_data_key_id }
                });

                if (exists) { skipped++; continue; }

                const data = mappingFields(g);
                data.assetId = orgAsset.id;
                data.createdBy = userId;

                await OrgModel.create(data);
                inserted++;
                continue;
            }

            // -----------------------------------------------------
            // ASSET–PROCESS
            // -----------------------------------------------------
            if (name === "asset-process") {

                const orgAsset = await OrganizationAsset.findOne({
                    where: { parentObjectId: g.asset_id, organizationId }
                });

                const orgProcess = await OrganizationProcess.findOne({
                    where: { parentObjectId: g.process_id, organizationId }
                });

                if (!orgAsset || !orgProcess) { skipped++; continue; }

                const exists = await OrgModel.findOne({
                    where: { assetId: orgAsset.id, processId: orgProcess.id }
                });

                if (exists) { skipped++; continue; }

                const data = mappingFields(g);
                data.assetId = orgAsset.id;
                data.processId = orgProcess.id;
                data.createdBy = userId;

                await OrgModel.create(data);
                inserted++;
                continue;
            }

            // -----------------------------------------------------
            // RISK SCENARIO ATTRIBUTE
            // -----------------------------------------------------
            if (name === "risk-scenario-attribute") {

                const orgRisk = await OrganizationRiskScenario.findOne({
                    where: { parentObjectId: g.risk_scenario_id, organizationId }
                });

                if (!orgRisk) { skipped++; continue; }

                const exists = await OrgModel.findOne({
                    where: {
                        riskScenarioId: orgRisk.id,
                        metaDataKeyId: g.meta_data_key_id,
                    }
                });

                if (exists) { skipped++; continue; }

                const data = mappingFields(g);
                data.riskScenarioId = orgRisk.id;
                data.createdBy = userId;

                await OrgModel.create(data);
                inserted++;
                continue;
            }

            // -----------------------------------------------------
            // RISK SCENARIO PROCESS
            // -----------------------------------------------------
            if (name === "risk-scenario-process") {

                const orgRisk = await OrganizationRiskScenario.findOne({
                    where: { parentObjectId: g.risk_scenario_id, organizationId }
                });

                const orgProcess = await OrganizationProcess.findOne({
                    where: { parentObjectId: g.process_id, organizationId }
                });

                if (!orgRisk || !orgProcess) { skipped++; continue; }

                const exists = await OrgModel.findOne({
                    where: {
                        riskScenarioId: orgRisk.id,
                        processId: orgProcess.id,
                    }
                });

                if (exists) { skipped++; continue; }

                const data = mappingFields(g);
                data.riskScenarioId = orgRisk.id;
                data.processId = orgProcess.id;
                data.createdBy = userId;

                await OrgModel.create(data);
                inserted++;
                continue;
            }

            // -------------------------------------------------
            // DEFAULT SYNC (process, asset, risk scenario)
            // -------------------------------------------------
            const exists = await OrgModel.findOne({
                where: { parentObjectId: g.id, organizationId }
            });

            if (exists) { skipped++; continue; }

            await OrgModel.create(mappingFields(g));
            inserted++;
        }

        return {
            library: name,
            inserted,
            skipped,
            total: genericItems.length,
        };
    }

}

module.exports = OrganizationService;
