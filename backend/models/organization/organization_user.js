const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const OrganizationUser = sequelize.define(
        "OrganizationUser",
        {
            orgUserId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_user_id",
            },
            organizationId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "org_id", // maps alias organizationId → DB column org_id
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
                field: "email",
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "password",
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "phone",
            },
            organization: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "organization",
            },
            communicationPreference: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "communication_preference",
            },
            ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "organization_user",
            timestamps: false, // using custom audit fields instead of Sequelize defaults
        }
    );

    OrganizationUser.associate = (models) => {
        // belongsTo Organization
        OrganizationUser.belongsTo(models.Organization, {
            foreignKey: "organizationId", // alias
            targetKey: "organizationId",
            as: "organizationDetails",
        });

        // One Organization → Many Users
        if (models.Organization) {
            models.Organization.hasMany(OrganizationUser, {
                foreignKey: "organizationId", // alias
                sourceKey: "organizationId",
                as: "users",
            });
        }
    };

    return OrganizationUser;
};
