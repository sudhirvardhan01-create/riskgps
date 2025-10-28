"use strict";

module.exports = {
  async up(queryInterface) {
    const {
      Process,
      MetaData,
      ProcessAttribute,
      Asset,
      AssetAttribute,
      AssetProcessMappings,
      RiskScenario,
      RiskScenarioAttribute,
      ProcessRiskScenarioMappings,
      sequelize,
    } = require("../models");

    const now = new Date();

    const seedAssets = [
      {
        application_name: "Customer Database",
        asset_category: "SaaS",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
        related_process: ["Account Management Process"],
      },
      {
        application_name: "Banking Application",
        asset_category: "Windows",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
        related_process: [
          "Account Management Process",
          "Electronic Banking",
          "Wire Transfer",
          "ATM Management",
        ],
      },
      {
        application_name: "Payment Rails",
        asset_category: "SaaS",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
        related_process: ["Electronic Banking", "ACH", "Wire Transfer"],
      },
      {
        application_name: "Fraud Application",
        asset_category: "Windows",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
        related_process: ["Fraud Monitoring"],
      },
      {
        application_name: "Loan Application",
        asset_category: "SaaS",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
        related_process: ["KYC", "Loan Origination", "Loan Servicing"],
      },
      {
        application_name: "Underwriting Application",
        asset_category: "Windows",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
        related_process: ["Loan Origination", "Underwriting"],
      },
    ];

    /* Application logic to seed Library Assets and 
    the related process to that asset
     */

    await sequelize.transaction(async (t) => {
      const assetProcessMappings = [];
      for (const asset of seedAssets) {
        const assetFieldMap = {
          application_name: "applicationName",
          asset_category: "assetCategory",
          asset_description: "assetDescription",
          status: "status",
          created_at: "created_at",
          updated_at: "updated_at",
        };

        const assetData = {};
        for (const [snakeKey, camelKey] of Object.entries(assetFieldMap)) {
          if (asset[snakeKey] !== undefined) {
            assetData[camelKey] = asset[snakeKey];
          }
        }
        const [createdAsset, created] = await Asset.findOrCreate({
          where: { applicationName: assetData.applicationName },
          defaults: assetData,
          transaction: t,
        });

        if (created) {
          // Loop over all related process names
          if (asset.related_process && Array.isArray(asset.related_process)) {
            for (const processName of asset.related_process) {
              const process = await Process.findOne({
                where: { processName: processName },
                transaction: t,
              });

              if (!process) {
                console.log(`Process not found: ${processName}`);
                continue;
              }

              assetProcessMappings.push({
                process_id: process.id,
                asset_id: createdAsset.id,
              });
            }
          }
        }
      }

      // Insert all process-asset mappings at once
      await AssetProcessMappings.bulkCreate(assetProcessMappings, {
        transaction: t,
      });

      console.log("seeded asset data");
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("library_assets", null, {});
    await queryInterface.bulkDelete(
      "library_attributes_asset_mapping",
      null,
      {}
    );
  },
};
