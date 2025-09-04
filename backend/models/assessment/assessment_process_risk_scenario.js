const { DataTypes } = require("sequelize");
const commonFields = require("./common_fields");

module.exports = (sequelize) => {
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
            riskScenarioName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "risk_scenario_name",
            },
            riskScenarioDesc: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "risk_scenario_desc",
            },
            assessmentId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_id",
            },

            ...commonFields,
        },
        {
            tableName: "assessment_process_risk_scenario",
            timestamps: false,
        }
    );

    AssessmentProcessRiskScenario.associate = (models) => {
        // belongsTo Assessment
        AssessmentProcessRiskScenario.belongsTo(models.Assessment, {
            foreignKey: "assessmentId",
            targetKey: "assessmentId",
            as: "assessment",
        });

        // belongsTo AssessmentProcess
        AssessmentProcessRiskScenario.belongsTo(models.AssessmentProcess, {
            foreignKey: "assessmentProcessId",
            targetKey: "assessmentProcessId",
            as: "process",
        });
    };

    return AssessmentProcessRiskScenario;
};
