const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const AssessmentProcessAsset = sequelize.define(
    "AssessmentProcessAsset",
    {
      assessmentProcessAssetId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "assessment_process_asset_id",
      },
      assessmentProcessId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "assessment_process_id",
      },
      assessmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "assessment_id",
      },
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
      applicationName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "application_name",
      },
      assetCategory: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "asset_category",
      },
      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, etc.
    },
    {
      tableName: "assessment_process_asset",
      schema: "public",
      timestamps: false,
    }
  );

  AssessmentProcessAsset.associate = (models) => {
    // Relation to AssessmentProcess
    AssessmentProcessAsset.belongsTo(models.AssessmentProcess, {
      foreignKey: "assessmentProcessId",
      as: "assessmentProcess",
    });

    AssessmentProcessAsset.hasMany(models.AssessmentQuestionaire, {
      foreignKey: "assessmentProcessAssetId",
      as: "questionnaire",
    });
  };

  return AssessmentProcessAsset;
};
