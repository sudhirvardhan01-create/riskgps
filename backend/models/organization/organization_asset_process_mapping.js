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
      asset_id: {
        type: DataTypes.UUID,
        references: { model: "organization_asset", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      process_id: {
        type: DataTypes.UUID,
        references: { model: "organization_process", key: "id" },
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
