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
          "id",
          "processName",
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
          "id",
          "organizationId",
          "autoIncrementId",
          "assetCode",
          "applicationName",
          "applicationOwner",
          "applicationItOwner",
          "isThirdPartyManagement",
          "thirdPartyName",
          "assetCategory",
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
   * Save taxonomies with severity levels for an organization (insert-only, use UI-provided order)
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

      // Iterate through all taxonomies from UI
      for (const taxonomyData of taxonomies) {
        const {
          name,
          weightage,
          createdBy,
          order, // 👈 order provided from UI
          severityLevels = [],
        } = taxonomyData;

        // Create taxonomy as-is (no updates)
        const taxonomy = await Taxonomy.create({
          name,
          weightage,
          organizationId: orgId,
          createdBy,
          createdDate: new Date(),
          isDeleted: false,
          order: order ?? 0, // fallback if not provided
        });

        const savedSeverities = [];

        // Save each severity level using provided order
        for (const level of severityLevels) {
          const {
            name,
            minRange,
            maxRange,
            color,
            createdBy,
            order, // severity order from UI
          } = level;

          const severity = await SeverityLevel.create({
            taxonomyId: taxonomy.taxonomyId,
            name,
            minRange,
            maxRange,
            color,
            createdBy,
            createdDate: new Date(),
            isDeleted: false,
            order: order ?? 0, // fallback if not provided
          });

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
        err.message || "Failed to save taxonomies with severity levels",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = OrganizationService;
