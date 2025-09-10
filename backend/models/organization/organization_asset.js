const { commonFields } = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const OrganizationAsset = sequelize.define(
        "OrganizationAsset",
        {
            orgAssetId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_asset_id",
            },
            organizationId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "organization_id",
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            ...commonFields,
        },
        {
            tableName: "organization_asset",
            timestamps: false,
        }
    );

    OrganizationAsset.associate = (models) => {
        // belongsTo Organization
        OrganizationAsset.belongsTo(models.Organization, {
            foreignKey: "organizationId",
            targetKey: "organizationId",
            as: "organization",
        });
    };

    return OrganizationAsset;
};
