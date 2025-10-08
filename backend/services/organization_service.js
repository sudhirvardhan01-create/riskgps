const {
    Organization,
    OrganizationBusinessUnit,
    OrganizationProcess,
    OrganizationRiskScenario,
    Sequelize,
    Taxonomy,
    SeverityLevel,
    OrganizationAsset,
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

            const whereClause = {
                isDeleted: false
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
                            "desc",
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
                        ],
                    },
                ],
                order: [["createdDate", "DESC"]],
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
                    "orgAssetId",
                    "organizationId",
                    "name",
                    "description",
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
     * Generate next OrgCode based on the last OrgCode in the database
     */
    static async generateOrgCode() {
        const lastOrg = await Organization.findOne({
            order: [['created_date', 'DESC']],
            attributes: ['orgCode'],
        });

        console.log(lastOrg);

        let newOrgCode = 'OR0001';

        if (lastOrg) {
            const lastOrgId = lastOrg.orgCode;
            console.log(lastOrg.org_code);
            const orgNumber = parseInt(lastOrgId.slice(2), 10); // Get the number after 'OR'
            const nextOrgNumber = orgNumber + 1;
            newOrgCode = `OR${nextOrgNumber.toString().padStart(4, '0')}`;
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
}

module.exports = OrganizationService;
