const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const OrganizationThreat = sequelize.define(
        "OrganizationThreat",
        {
            orgThreatId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_threat_id",
            },
            organizationId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "org_id", // alias → DB column org_id
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "organization_threat",
            timestamps: false, // using custom audit fields instead of Sequelize defaults
        }
    );

    OrganizationThreat.associate = (models) => {
        // belongsTo Organization
        OrganizationThreat.belongsTo(models.Organization, {
            foreignKey: "organizationId",
            targetKey: "organizationId",
            as: "organizationDetails",
        });

        // One Organization → Many Threats
        if (models.Organization) {
            models.Organization.hasMany(OrganizationThreat, {
                foreignKey: "organizationId",
                sourceKey: "organizationId",
                as: "threats",
            });
        }
    };

    return OrganizationThreat;
};
