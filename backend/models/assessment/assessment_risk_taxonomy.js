const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const AssessmentRiskTaxonomy = sequelize.define(
        "AssessmentRiskTaxonomy",
        {
            assessmentRiskTaxonomyId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_risk_taxonomy_id",
            },
            assessmentProcessRiskId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_process_risk_id",
            },
            assessmentId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_id",
            },
            taxonomyName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "taxonomy_name",
            },
            severityName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "severity_name",
            },
            severityMinRange: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "severity_min_range",
            },
            severityMaxRange: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "severity_max_range",
            },
            weightage: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "weightage",
            },
            color: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "color",
            },
            ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "assessment_risk_taxonomy",
            schema: "public",
            timestamps: false,
        }
    );

    AssessmentRiskTaxonomy.associate = (models) => {
        // Relation to Assessment
        AssessmentRiskTaxonomy.belongsTo(models.Assessment, {
            foreignKey: "assessmentId",
            as: "assessment",
        });

        // Relation to AssessmentProcessRiskScenario
        AssessmentRiskTaxonomy.belongsTo(models.AssessmentProcessRiskScenario, {
            foreignKey: "assessmentProcessRiskId",
            as: "assessmentProcessRiskScenario",
        });
    };

    return AssessmentRiskTaxonomy;
};
