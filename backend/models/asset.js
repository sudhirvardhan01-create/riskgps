const { DataTypes } = require("sequelize");
const { GENERAL, ASSETS } = require("../constants/library");

module.exports = (sequelize) => {
  const Asset = sequelize.define(
    "Asset",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      asset_code: {
        unique: true,
        type: DataTypes.STRING,
      },
      application_name: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false,
      },
      application_owner: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      application_it_owner: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_third_party_management: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      third_party_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      third_party_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hosting: {
        type: DataTypes.ENUM(...ASSETS.HOSTING_SUPPORTED_VALUES),
        allowNull: true,
      },
      hosting_facility: {
        type: DataTypes.ENUM(...ASSETS.HOSTING_FACILITY_SUPPORTED_VALUES),
        allowNull: true,
      },
      cloud_service_provider: {
        type: DataTypes.ARRAY(
          DataTypes.ENUM(...ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES)
        ),
        allowNull: true,
      },
      geographic_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      has_redundancy: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      databases: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      has_network_segmentation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      network_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      asset_category: {
        type: DataTypes.ENUM(...ASSETS.ASSET_CATEGORY),
        allowNull: false,
      },
      asset_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        defaultValue: "published",
        allowNull: false,
        type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES),
      },
    },
    {
      tableName: "library_assets",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Asset.associate = (models) => {
    // Many-to-many with Process
    Asset.belongsToMany(models.Process, {
      through: models.AssetProcessMappings,
      foreignKey: "asset_id",
      otherKey: "process_id",
      as: "processes",
    });

    Asset.hasMany(models.AssetAttribute, {
      foreignKey: "asset_id",
      as: "attributes",
    });
  };

  Asset.afterCreate(async (instance, options) => {
    const paddedId = String(instance.id).padStart(5, "0");
    const code = `AT${paddedId}`;
    await instance.update(
      { asset_code: code },
      { transaction: options.transaction }
    );
  });
  return Asset;
};
