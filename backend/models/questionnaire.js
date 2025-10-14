const commonFields = require("./common_fields");
const { ASSETS, GENERAL } = require("../constants/library");

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
        type: DataTypes.TEXT,
        allowNull: false,
        field: "question",
      },
      assetCategory: {
        type: DataTypes.ARRAY(DataTypes.ENUM(...ASSETS.ASSET_CATEGORY)),
        allowNull: false,
        field: "asset_category",
      },
      mitreControlId: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        field: "mitre_control_id",
      },
      status: {
        type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES),
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

  // ✅ After create hook to generate questionCode
  LibraryQuestionnaire.afterCreate(async (instance, options) => {
    const paddedId = String(instance.incrementalId).padStart(4, "0");
    const code = `1${paddedId}`;
    await instance.update(
      { questionCode: code },
      { transaction: options.transaction }
    );
    // const newCode = `1000${instance.incrementalId}`;
    // if (instance.questionCode !== newCode) {
    //   instance.questionCode = newCode;
    //   await instance.save({ transaction: options.transaction });
    // }
  });

  return LibraryQuestionnaire;
};

// const commonFields = require("./common_fields");
// const { GENERAL } = require("../constants/library");

// module.exports = (sequelize, DataTypes) => {
//   const LibraryQuestionnaire = sequelize.define(
//     "LibraryQuestionnaire",
//     {
//       questionnaireId: {
//         type: DataTypes.UUID,
//         primaryKey: true,
//         defaultValue: DataTypes.UUIDV4,
//         field: "questionnaire_id",
//       },
//       incrementalId: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         unique: true,
//         field: "incremental_id",
//       },
//       questionCode: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         field: "question_code",
//       },
//       question: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         field: "question",
//       },
//       status: {
//         type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES),
//         allowNull: false,
//         defaultValue: "published",
//         field: "status",
//       },
//       ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, tenantId, etc.
//     },
//     {
//       tableName: "library_questionnaire",
//       schema: "public",
//       timestamps: false,
//     }
//   );

//   LibraryQuestionnaire.associate = (models) => {
//     // Relation to LibraryQuestionnaireAssetControlMapping
//     LibraryQuestionnaire.hasMany(
//       models.LibraryQuestionnaireAssetControlMapping,
//       {
//         foreignKey: "questionnaireId",
//         as: "assetControlMappings",
//       }
//     );
//   };

//   // ✅ After create hook to generate questionCode
//   LibraryQuestionnaire.afterCreate(async (instance, options) => {
//     const newCode = `1000${instance.incrementalId}`;
//     if (instance.questionCode !== newCode) {
//       instance.questionCode = newCode;
//       await instance.save({ transaction: options.transaction });
//     }
//   });

//   return LibraryQuestionnaire;
// };
