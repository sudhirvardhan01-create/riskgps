const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrganizationAssetProcessMappings = sequelize.define(
    "OrganizationAssetProcessMappings",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      assetId: {
        type: DataTypes.UUID,
        references: { model: "organization_asset", key: "id" },
        field: "asset_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      processId: {
        type: DataTypes.UUID,
        references: { model: "organization_process", key: "id" },
        field: "process_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "organization_asset_process_mappings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return OrganizationAssetProcessMappings;
};
