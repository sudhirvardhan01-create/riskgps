const { GENERAL, ASSETS } = require("../../constants/library");
const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const AssessmentThreat = sequelize.define(
        "AssessmentThreat",
        {
            assessmentThreatId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "assessment_threat_id",
            },
            assessmentId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "assessment_id",
            },
            platforms: {
                allowNull: false,
                type: DataTypes.STRING,
                field: "platforms",
            },
            mitreTechniqueId: {
                allowNull: false,
                type: DataTypes.STRING,
                field: "mitre_technique_id",
            },
            mitreTechniqueName: {
                allowNull: false,
                type: DataTypes.STRING,
                field: "mitre_technique_name",
            },
            ciaMapping: {
                allowNull: false,
                type: DataTypes.STRING,
                field: "cia_mapping",
            },
            mitreControlId: {
                type: DataTypes.STRING,
                field: "mitre_control_id",
            },
            mitreControlName: {
                type: DataTypes.STRING,
                field: "mitre_control_name",
            },
            mitreControlDescription: {
                type: DataTypes.TEXT,
                field: "mitre_control_description",
            },
            ...commonFields,
        },
        {
            tableName: "assessment_threat",
            schema: "public",
            timestamps: false,
        }
    );

    AssessmentThreat.associate = (models) => {
        AssessmentThreat.belongsTo(models.Assessment, {
            foreignKey: "assessmentId",
            as: "assessment",
        });
    };

    return AssessmentThreat;
};
