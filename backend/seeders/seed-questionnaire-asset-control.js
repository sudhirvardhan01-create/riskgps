// "use strict";
// const {
//   LibraryQuestionnaire,
//   LibraryQuestionnaireAssetControlMapping,
// } = require("../models");
// const { safeSeed } = require("../utils/seedHelper");

// module.exports = {
//   async up() {
//     const ques1 = await LibraryQuestionnaire.findOne({
//       where: {
//         question:
//           "Does this asset have account use policies configured that enforce controls like login attempt lockouts, login time restrictions, etc.?",
//       },
//     });

//     const ques2 = await LibraryQuestionnaire.findOne({
//       where: {
//         question:
//           "Is this asset integrated with your organization's identity provider? (i.e. AzureAD, Okta, Ping Identity, etc.)",
//       },
//     });

//     const ques3 = await LibraryQuestionnaire.findOne({
//       where: {
//         question:
//           "Is an endpoint detection response tool implemented on this system? (i.e. Crowdstrike, CarbonBlack, SentinelOne, etc.)",
//       },
//     });

//     const questionnaireAssetControls = [
//       {
//         assetCategory: "Windows",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "macOS",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "Linux",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "Office 365",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "Azure AD",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "Google Workspace",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "SaaS",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "IaaS",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "Network Devices",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "Containers",
//         mitreControlId: "M1036",
//         questionnaireId: ques1.questionnaireId,
//       },
//       {
//         assetCategory: "Windows",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "macOS",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "Linux",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "Office 365",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "Azure AD",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "Google Workspace",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "SaaS",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "IaaS",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "Network Devices",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "Containers",
//         mitreControlId: "M1015",
//         questionnaireId: ques2.questionnaireId,
//       },
//       {
//         assetCategory: "Windows",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "macOS",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "Linux",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "Office 365",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "Azure AD",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "Google Workspace",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "SaaS",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "IaaS",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "Network Devices",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//       {
//         assetCategory: "Containers",
//         mitreControlId: "M1049",
//         questionnaireId: ques3.questionnaireId,
//       },
//     ];

//     await safeSeed(
//       LibraryQuestionnaireAssetControlMapping,
//       questionnaireAssetControls,
//       "assetCategory",
//       "mitreControlId",
//       "questionnaireId"
//     );
//   },

//   async down() {
//     await LibraryQuestionnaireAssetControlMapping.destroy({
//       truncate: true,
//       cascade: true,
//     });
//   },
// };
