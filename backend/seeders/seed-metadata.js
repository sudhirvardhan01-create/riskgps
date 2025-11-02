"use strict";

module.exports = {
  async up(queryInterface) {
    const { sequelize, MetaData } = require("../models");

    const now = new Date();

    const seedMetadatas = [
      {
        name: "Asset Category",
        label: "Asset Category",
        input_type: "select",
        supported_values: [
          "Windows",
          "Linux",
          "Office 365",
          "Azure AD",
          "Google Workspace",
          "SaaS",
          "IaaS",
          "Network Devices",
          "Containers",
          "Android",
          "iOS",
          "macOS",
        ],
        applies_to: ["all"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Industry",
        label: "Industry",
        input_type: "text",
        supported_values: [
          "Banking",
          "Finance",
          "Technology",
          "Retail",
          "Healthcare",
          "Manufacturing",
        ],
        applies_to: ["all"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "CIA Mapping",
        label: "CIA Mapping",
        input_type: "text",
        supported_values: ["C", "I", "A"],
        applies_to: ["risk_scenario", "threat"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Control Framework",
        label: "Control Framework",
        input_type: "text",
        supported_values: ["NIST", "ATLAS", "CRI"],
        applies_to: ["control"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Threat Bundle",
        label: "Threat Bundle",
        input_type: "text",
        supported_values: ["TOP10", "TOPFSI"],
        applies_to: ["threat"],
        description: "",
        created_at: now,
        updated_at: now,
      },
    ];

    await sequelize.transaction(async (t) => {
      await MetaData.bulkCreate(seedMetadatas, {
        updateOnDuplicate: [
          "input_type",
          "supported_values",
          "applies_to",
          "description",
          "updated_at",
        ],
        transaction: t,
      });
    });
    console.log("seeded meta data");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("library_meta_datas", null, {});
  },
};
