const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define(
        "Organization",
        {
            organizationId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_id", // maps alias organizationId -> DB column org_id
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            desc: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "desc",
            },
            ...commonFields, // adds createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "organization",
            timestamps: false, // disable default createdAt/updatedAt
        }
    );

    Organization.associate = (models) => {
        // One organization has many assessments
        Organization.hasMany(models.Assessment, {
            foreignKey: "organizationId", // keep alias
            sourceKey: "organizationId",
            as: "assessments",
        });

        /**
        * Organization → Business Units
        */
        Organization.hasMany(models.OrganizationBusinessUnit, {
            foreignKey: "organizationId",
            sourceKey: "organizationId",
            as: "businessUnits",
        });

        /**
         * Organization → Assets
         */
        Organization.hasMany(models.OrganizationAsset, {
            foreignKey: "organizationId",
            sourceKey: "organizationId",
            as: "assets",
        });

        /**
         * Organization → Risk Scenarios
         */
        Organization.hasMany(models.OrganizationRiskScenario, {
            foreignKey: "organizationId",
            sourceKey: "organizationId",
            as: "riskScenarios",
        });

        /**
         * Organization → Taxonomies
         */
        Organization.hasMany(models.Taxonomy, {
            foreignKey: "organizationId",
            sourceKey: "organizationId",
            as: "taxonomies",
        });
    };

    return Organization;
};
