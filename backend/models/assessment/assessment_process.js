const commonFields = require("./common_fields");

module.exports = (sequelize, DataTypes) => {
    const AssessmentProcess = sequelize.define(
        "AssessmentProcess",
        {
            assessmentProcessId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_process_id",
            },
            processName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "process_name",
            },
            processDescription: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "process_description",
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "order",
            },
            assessmentId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_id",
            },

            ...commonFields,
        },
        {
            tableName: "assessment_process",
            timestamps: false,
        }
    );

    AssessmentProcess.associate = (models) => {
        AssessmentProcess.belongsTo(models.Assessment, {
            foreignKey: "assessmentId",
            targetKey: "assessmentId",
            as: "assessment",
        });
    };

    return AssessmentProcess;
};
