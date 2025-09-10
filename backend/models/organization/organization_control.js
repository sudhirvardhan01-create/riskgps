const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const OrganizationControl = sequelize.define(
        "OrganizationControl",
        {
            orgControlId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_control_id",
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
            tableName: "organization_control",
            timestamps: false, // we’re handling timestamps manually
        }
    );

    OrganizationControl.associate = (models) => {
        // belongsTo Organization
        OrganizationControl.belongsTo(models.Organization, {
            foreignKey: "organizationId", // alias
            targetKey: "organizationId",
            as: "organizationDetails",
        });

        // One Organization → Many Controls
        if (models.Organization) {
            models.Organization.hasMany(OrganizationControl, {
                foreignKey: "organizationId",
                sourceKey: "organizationId",
                as: "controls",
            });
        }
    };

    return OrganizationControl;
};
