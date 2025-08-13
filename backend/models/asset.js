const { DataTypes } = require("sequelize");
const { STATUS_SUPPORTED_VALUES } = require("../constants/library");

module.exports = (sequelize) => {
  const Asset = sequelize.define(
    "Asset",
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      asset_code: {
        unique: true,
        type: DataTypes.STRING,
      },
      application_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      application_owner: { 
        type: DataTypes.STRING,
        allowNull: true 
      },
      application_it_owner: { 
        type: DataTypes.STRING,
        allowNull: true 
      },
      third_party_management: {
        type: DataTypes.BOOLEAN,
        allowNull: true 
      },
      third_party_name: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      third_party_location: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      hosting: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      hosting_facility: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      cloud_service_provider: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      geographic_location: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      redundancy: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      databases: {
        type: DataTypes.STRING,
        allowNull: true
      },
      network_segmentation: {
        type: DataTypes.STRING,
        allowNull: true
      },
      network_name: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      asset_category: {
        type: DataTypes.STRING,
        allowNull: true
      },
      asset_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      asset_description: {
        type: DataTypes.STRING,
        allowNull: true
      },    

      status: { 
        defaultValue: 'published',
        allowNull: false,
        type: DataTypes.ENUM(...STATUS_SUPPORTED_VALUES) 
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
      foreignKey: 'asset_id',
      otherKey: 'process_id',
      as: 'processes',
    });

    Asset.hasMany(models.AssetAttribute, {
      foreignKey: 'asset_id',
      as: 'attributes',
    });
  };

  Asset.afterCreate(async (instance, options) => {
    const paddedId = String(instance.id).padStart(5, "0");
    const code = `#BPA-${paddedId}`;
    await instance.update({ asset_code: code }, { transaction: options.transaction });
  });
  return Asset;

};

