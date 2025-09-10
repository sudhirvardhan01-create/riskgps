const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const OrganizationProcess = sequelize.define(
        "OrganizationProcess",
        {
            orgProcessId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "org_process_id",
            },
            organizationId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "org_id", // alias → maps to DB column org_id
            },
            orgBusinessUnitId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "org_business_unit_id", // new field added
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "organization_process",
            timestamps: false, // using custom fields instead of Sequelize defaults
        }
    );

    OrganizationProcess.associate = (models) => {
        // belongsTo Organization
        OrganizationProcess.belongsTo(models.Organization, {
            foreignKey: "organizationId",
            targetKey: "organizationId",
            as: "organizationDetails",
        });

        // belongsTo Organization Business Unit
        OrganizationProcess.belongsTo(models.OrganizationBusinessUnit, {
            foreignKey: "orgBusinessUnitId",
            targetKey: "orgBusinessUnitId",
            as: "businessUnitDetails",
        });

        // One Organization → Many Processes
        if (models.Organization) {
            models.Organization.hasMany(OrganizationProcess, {
                foreignKey: "organizationId",
                sourceKey: "organizationId",
                as: "processes",
            });
        }

        // One Business Unit → Many Processes
        if (models.OrganizationBusinessUnit) {
            models.OrganizationBusinessUnit.hasMany(OrganizationProcess, {
                foreignKey: "orgBusinessUnitId",
                sourceKey: "orgBusinessUnitId",
                as: "unitProcesses",
            });
        }
    };

    return OrganizationProcess;
};
