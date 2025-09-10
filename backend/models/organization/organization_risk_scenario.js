const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const OrganizationRiskScenario = sequelize.define(
        "OrganizationRiskScenario",
        {
            orgRiskId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_risk_id",
            },
            organizationId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "org_id", // alias → DB column org_id
            },
            riskCode: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "risk_code",
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "description",
            },
            statement: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "statement",
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "status",
            },
            field1: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "field1",
            },
            field2: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "field2",
            },
            ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "organization_risk_scenario",
            timestamps: false, // we’re handling audit fields manually
        }
    );

    OrganizationRiskScenario.associate = (models) => {
        // belongsTo Organization
        OrganizationRiskScenario.belongsTo(models.Organization, {
            foreignKey: "organizationId",
            targetKey: "organizationId",
            as: "organizationForRiskScenarios",
        });

        // One Organization → Many Risk Scenarios
        if (models.Organization) {
            models.Organization.hasMany(OrganizationRiskScenario, {
                foreignKey: "organizationId",
                sourceKey: "organizationId",
                as: "organizationRiskScenarios",
            });
        }
    };

    return OrganizationRiskScenario;
};
