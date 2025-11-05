const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const {
  OrganizationRiskScenarioAttribute,
  OrganizationProcessRiskScenarioMappings,
  OrganizationProcess,
  MetaData,
} = require("../models");
const CustomError = require("../utils/CustomError");
class OrganizationRiskScenarioService {
  
  static validateRiskScenarioData(data) {
    const { riskScenario } = data;

    if (!riskScenario) {
      console.log("[validateRiskScenarioData] Missing risk_scenario");
      throw new CustomError(
        Messages.RISK_SCENARIO.REQUIRED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  static handleRiskScenarioColumnMapping(data) {
    const fields = [
      "parentObjectId",
      "riskScenario",
      "riskDescription",
      "riskStatement",
      "ciaMapping",
      "status",
      "riskField1",
      "riskField2",
    ];

    return Object.fromEntries(
      fields.map((key) => [key, data[key] === "" ? null : data[key]])
    );
  }

  static async handleRiskScenarioProcessMapping(
    riskScenarioId,
    relatedProcesses,
    transaction
  ) {
    await OrganizationProcessRiskScenarioMappings.destroy({
      where: { riskScenarioId: riskScenarioId },
      transaction: transaction,
    });

    if (Array.isArray(relatedProcesses)) {
      for (const process of relatedProcesses) {
        if (typeof process !== "string") {
          console.log("[handleRiskScenarioProcessMapping] Invalid related process:", process);
          throw new CustomError(
            Messages.RISK_SCENARIO.INVALID_PROCESS_MAPPING,
            HttpStatus.BAD_REQUEST
          );
        }

        const processData = await OrganizationProcess.findByPk(process);
        if (!processData) {
          console.log("[handleRiskScenarioProcessMapping] Related process not found:", process);
          throw new CustomError(
            Messages.RISK_SCENARIO.INVALID_PROCESS_MAPPING,
            HttpStatus.NOT_FOUND
          );
        }

        await OrganizationProcessRiskScenarioMappings.create(
          {
            riskScenarioId: riskScenarioId,
            processId: process,
          },
          { transaction }
        );
      }
    }
  }

  static async handleRiskScenarioAttributes(
    riskScenarioId,
    attributes,
    transaction
  ) {
    await OrganizationRiskScenarioAttribute.destroy({
      where: { riskScenarioId: riskScenarioId },
      transaction: transaction,
    });
    for (const attr of attributes) {
      if (!attr.metaDataKeyId || !attr.values) {
        console.log("Missing meta_data_key_id or values:", attr);
        throw new CustomError(
          Messages.LIBARY.MISSING_ATTRIBUTE_FIELD,
          HttpStatus.BAD_REQUEST
        );
      }

      const metaData = await MetaData.findByPk(attr.metaDataKeyId, {
        transaction,
      });
      if (!metaData) {
        console.log("MetaData not found:", attr.metaDataKeyId);
        throw new CustomError(
          Messages.LIBARY.METADATA_NOT_FOUND,
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
          Messages.LIBARY.INVALID_ATTRIBUTE_VALUE,
          HttpStatus.BAD_REQUEST
        );
      }

      await OrganizationRiskScenarioAttribute.create(
        {
          riskScenarioId: riskScenarioId,
          metaDataKeyId: attr.metaDataKeyId,
          values: attr.values,
        },
        { transaction }
      );
    }
  }
}

module.exports = OrganizationRiskScenarioService;
