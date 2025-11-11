const { ASSETS, GENERAL } = require("../../constants/library");
const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const OrganizationAsset = sequelize.define(
    "OrganizationAsset",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
      parentObjectId: {
        type: DataTypes.UUID,
        field: "parent_object_id",
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "org_id", // alias → DB column org_id
      },
      autoIncrementId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        field: "auto_increment_id",
      },
      assetCode: {
        unique: true,
        type: DataTypes.STRING,
        field: "asset_code",
      },
      applicationName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "application_name",
      },
      applicationOwner: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "application_owner",
      },
      applicationItOwner: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "application_it_owner",
      },
      isThirdPartyManagement: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "is_third_party_management",
      },
      thirdPartyName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "third_party_name",
      },
      thirdPartyLocation: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "third_party_location",
      },
      hosting: {
        type: DataTypes.ENUM(...ASSETS.HOSTING_SUPPORTED_VALUES),
        allowNull: true,
        field: "hosting",
      },
      hostingFacility: {
        type: DataTypes.ENUM(...ASSETS.HOSTING_FACILITY_SUPPORTED_VALUES),
        allowNull: true,
        field: "hosting_facility",
      },
      cloudServiceProvider: {
        type: DataTypes.ARRAY(
          DataTypes.ENUM(...ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES)
        ),
        allowNull: true,
        field: "cloud_service_provider",
      },
      geographicLocation: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "geographic_location",
      },
      hasRedundancy: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "has_redundancy",
      },
      databases: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "databases",
      },
      hasNetworkSegmentation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "has_network_segmentation",
      },
      networkName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "network_name",
      },
      assetCategory: {
        type: DataTypes.ENUM(...ASSETS.ASSET_CATEGORY),
        allowNull: false,
        field: "asset_category",
      },
      assetDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "asset_description",
      },

      status: {
        defaultValue: "published",
        allowNull: false,
        type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES),
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization_asset",
      timestamps: false, // we use custom audit fields
    }
  );

  OrganizationAsset.associate = (models) => {
    // belongsTo Organization
    OrganizationAsset.belongsTo(models.Organization, {
      foreignKey: "organizationId", // alias
      targetKey: "organizationId",
      as: "organizationDetails",
    });

    // One Organization → Many Assets
    if (models.Organization) {
      models.Organization.hasMany(OrganizationAsset, {
        foreignKey: "organizationId",
        sourceKey: "organizationId",
        as: "organizationAssets",
      });
    }

    OrganizationAsset.belongsToMany(models.OrganizationProcess, {
      through: models.OrganizationAssetProcessMappings,
      foreignKey: "assetId",
      otherKey: "processId",
      as: "processes",
    });
    OrganizationAsset.hasMany(models.OrganizationAssetAttribute, {
      foreignKey: "assetId",
      as: "attributes",
    });
  };

  OrganizationAsset.afterCreate(async (instance, options) => {
    const paddedId = String(instance.autoIncrementId).padStart(5, "0");
    const code = `AT${paddedId}`;
    await instance.update(
      { assetCode: code },
      { transaction: options.transaction }
    );
  });

  return OrganizationAsset;
};
