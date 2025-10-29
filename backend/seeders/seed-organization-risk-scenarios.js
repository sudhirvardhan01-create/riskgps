"use strict";

const riskScenario = require("../models/riskScenario");

module.exports = {
  async up(queryInterface) {
    const {
      OrganizationProcess,
      Organization,
      MetaData,
      OrganizationRiskScenario,
      OrganizationRiskScenarioAttribute,
      OrganizationProcessRiskScenarioMappings,
      sequelize,
    } = require("../models");

    const now = new Date();

    const seedRiskScenarios = [
      {
        risk_scenario: "Customer account data is exposed",
        risk_description: "",
        risk_statement:
          "Unauthorized disclosure of customer account data could compromise confidentiality.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Account Management Process"],
        industry: ["Banking"],
      },
      {
        risk_scenario:
          "Customer account data is corrupted and no longer accurate.",
        risk_description: "",
        risk_statement: "Integrity of customer account data is compromised.",
        cia_mapping: ["I"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Account Management Process"],
        industry: ["Healthcare", "Banking"],
      },
      {
        risk_scenario: "Customer accounts cannot be managed for 1 week.",
        risk_description: "",
        risk_statement:
          "Prolonged unavailability of customer account management services.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Account Management Process"],
        industry: ["Government"],
      },
      {
        risk_scenario: "Electronic banking accounts are exposed.",
        risk_description: "",
        risk_statement:
          "Unauthorized disclosure of electronic banking account data.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Electronic Banking"],
        industry: ["Banking", "Government"],
      },
      {
        risk_scenario:
          "Electronic banking accounts are corrupted and no longer accurate.",
        risk_description: "",
        risk_statement:
          "Integrity of electronic banking accounts is compromised.",
        cia_mapping: ["I"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Electronic Banking"],
        industry: ["Healthcare"],
      },
      {
        risk_scenario:
          "Electronic banking applicaton cannot be accessed for 4 hours.",
        risk_description: "",
        risk_statement: "Short-term unavailability of online banking services.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Electronic Banking"],
        industry: ["Healthcare", "Banking", "Government"],
      },
      {
        risk_scenario:
          "Electronic banking applicaton cannot be accessed for 1 day.",
        risk_description: "",
        risk_statement: "One-day outage of online banking platform.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Electronic Banking"],
        industry: ["Government"],
      },
      {
        risk_scenario:
          "Electronic banking applicaton cannot be accessed for 1 week.",
        risk_description: "",
        risk_statement: "Prolonged outage of online banking platform.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Electronic Banking"],
        industry: ["Banking"],
      },
      {
        risk_scenario: "Payments data is exposed.",
        risk_description: "",
        risk_statement: "Unauthorized disclosure of payments data.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ACH"],
        industry: ["Healthcare", "Banking"],
      },
      {
        risk_scenario: "Payment data is corrupted and no longer accurate.",
        risk_description: "",
        risk_statement: "Integrity of payment transaction data is compromised.",
        cia_mapping: ["I"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ACH"],
        industry: ["Banking"],
      },
      {
        risk_scenario: "ACH payments cannot be completed for 4 hours.",
        risk_description: "",
        risk_statement: "Temporary outage of ACH payment processing.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ACH"],
        industry: ["Government", "Banking"],
      },
      {
        risk_scenario: "ACH payments cannot be completed for 1 day.",
        risk_description: "",
        risk_statement: "One-day outage of ACH payment processing.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ACH"],
        industry: ["Healthcare"],
      },
      {
        risk_scenario: "ACH payments cannot be completed for 1 week.",
        risk_description: "",
        risk_statement: "Prolonged outage of ACH payment processing.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ACH"],
        industry: ["Healthcare", "Government"],
      },
      {
        risk_scenario: "Wire transfer data is exposed.",
        risk_description: "",
        risk_statement: "Unauthorized disclosure of wire transfer data.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Wire Transfer"],
        industry: ["Banking"],
      },
      {
        risk_scenario: "Wire transfer is corrupted and no longer accurate.",
        risk_description: "",
        risk_statement: "Integrity of wire transfer data is compromised.",
        cia_mapping: ["I"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Wire Transfer"],
        industry: ["Healthcare", "Banking"],
      },
      {
        risk_scenario: "Wire transfers cannot be completed for 4 hours.",
        risk_description: "",
        risk_statement: "Temporary outage of wire transfer processing.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Wire Transfer"],
        industry: ["Government"],
      },
      {
        risk_scenario: "Wire transfers cannot be completed for 1 day.",
        risk_description: "",
        risk_statement: "One-day outage of wire transfer processing.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Wire Transfer"],
        industry: ["Healthcare", "Government"],
      },
      {
        risk_scenario: "Wire transfers cannot be completed for 1 week.",
        risk_description: "",
        risk_statement: "Extended outage of wire transfer processing.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Wire Transfer"],
        industry: ["Banking"],
      },
      {
        risk_scenario: "ATM data is exposed",
        risk_description: "",
        risk_statement: "Unauthorized disclosure of ATM transaction data.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ATM Management"],
        industry: ["Healthcare", "Banking", "Government"],
      },
      {
        risk_scenario: "ATM data is corrupted and no longer accurate.",
        risk_description: "",
        risk_statement: "Integrity of ATM transaction data is compromised.",
        cia_mapping: ["I"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ATM Management"],
        industry: ["Healthcare"],
      },
      {
        risk_scenario: "ATMs are not available for 1 day.",
        risk_description: "",
        risk_statement: "Outage of ATM services for 24 hours.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ATM Management"],
        industry: ["Banking", "Government"],
      },
      {
        risk_scenario: "ATMs are not available for 1 week.",
        risk_description: "",
        risk_statement: "Prolonged outage of ATM services.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["ATM Management"],
        industry: ["Government"],
      },
      {
        risk_scenario: "Fraud monitoring data is exposed.",
        risk_description: "",
        risk_statement: "Unauthorized disclosure of fraud monitoring data.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Fraud Monitoring"],
        industry: ["Banking"],
      },
      {
        risk_scenario: "Fraud monitoring is not available for 1 week.",
        risk_description: "",
        risk_statement: "Extended unavailability of fraud monitoring systems.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Fraud Monitoring"],
        industry: ["Healthcare", "Government"],
      },
      {
        risk_scenario: "KYC data is exposed.",
        risk_description: "",
        risk_statement: "Unauthorized disclosure of customer KYC data.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["KYC"],
        industry: ["Banking", "Government"],
      },
      {
        risk_scenario: "KYC data is corrupted and no longer accurate.",
        risk_description: "",
        risk_statement: "Integrity of KYC records is compromised.",
        cia_mapping: ["I"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["KYC"],
        industry: ["Healthcare"],
      },
      {
        risk_scenario:
          "KYC is not able to process new applications for 1 week.",
        risk_description: "",
        risk_statement: "KYC services unavailable for one week.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["KYC"],
        industry: ["Healthcare", "Banking"],
      },
      {
        risk_scenario: "Customer loan data is exposed.",
        risk_description: "",
        risk_statement: "Unauthorized disclosure of customer loan data.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Loan Origination"],
        industry: ["Banking"],
      },
      {
        risk_scenario: "Loans cannot be originated for 4 hours.",
        risk_description: "",
        risk_statement: "Temporary disruption in loan origination.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Loan Origination"],
        industry: ["Healthcare"],
      },
      {
        risk_scenario: "Loans cannot be originated for 1 day.",
        risk_description: "",
        risk_statement: "One-day outage in loan origination.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Loan Origination"],
        industry: ["Healthcare", "Government"],
      },
      {
        risk_scenario: "Loans cannot be originated for 1 week.",
        risk_description: "",
        risk_statement: "Prolonged disruption in loan origination.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Loan Origination"],
        industry: ["Banking"],
      },
      {
        risk_scenario: "Customer underwriting data is exposed.",
        risk_description: "",
        risk_statement: "Unauthorized disclosure of underwriting data.",
        cia_mapping: ["C"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Underwriting"],
        industry: ["Healthcare", "Banking"],
      },
      {
        risk_scenario:
          "Underwriting models are corrupted and no longer accurate.",
        risk_description: "",
        risk_statement: "Integrity of underwriting data is compromised.",
        cia_mapping: ["I"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Underwriting"],
        industry: ["Government"],
      },
      {
        risk_scenario: "Underwriting cannot take place for 1 week.",
        risk_description: "",
        risk_statement: "Prolonged disruption of underwriting processes.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Underwriting"],
        industry: ["Healthcare", "Banking"],
      },
      {
        risk_scenario:
          "Customer loan data is corrupted and no longer accurate.",
        risk_description: "",
        risk_statement: "Integrity of customer loan records is compromised.",
        cia_mapping: ["I"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Loan Servicing"],
        industry: ["Government"],
      },
      {
        risk_scenario: "Loans cannot be serviced for 1 day.",
        risk_description: "",
        risk_statement: "One-day disruption in loan servicing.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Loan Servicing"],
        industry: ["Healthcare", "Banking"],
      },
      {
        risk_scenario: "Loans cannot be serviced for 1 week.",
        risk_description: "",
        risk_statement: "Prolonged disruption in loan servicing.",
        cia_mapping: ["A"],
        status: "published",
        risk_field_1: "",
        risk_field_2: "",
        created_at: now,
        updated_at: now,
        related_process: ["Loan Servicing"],
        industry: ["Banking", "Government"],
      },
    ];

    const industryMetadata = await MetaData.findOne({
      where: { name: "Industry" },
    });

    if (!industryMetadata) throw new Error("Industry metadata not found");
    const supportedValues = industryMetadata.supported_values;

    const organization = await Organization.findOne({
      where: { name: "CDW" },
    });
    if (!organization || !organization.organizationId) {
      throw new Error("Organization not found");
    }
    const orgId = organization.organizationId;

    /* Application logic to seed Library Risk Scenarios, 
    risk Scenarios Related processes and 
    risk scenario attributes */

    await sequelize.transaction(async (t) => {
      const riskScenarioAttributes = [];
      const processRiskScenarioMappings = [];
      for (const risk of seedRiskScenarios) {
        const riskData = {};
        riskData["riskScenario"] = risk["risk_scenario"];
        riskData["riskDescription"] = risk["risk_description"];
        riskData["riskStatement"] = risk["risk_statement"];
        riskData["ciaMapping"] = risk["cia_mapping"];
        riskData["status"] = risk["status"];
        riskData["riskField1"] = risk["risk_field_1"];
        riskData["riskField2"] = risk["risk_field_2"];
        riskData["organizationId"] = orgId;

        const [createdRisk, created] = await OrganizationRiskScenario.findOrCreate({
          where: { riskScenario: riskData.riskScenario },
          defaults: riskData,
          transaction: t,
        });

        if (created) {
          console.log(
            "created name, id",
            createdRisk.id,
            createdRisk.riskScenario
          );
          // Loop over all related process names
          if (risk.related_process && Array.isArray(risk.related_process)) {
            for (const processName of risk.related_process) {
              console.log("related process", processName);
              const process = await OrganizationProcess.findOne({
                where: { processName: processName },
                transaction: t,
              });

              if (!process) {
                console.log(`Process not found: ${processName}`);
                continue;
              }

              processRiskScenarioMappings.push({
                processId: process.id,
                riskScenarioId: createdRisk.id,
              });
            }
          }

          if (risk.industry && Array.isArray(risk.industry)) {
            const value = risk.industry ?? [];
            const validIndustryValues = value.filter((v) =>
              supportedValues.includes(v)
            );

            if (validIndustryValues.length > 0) {
              riskScenarioAttributes.push({
                riskScenarioId: createdRisk.id,
                metaDataKeyId: industryMetadata.id,
                values: validIndustryValues,
              });
            } else {
              console.log(
                "invalid value for industry for risk scenario:",
                risk.risk_scenario
              );
            }
          }
        }
      }
      // Insert all process-risk mappings at once
      await OrganizationProcessRiskScenarioMappings.bulkCreate(
        processRiskScenarioMappings,
        { transaction: t }
      );

      // Insert all risk scenario attributes at once
      await OrganizationRiskScenarioAttribute.bulkCreate(riskScenarioAttributes, {
        transaction: t,
      });
      console.log("seeded risk scenario data");
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("organization_risk_scenario", null, {});
    await queryInterface.bulkDelete(
      "organization_process_risk_scenario_mapping",
      null,
      {}
    );
    await queryInterface.bulkDelete(
      "organization_risk_scenario_attribute_mapping",
      null,
      {}
    );
  },
};
