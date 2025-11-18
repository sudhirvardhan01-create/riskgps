const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const AssetControlScore = sequelize.define(
    "AssetControlScore",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
      orgAssetId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_asset_id",
      },
      controlId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "control_id",
      },
      ciaMapping: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "cia_mapping",
      },
      controlType: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "control_type",
      },
      controlScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "control_score",
      },

      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, etc.
    },
    {
      tableName: "asset_control_score",
      schema: "public",
      timestamps: false,
    }
  );

  return AssetControlScore;
};
