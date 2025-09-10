const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const AssessmentRiskScenarioBusinessImpact = sequelize.define(
        "AssessmentRiskScenarioBusinessImpact",
        {
            assessmentRiskBiId: {
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
            assessmentRiskId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_risk_id",
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

            ...commonFields,
        },
        {
            tableName: "assessment_risk_scenario_business_impact",
            timestamps: false,
        }
    );

    AssessmentRiskScenarioBusinessImpact.associate = (models) => {
        // belongsTo Assessment
        AssessmentRiskScenarioBusinessImpact.belongsTo(models.Assessment, {
            foreignKey: "assessmentId",
            targetKey: "assessmentId",
            as: "assessment",
        });

        // belongsTo AssessmentRiskTaxonomy (or RiskScenario model if you have it)
        //AssessmentRiskScenarioBusinessImpact.belongsTo(models.AssessmentRiskTaxonomy, {
        //    foreignKey: "assessmentRiskId",
        //    targetKey: "assessmentRiskId",
        //    as: "riskTaxonomy",
        //});
    };

    return AssessmentRiskScenarioBusinessImpact;
};
