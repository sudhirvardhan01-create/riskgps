const HttpStatus = require("../constants/httpStatusCodes");
const { PROCESS } = require("../constants/library");
const Messages = require("../constants/messages");
const {
  OrganizationProcess,
  OrganizationProcessRelationship,
  MetaData,
  OrganizationRiskScenario,
  OrganizationProcessAttribute,
} = require("../models");
const CustomError = require("../utils/CustomError");

class OrganizationProcessService {
  static fetchOrganizationProcess = async (orgId, businessUnitId) => {
    if (!orgId || !businessUnitId) {
      console.log("required arguments not passed", orgId, businessUnitId);
      throw new Error("required arguments not passed");
    }
    const includeRelations = [
      {
        model: OrganizationProcessAttribute,
        as: "attributes",
        include: [{ model: MetaData, as: "metaData" }],
      },
      {
        model: OrganizationRiskScenario,
        as: "riskScenarios",
      },
      {
        model: OrganizationProcessRelationship,
        as: "sourceRelationships",
      },
      {
        model: OrganizationProcessRelationship,
        as: "targetRelationships",
      },
    ];

    const data = await OrganizationProcess.findAll({
      where: {
        organizationId: orgId,
        orgBusinessUnitId: businessUnitId,
        isDeleted: false,
      },
      order: [["createdDate", "DESC"]],
      include: includeRelations,
    });

    let processes = data.map((s) => s.toJSON());

    for (let i = 0; i < processes.length; i++) {
      const p = processes[i];

      p.attributes = p.attributes.map((val) => ({
        metaDataKeyIid: val.metaDataKeyIid,
        values: val.values,
      }));

      p.processDependency = [];

      if (p?.sourceRelationships?.length > 0) {
        p.processDependency.push(
          ...p.sourceRelationships.map((val) => ({
            sourceProcessId: val.sourceProcessId,
            targetProcessId: val.targetProcessId,
            relationshipType: val.relationshipType,
          }))
        );
      }

      if (p?.targetRelationships?.length > 0) {
        p.processDependency.push(
          ...p.targetRelationships.map((val) => ({
            sourceProcessId: val.sourceProcessId,
            targetProcessId: val.targetProcessId,
            relationshipType: val.relationshipType,
          }))
        );
      }

      delete p.sourceRelationships;
      delete p.targetRelationships;
    }

    return processes;
  };

  static validateProcessData = (data) => {
    const { processName, status } = data;

    if (!processName) {
      throw new CustomError(
        Messages.PROCESS.PROCESS_NAME_REQUIRED,
        HttpStatus.BAD_REQUEST
      );
    }
  };

  static handleProcessDataColumnMapping(data) {
    const fields = [
      "parentObjectId",
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
    ];

    return Object.fromEntries(
      fields.map((key) => [key, data[key] === "" ? null : data[key]])
    );
  }

  static async handleProcessDependencies(
    sourceProcessId,
    dependencies,
    transaction
  ) {
    for (const dependency of dependencies) {
      if (
        !dependency.relationshipType ||
        !PROCESS.PROCESS_RELATIONSHIP_TYPES.includes(
          dependency.relationshipType
        )
      ) {
        console.log("Invalid relationship type in dependency:", dependency);
        throw new CustomError(
          Messages.PROCESS.INVALID_RELATIONSHIP_TYPE,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!dependency.targetProcessId) {
        console.log("Invalid or missing target_process_id:", dependency);
        throw new CustomError(
          Messages.PROCESS.MISSING_TARGET_ID,
          HttpStatus.BAD_REQUEST
        );
      }

      if (
        dependency.sourceProcessId &&
        dependency.sourceProcessId != sourceProcessId
      ) {
        const sourceProcess = await OrganizationProcess.findByPk(
          dependency.sourceProcessId
        );
        if (!sourceProcess) {
          console.log("Source process not found:", dependency.sourceProcessId);
          throw new CustomError(
            Messages.PROCESS.SOURCE_NOT_FOUND,
            HttpStatus.NOT_FOUND
          );
        }
      } else {
        dependency.sourceProcessId = sourceProcessId;
      }
      const targetProcess = await OrganizationProcess.findByPk(
        dependency.targetProcessId
      );
      if (!targetProcess) {
        console.log("Target process not found:", dependency.targetProcessId);
        throw new CustomError(
          Messages.PROCESS.TARGET_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      await OrganizationProcessRelationship.upsert(
        {
          sourceProcessId: dependency.sourceProcessId,
          targetProcessId: dependency.targetProcessId,
          relationshipType: dependency.relationshipType,
        },
        { transaction }
      );
    }
  }

  static async handleProcessAttributes(processId, attributes, transaction) {
    for (const attr of attributes) {
      if (!attr.metaDataKeyId || !attr.values) {
        console.log("Missing metaDataKeyId or values:", attr);
        throw new CustomError(
          Messages.PROCESS.MISSING_ATTRIBUTE_FIELD,
          HttpStatus.BAD_REQUEST
        );
      }

      const metaData = await MetaData.findByPk(attr.metaDataKeyId, {
        transaction,
      });
      if (!metaData) {
        console.log("MetaData not found:", attr.metaDataKeyId);
        throw new CustomError(
          Messages.PROCESS.METADATA_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      const supportedValues = metaData.supported_values;
      if (
        supportedValues?.length > 0 &&
        !attr.values.every((v) => supportedValues.includes(v))
      ) {
        console.log("Unsupported values in attribute:", attr);
        throw new CustomError(
          Messages.PROCESS.INVALID_ATTRIBUTE_VALUE,
          HttpStatus.BAD_REQUEST
        );
      }

      await OrganizationProcessAttribute.create(
        {
          processId: processId,
          metaDataKeyId: attr.metaDataKeyId,
          values: attr.values,
        },
        { transaction }
      );
    }
  }
}

module.exports = OrganizationProcessService;
