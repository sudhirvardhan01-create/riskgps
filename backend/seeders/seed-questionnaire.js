"use strict";
const { LibraryQuestionnaire } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const questionnaires = [
      {
        questionCode: "10001",
        question:
          "Does this asset have account use policies configured that enforce controls like login attempt lockouts, login time restrictions, etc.?",
      },
      {
        questionCode: "10002",
        question:
          "Is this asset integrated with your organization's identity provider? (i.e. AzureAD, Okta, Ping Identity, etc.)",
      },
      {
        questionCode: "10003",
        question:
          "Is an endpoint detection response tool implemented on this system? (i.e. Crowdstrike, CarbonBlack, SentinelOne, etc.)",
      },
    ];

    await safeSeed(LibraryQuestionnaire, questionnaires, "question");
  },

  async down() {
    await LibraryQuestionnaire.destroy({ truncate: true, cascade: true });
  },
};
