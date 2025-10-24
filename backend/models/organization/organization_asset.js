const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const OrganizationAsset = sequelize.define(
    "OrganizationAsset",
    {
      orgAssetId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "org_asset_id",
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "org_id", // alias → DB column org_id
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "description",
      },
      assetCategory: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "asset_category",
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
  };

  return OrganizationAsset;
};
