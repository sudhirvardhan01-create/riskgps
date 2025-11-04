const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const AssessmentQuestionaire = sequelize.define(
    "AssessmentQuestionaire",
    {
      assessmentQuestionaireId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "assessment_questionaire_id",
      },
      assessmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "assessment_id",
      },
      assessmentProcessAssetId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "assessment_process_asset_id",
      },
      questionnaireId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "questionaire_id",
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "questionaire_name",
      },
      responseValue: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "response_value",
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "assessment_questionaire",
      schema: "public",
      timestamps: false,
    }
  );

  AssessmentQuestionaire.associate = (models) => {
    // Relation to Assessment
    AssessmentQuestionaire.belongsTo(models.Assessment, {
      foreignKey: "assessmentId",
      as: "assessment",
    });

    // Relation to AssessmentProcessAsset
    AssessmentQuestionaire.belongsTo(models.AssessmentProcessAsset, {
      foreignKey: "assessmentProcessAssetId",
      as: "assets",
    });

    //// Relation to Questionaire Master (if exists)
    //AssessmentQuestionaire.belongsTo(models.Questionaire, {
    //    foreignKey: "questionnaireId",
    //    as: "questionaire",
    //});
  };

  return AssessmentQuestionaire;
};
