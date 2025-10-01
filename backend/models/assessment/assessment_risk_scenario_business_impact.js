const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const AssessmentRiskScenarioBusinessImpact = sequelize.define(
        "AssessmentRiskScenarioBusinessImpact",
        {
            assessmentRiskBIId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_risk_bi_id",
            },
            assessmentId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_id",
            },
            assessmentProcessRiskId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_process_risk_id",
            },
            riskThreshold: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "risk_threshold",
            },
            riskThresholdValue: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "risk_threshold_value",
            },
            ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "assessment_risk_scenario_business_impact",
            schema: "public",
            timestamps: false,
        }
    );

    AssessmentRiskScenarioBusinessImpact.associate = (models) => {
        // Relation to Assessment
        AssessmentRiskScenarioBusinessImpact.belongsTo(models.Assessment, {
            foreignKey: "assessmentId",
            as: "assessment",
        });

        // Relation to AssessmentProcessRiskScenario
        AssessmentRiskScenarioBusinessImpact.belongsTo(models.AssessmentProcessRiskScenario, {
            foreignKey: "assessmentProcessRiskId",
            as: "assessmentProcessRiskScenario",
        });
    };

    return AssessmentRiskScenarioBusinessImpact;
};
