const { DataTypes } = require("sequelize");
const commonFields = require("./common_fields");

module.exports = (sequelize) => {
    const AssessmentRiskTaxonomy = sequelize.define(
        "AssessmentRiskTaxonomy",
        {
            assessmentRiskTaxonomyId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_risk_taxonomy_id",
            },
            assessmentRiskId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_risk_id",
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
                type: DataTypes.UUID,
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

            ...commonFields,
        },
        {
            tableName: "assessment_risk_taxonomy",
            timestamps: false,
        }
    );

    AssessmentRiskTaxonomy.associate = (models) => {
        // belongsTo Assessment
        AssessmentRiskTaxonomy.belongsTo(models.Assessment, {
            foreignKey: "assessmentId",
            targetKey: "assessmentId",
            as: "assessment",
        });

        // belongsTo AssessmentRisk
        AssessmentRiskTaxonomy.belongsTo(models.AssessmentRisk, {
            foreignKey: "assessmentRiskId",
            targetKey: "assessmentRiskId",
            as: "risk",
        });
    };

    return AssessmentRiskTaxonomy;
};
