const HttpStatus = require("../constants/httpStatusCodes");
const { ASSETS } = require("../constants/library");
const Messages = require("../constants/messages");
const {
  MetaData,
  OrganizationProcess,
  OrganizationAssetAttribute,
  OrganizationAssetProcessMappings,
} = require("../models");
const CustomError = require("../utils/CustomError");

class OrganizationAssetService {
  static validateAssetData(data) {
    const {
      applicationName,
      hosting,
      hostingFacility,
      cloudServiceProvider,
      assetCategory,
    } = data;

    if (!applicationName) {
      throw new CustomError(
        Messages.ASSET.APPLICATION_NAME_REQUIRED,
        HttpStatus.BAD_REQUEST
      );
    }

    if (hosting && !ASSETS.HOSTING_SUPPORTED_VALUES.includes(hosting)) {
      throw new CustomError(
        Messages.ASSET.INVALID_HOSTING_VALUE,
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      hostingFacility &&
      !ASSETS.HOSTING_FACILITY_SUPPORTED_VALUES.includes(hostingFacility)
    ) {
      throw new CustomError(
        Messages.ASSET.INVALID_HOSTING_FACILITY_VALUE,
        HttpStatus.BAD_REQUEST
      );
    }

    if (cloudServiceProvider) {
      if (
        !Array.isArray(cloudServiceProvider) ||
        !cloudServiceProvider.every((p) =>
          ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES.includes(p)
        )
      ) {
        throw new CustomError(
          Messages.ASSET.INVALID_CLOUD_SERVICE_PROVIDER,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (!assetCategory || !ASSETS.ASSET_CATEGORY.includes(assetCategory)) {
      throw new CustomError(
        Messages.ASSET.INVALID_ASSET_CATEGORY,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  static handleAssetDataColumnMapping(data) {
    const fields = [
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
    ];

    return Object.fromEntries(
      fields.map((key) => [key, data[key] === "" ? null : data[key]])
    );
  }

  static async handleAssetProcessMapping(
    assetId,
    relatedProcesses,
    transaction
  ) {
    if (Array.isArray(relatedProcesses)) {
      await OrganizationAssetProcessMappings.destroy({
        where: { assetId: assetId },
        transaction: transaction,
      });
      for (const process of relatedProcesses) {
        if (typeof process !== "string") {
          console.log("[createAsset] Invalid related process:", process);
          throw new CustomError(
            Messages.ASSET.INVALID_PROCESS_MAPPING,
            HttpStatus.BAD_REQUEST
          );
        }

        const processData = await OrganizationProcess.findByPk(process);
        if (!processData) {
          console.log("[createAsset] Related process not found:", process);
          throw new CustomError(
            Messages.ASSET.INVALID_PROCESS_MAPPING,
            HttpStatus.NOT_FOUND
          );
        }

        await OrganizationAssetProcessMappings.create(
          {
            assetId: assetId,
            processId: process,
          },
          { transaction }
        );
      }
    }
  }

  static async handleAssetAttributes(assetId, attributes, transaction) {
    await OrganizationAssetAttribute.destroy({
      where: { assetId: assetId },
      transaction: transaction,
    });
    for (const attr of attributes) {
      if (!attr.metaDataKeyId || !attr.values) {
        console.log("Missing metaDataKeyId or values:", attr);
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
        throw new CustomError(
          Messages.LIBARY.INVALID_ATTRIBUTE_VALUE,
          HttpStatus.BAD_REQUEST
        );
      }

      await OrganizationAssetAttribute.create(
        {
          assetId: assetId,
          metaDataKeyId: attr.metaDataKeyId,
          values: attr.values,
        },
        { transaction }
      );
    }
  }
}

module.exports = OrganizationAssetService;
