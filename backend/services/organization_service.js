const {
    Organization,
    OrganizationBusinessUnit,
    OrganizationProcess,
    OrganizationRiskScenario,
    Sequelize,
} = require("../models");
const { Op } = Sequelize;
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");

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

            const whereClause = {};
            if (searchPattern) {
                whereClause.name = { [Op.iLike]: `%${searchPattern}%` };
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
                            "businessUnitName",
                            "businessUnitDesc",
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
    static async getOrganizationProcesses(orgId, businessUnitId) {
        try {
            if (!orgId || !businessUnitId) {
                throw new CustomError(
                    "Organization ID and Business Unit ID are required",
                    HttpStatus.BAD_REQUEST
                );
            }

            const processes = await OrganizationProcess.findAll({
                where: {
                    organizationId: orgId,
                    orgBusinessUnitId: businessUnitId,
                    isDeleted: false,
                },
                attributes: [
                    "orgProcessId",
                    "name",
                    "orgBusinessUnitId",
                    "organizationId",
                    "createdBy",
                    "modifiedBy",
                    "createdDate",
                    "modifiedDate",
                ],
                order: [["createdDate", "DESC"]],
            });

            if (!processes || processes.length === 0) {
                throw new CustomError(
                    "No processes found for given organization and business unit",
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
     * Get all risk scenarios by organizationId
     */
    static async getRiskScenariosByOrgId(organizationId) {
        try {
            if (!organizationId) {
                throw new CustomError("Organization ID is required", HttpStatus.BAD_REQUEST);
            }

            const scenarios = await OrganizationRiskScenario.findAll({
                where: {
                    organizationId,
                    isDeleted: false,
                },
                attributes: [
                    "orgRiskId",
                    "organizationId",
                    "riskCode",
                    "name",
                    "description",
                    "statement",
                    "status",
                    "field1",
                    "field2",
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
}

module.exports = OrganizationService;
