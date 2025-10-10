const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AssetProcessMappings = sequelize.define(
    "AssetProcessMappings",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      asset_id: {
        type: DataTypes.UUID,
        references: { model: "library_asset", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      process_id: {
        type: DataTypes.UUID,
        references: { model: "library_processes", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "library_asset_process_mappings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AssetProcessMappings;
};
