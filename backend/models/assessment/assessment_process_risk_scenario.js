const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const AssessmentProcessRiskScenario = sequelize.define(
    "AssessmentProcessRiskScenario",
    {
      assessmentProcessRiskId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "assessment_process_risk_id",
      },
      assessmentProcessId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "assessment_process_id",
      },
      assessmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "assessment_id",
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
      riskScenario: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "risk_scenario",
      },
      riskDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "risk_description",
      },
      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "assessment_process_risk_scenario",
      schema: "public",
      timestamps: false,
    }
  );

  AssessmentProcessRiskScenario.associate = (models) => {
    // Relation to AssessmentProcess
    AssessmentProcessRiskScenario.belongsTo(models.AssessmentProcess, {
      foreignKey: "assessmentProcessId",
      as: "assessmentProcess",
    });

    // Relation to Assessment
    AssessmentProcessRiskScenario.belongsTo(models.Assessment, {
      foreignKey: "assessmentId",
      as: "assessment",
    });

    AssessmentProcessRiskScenario.belongsTo(models.OrganizationRiskScenario, {
      foreignKey: "id",
      as: "orgRiskScenario",
    });

    AssessmentProcessRiskScenario.hasMany(
      models.AssessmentRiskScenarioBusinessImpact,
      {
        foreignKey: "assessmentProcessRiskId",
        as: "riskScenarioBusinessImpacts",
      }
    );

    AssessmentProcessRiskScenario.hasMany(models.AssessmentRiskTaxonomy, {
      foreignKey: "assessmentProcessRiskId",
      as: "taxonomy",
    });
  };

  return AssessmentProcessRiskScenario;
};
