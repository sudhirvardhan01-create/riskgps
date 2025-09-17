const { commonFields } = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const Assessment = sequelize.define(
        "Assessment",
        {
            assessmentId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_id",
            },
            assessmentName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "assessment_name",
            },
            assessmentDesc: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "assessment_desc",
            },
            runId: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "run_id",
            },
            orgId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "org_id",
            },
            orgName: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "org_name",
            },
            orgDesc: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "org_desc",
            },
            businessUnitId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: "business_unit_id",
            },
            businessUnitName: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "business_unit_name",
            },
            businessUnitDesc: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "business_unit_desc",
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "status",
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: true,
                field: "start_date",
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
                field: "end_date",
            },
            lastActivity: {
                type: DataTypes.DATE,
                allowNull: true,
                field: "last_activity",
            },
            // userId: {
            //     type: DataTypes.UUID,
            //     allowNull: true,
            //     field: "user_id",
            // },
            ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, tenantId, status, etc.
        },
        {
            tableName: "assessment",
            schema: "public",
            timestamps: false,
        }
    );

    Assessment.associate = (models) => {
        // Organization Relation
        Assessment.belongsTo(models.Organization, {
            foreignKey: "orgId",
            as: "organization",
        });

        // Business Unit Relation
        Assessment.belongsTo(models.OrganizationBusinessUnit, {
            foreignKey: "businessUnitId",
            as: "businessUnit",
        });

        // User Relation
        // Assessment.belongsTo(models.User, {
        //     foreignKey: "userId",
        //     as: "user",
        // });
    };

    return Assessment;
};
