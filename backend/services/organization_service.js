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
   * Get processes for an organization + business unit (both mandatory)
   */
  static async getOrganizationProcessesV2(orgId, businessUnitId) {
    try {
      if (!orgId || !businessUnitId) {
        throw new CustomError(
          "Organization ID and Business Unit ID are required",
          HttpStatus.BAD_REQUEST
        );
      }

      const processes =
        await OrganizationProcessService.fetchOrganizationProcess(
          orgId,
          businessUnitId
        );
        
      return processes;
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to fetch organization processes",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async createProcessByOrgIdAndBuId(orgId, buId, createBody) {
    if (!orgId || !buId) {
      throw new Error("OrgID and BuID required");
    }
    if (!createBody || !Array.isArray(createBody)) {
      throw new CustomError("invalid body", HttpStatus.BAD_REQUEST);
    }
    return await sequelize.transaction(async (t) => {
      let insertedCount = 0;
      const idsToKeep = createBody
        .map((item) => item.id)
        .filter((id) => id !== undefined && id !== null);
      await OrganizationProcess.destroy({
        where: {
          organizationId: orgId,
          orgBusinessUnitId: buId,
          ...(idsToKeep.length > 0 ? { id: { [Op.notIn]: idsToKeep } } : {}),
        },
      });

      for (let i = 0; i < createBody.length; i++) {
        const data = createBody[i];
        OrganizationProcessService.validateProcessData(data);

        const processData =
          OrganizationProcessService.handleProcessDataColumnMapping(data);
        processData.organizationId = orgId;
        processData.orgBusinessUnitId = buId;
        console.log("Creating process with data:", processData);

        const [process, created] = await OrganizationProcess.upsert(
          processData,
          {
            returning: true,
            transaction: t,
          }
        );
        console.log(process, "creted");
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
          console.log(data.attributes);
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
    if (!id || !orgId || !buId) {
      throw new Error("process id, OrgID and BuID required");
    }

    return await sequelize.transaction(async (t) => {
      const data = createBody;
      OrganizationProcessService.validateProcessData(data);

      const processData =
        OrganizationProcessService.handleProcessDataColumnMapping(data);
      processData.orgBusinessUnitId = buId;
      console.log("Creating process with data:", processData);

      const [updatedCount, updatedRows] = await OrganizationProcess.update(
        processData,
        {
          where: {
            id,
            organizationId: orgId,
            orgBusinessUnitId: buId,
          },
          returning: true,
          transaction: t,
        }
      );

      if (updatedCount < 1) {
        throw new Error("No process found.");
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

      return updatedRows;
    });
  }

  static async deleteProcess(id, orgId, buId) {
    if (!id || !orgId || !buId) {
      throw new Error("process id, OrgID and BuID required");
    }

    return await sequelize.transaction(async (t) => {
      console.log("deleting process process with data:", id, orgId, buId);

      const [updatedCount, updatedRows] = await OrganizationProcess.update(
        {
          isDeleted: true,
        },
        {
          where: {
            id,
            organizationId: orgId,
            orgBusinessUnitId: buId,
          },
          returning: true,
          transaction: t,
        }
      );

      if (updatedCount < 1) {
        throw new Error("No process found.");
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

      return updatedCount;
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

  static async deleteRiskScenario(id, orgId) {
    if (!id || !orgId) {
      throw new Error("risk scenario id, OrgID required");
    }

    return await sequelize.transaction(async (t) => {
      console.log("deleting risk scenario :", id, orgId);

      const [updatedCount, updatedRows] = await OrganizationRiskScenario.update(
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

      if (updatedCount < 1) {
        throw new Error("No risk scenario found.");
      }

      await OrganizationProcessRiskScenarioMappings.destroy({
        where: { riskScenarioId: id },
        transaction: t,
      });
      await OrganizationRiskScenarioAttribute.destroy({
        where: { riskScenarioId: id },
        transaction: t,
      });

      return updatedCount;
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
            order: [["order"]],
          },
        ],
        order: [["order"]],
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

          console.log("[createAssetByOrgId], asset mapped values", assetData);
          const [asset, created] = await OrganizationAsset.upsert(assetData, {
            returning: true,
            transaction: t,
          });
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

  static async deleteAsset(id, orgId) {
    if (!id || !orgId) {
      throw new Error("asset id, OrgID required");
    }

    return await sequelize.transaction(async (t) => {
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

      if (updatedCount < 1) {
        throw new Error("No asset found.");
      }

      await OrganizationAssetProcessMappings.destroy({
        where: { assetId: id },
        transaction: t,
      });
      await OrganizationAssetAttribute.destroy({
        where: { assetId: id },
        transaction: t,
      });

      return updatedCount;
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
