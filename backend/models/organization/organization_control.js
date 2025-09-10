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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            ...commonFields,
        },
        {
            tableName: "organization_control",
            timestamps: false,
        }
    );

    OrganizationControl.associate = (models) => {
        // later: if organization ↔ control mapping exists, add associations here
        // Example:
        // OrganizationControl.belongsTo(models.Organization, {
        //     foreignKey: "organizationId",
        //     targetKey: "organizationId",
        //     as: "organization",
        // });
    };

    return OrganizationControl;
};