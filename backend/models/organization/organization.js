const commonFields = require("./common_fields");

module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define(
        "Organization",
        {
            organizationId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_id",
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            ...commonFields,
        },
        {
            tableName: "organization",
            timestamps: false,
        }
    );

    Organization.associate = (models) => {
        // one organization has many assessments
        Organization.hasMany(models.Assessment, {
            foreignKey: "organizationId",
            sourceKey: "organizationId",
            as: "assessments",
        });

        // one organization has many business units
        Organization.hasMany(models.OrganizationBusinessUnit, {
            foreignKey: "org_id",
            sourceKey: "organizationId",
            as: "business_units",
        });
    };

    return Organization;
};
