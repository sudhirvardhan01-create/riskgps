const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ReportsAssetNistControlScore = sequelize.define(
    "ReportsAssetNistControlScore",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      orgId: { type: DataTypes.UUID, allowNull: true, field: "org_id" },

      // Asset details
      assetId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      assetName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assetCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      nistControlId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "nist_control_id",
      },
      frameWorkName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      controlCategoryId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      controlCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      controlSubCategoryId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      controlSubCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Calculated score
      calcultatedControlScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      // MITRE data array as JSON
      mitreControlsAndScores: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "reports_asset_nist_control_score",
      timestamps: true,
      underscored: true,
    }
  );

  return ReportsAssetNistControlScore;
};
