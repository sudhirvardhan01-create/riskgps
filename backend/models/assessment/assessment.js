const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const Assessment = sequelize.define(
        "Assessment",
        {
            assessmentId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_id",
            },
            runId: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "run_id",
            },
            organizationId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "organization_id",
            },
            organizationName: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "organization_name",
            },
            organizationDesc: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "organization_desc",
            },
            businessUnitId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "business_unit_id",
            },
            businessUnitName: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "business_unit_name",
            },
            businessUnitDesc: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "business_unit_desc",
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: true,
                field: "start_date",
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
                field: "end_date",
            },
            lastActivity: {
                type: DataTypes.DATE,
                allowNull: true,
                field: "last_activity",
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "user_id",
            },

            ...commonFields,
        },
        {
            tableName: "assessment",
            timestamps: false,
        }
    );

    Assessment.associate = (models) => {
        //Assessment.hasMany(models.AssessmentRiskTaxonomy, {
        //    foreignKey: "assessmentId",
        //    sourceKey: "assessmentId",
        //    as: "riskTaxonomies",
        //});

        Assessment.hasMany(models.AssessmentRiskScenarioBusinessImpact, {
            foreignKey: "assessmentId",
            sourceKey: "assessmentId",
            as: "businessImpacts",
        });
    };

    return Assessment;
};
