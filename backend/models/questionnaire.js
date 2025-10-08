const commonFields = require("./common_fields");
const { GENERAL } = require("../constants/library");

module.exports = (sequelize, DataTypes) => {
  const LibraryQuestionnaire = sequelize.define(
    "LibraryQuestionnaire",
    {
      questionnaireId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "questionnaire_id",
      },
      incrementalId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        field: "incremental_id",
      },
      questionCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "question_code",
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "question",
      },
      status: {
        type: DataTypes.ENUM(GENERAL.STATUS_SUPPORTED_VALUES),
        allowNull: false,
        defaultValue: "published",
        field: "status",
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, tenantId, etc.
    },
    {
      tableName: "library_questionnaire",
      schema: "public",
      timestamps: false,
    }
  );

  // LibraryQuestionnaire.associate = (models) => {
  //   // Relation to LibraryQuestionnaireAssetControlMapping
  //   LibraryQuestionnaire.hasMany(
  //     models.LibraryQuestionnaireAssetControlMapping,
  //     {
  //       foreignKey: "questionnaireId",
  //       as: "assetControlMappings",
  //     }
  //   );
  // };

  return LibraryQuestionnaire;
};
