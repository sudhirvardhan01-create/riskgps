const { commonFields } = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const OrganizationBusinessUnit = sequelize.define(
        "OrganizationBusinessUnit",
        {
            orgBusinessUnitId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_business_unit_id",
            },
            organizationId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "org_id",
            },
            businessUnitName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "business_unit_name",
            },
            ...commonFields,
        },
        {
            tableName: "organization_business_unit",
            timestamps: false,
        }
    );

    OrganizationBusinessUnit.associate = (models) => {
        // belongsTo Organization
        OrganizationBusinessUnit.belongsTo(models.Organization, {
            foreignKey: "organizationId",
            targetKey: "organizationId",
            as: "organization",
        });

        // Optionally: An organization can have many business units
        if (models.Organization) {
            models.Organization.hasMany(OrganizationBusinessUnit, {
                foreignKey: "organizationId",
                sourceKey: "organizationId",
                as: "businessUnits",
            });
        }
    };

    return OrganizationBusinessUnit;
};
