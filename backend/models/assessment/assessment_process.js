const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const AssessmentProcess = sequelize.define(
    "AssessmentProcess",
    {
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
      processName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "process_name",
      },
      processDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "process_description",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "order",
      },
      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, etc.
    },
    {
      tableName: "assessment_process",
      schema: "public",
      timestamps: false,
    }
  );

  AssessmentProcess.associate = (models) => {
    // Relation to Assessment
    AssessmentProcess.belongsTo(models.Assessment, {
      foreignKey: "assessmentId",
      as: "assessment",
    });

    AssessmentProcess.hasMany(models.AssessmentProcessRiskScenario, {
      foreignKey: "assessmentProcessId",
      as: "risks",
    });

    AssessmentProcess.hasMany(models.AssessmentProcessAsset, {
      foreignKey: "assessmentProcessId",
      as: "assets",
    });
  };

  return AssessmentProcess;
};
