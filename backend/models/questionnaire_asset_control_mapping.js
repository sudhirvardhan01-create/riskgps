// const commonFields = require("./common_fields");
// const { GENERAL, ASSETS } = require("../constants/library");

// module.exports = (sequelize, DataTypes) => {
//   const LibraryQuestionnaireAssetControlMapping = sequelize.define(
//     "LibraryQuestionnaireAssetControlMapping",
//     {
//       questionnaireAssetControlId: {
//         type: DataTypes.UUID,
//         primaryKey: true,
//         defaultValue: DataTypes.UUIDV4,
//         field: "questionnaire_asset_control_id",
//       },
//       assetCategory: {
//         type: DataTypes.ENUM(...ASSETS.ASSET_CATEGORY),
//         allowNull: false,
//         field: "asset_category",
//       },
//       mitreControlId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         field: "mitre_control_id",
//       },
//       questionnaireId: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         field: "questionnaire_id",
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
//       tableName: "library_questionnaire_asset_control_mapping",
//       schema: "public",
//       timestamps: false,
//     }
//   );

//   LibraryQuestionnaireAssetControlMapping.associate = (models) => {
//     // Relation to LibraryQuestionnaire
//     LibraryQuestionnaireAssetControlMapping.belongsTo(
//       models.LibraryQuestionnaire,
//       {
//         foreignKey: "questionnaireId",
//         as: "questionnaire",
//       }
//     );
//   };

//   return LibraryQuestionnaireAssetControlMapping;
// };
