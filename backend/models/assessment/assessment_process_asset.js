const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const AssessmentProcessAsset = sequelize.define(
        "AssessmentProcessAsset",
        {
            assessmentProcessAssetId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_process_asset_id",
            },
            assessmentProcessId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_process_id",
            },
            assessmentId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_id",
            },
            assetName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "asset_name",
            },
            assetDesc: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "asset_desc",
            },
            ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, etc.
        },
        {
            tableName: "assessment_process_asset",
            schema: "public",
            timestamps: false,
        }
    );

    AssessmentProcessAsset.associate = (models) => {
        // Relation to AssessmentProcess
        AssessmentProcessAsset.belongsTo(models.AssessmentProcess, {
            foreignKey: "assessmentProcessId",
            as: "assessmentProcess",
        });

        //// Relation to Assessment
        //AssessmentProcessAsset.belongsTo(models.Assessment, {
        //    foreignKey: "assessmentId",
        //    as: "assessment",
        //});
    };

    return AssessmentProcessAsset;
};
