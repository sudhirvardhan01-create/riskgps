"use strict";
const { LibraryQuestionnaireAssetControlMapping } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const questionnaireAssetControls = [
      {
        question:
          "Does this asset have account use policies configured that enforce controls like login attempt lockouts, login time restrictions, etc.?",
      },
      {
        question:
          "Is this asset integrated with your organization's identity provider? (i.e. AzureAD, Okta, Ping Identity, etc.)",
      },
      {
        question:
          "Is an endpoint detection response tool implemented on this system? (i.e. Crowdstrike, CarbonBlack, SentinelOne, etc.)",
      },
    ];

    await safeSeed(
      LibraryQuestionnaireAssetControlMapping,
      questionnaireAssetControls,
      "question"
    );
  },

  async down() {
    await LibraryQuestionnaireAssetControlMapping.destroy({
      truncate: true,
      cascade: true,
    });
  },
};
