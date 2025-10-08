"use strict";
const { Organization, OrganizationRiskScenario } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const org = await Organization.findOne({
      where: { name: "CDW" },
    });

    const risk_scenarios = [
      {
        organizationId: org.organizationId,
        name: "Customer account data is exposed",
        riskCode: "1001",
        description:
          "Confidential customer account details, such as PII or financial information, are accessed by unauthorized parties.",
        statement: "Unauthorized access to customer account data occurs.",
      },
      {
        organizationId: org.organizationId,
        name: "Customer account data is corrupted and no longer accurate",
        riskCode: "1002",
        description:
          "Customer records are altered or damaged, leading to incorrect balances, history, or personal details.",
        statement:
          "Integrity of customer account data is compromised, leading to data corruption.",
      },
      {
        organizationId: org.organizationId,
        name: "Customer accounts cannot be managed for 1 week",
        riskCode: "1003",
        description:
          "Core systems for viewing, updating, or servicing customer accounts are unavailable for an extended period.",
        statement:
          "Loss of operational capability to manage customer accounts for an extended period (1 week).",
      },
      {
        organizationId: org.organizationId,
        name: "Electronic banking accounts are exposed",
        riskCode: "1004",
        description:
          "Sensitive data related to electronic banking user accounts (logins, transaction history) is made public or accessed illegally.",
        statement:
          "Exposure of electronic banking account credentials and data.",
      },
      {
        organizationId: org.organizationId,
        name: "Electronic banking accounts are corrupted and no longer accurate",
        riskCode: "1005",
        description:
          "Electronic banking system data, such as transaction logs or user settings, is damaged or inaccurate.",
        statement:
          "Corruption or inaccuracy of electronic banking account data.",
      },
      {
        organizationId: org.organizationId,
        name: "Electronic banking application cannot be accessed for 4 hours",
        riskCode: "1006",
        description:
          "The primary electronic banking platform (web/mobile) is unavailable to users for a short, but critical, duration.",
        statement:
          "Short-term denial of access to the electronic banking application (4 hours).",
      },
      {
        organizationId: org.organizationId,
        name: "Electronic banking application cannot be accessed for 1 day",
        riskCode: "1007",
        description:
          "The primary electronic banking platform (web/mobile) is unavailable to users for an entire business day.",
        statement:
          "Medium-term denial of access to the electronic banking application (1 day).",
      },
      {
        organizationId: org.organizationId,
        name: "Electronic banking application cannot be accessed for 1 week",
        riskCode: "1008",
        description:
          "The primary electronic banking platform (web/mobile) is unavailable to users for a prolonged period.",
        statement:
          "Long-term denial of access to the electronic banking application (1 week).",
      },
      {
        organizationId: org.organizationId,
        name: "Payments data is exposed",
        riskCode: "1009",
        description:
          "Sensitive payment-related information (e.g., source/destination accounts, amounts) is illegally accessed.",
        statement: "Unauthorized disclosure of sensitive payments data.",
      },
      {
        organizationId: org.organizationId,
        name: "Payment data is corrupted and no longer accurate",
        riskCode: "1010",
        description:
          "Data records for completed or pending payments are altered or inaccurate, leading to reconciliation issues.",
        statement:
          "Integrity failure in payment data, leading to corruption or inaccuracy.",
      },
      {
        organizationId: org.organizationId,
        name: "ACH payments cannot be completed for 4 hours",
        riskCode: "1011",
        description:
          "ACH processing systems fail or are interrupted, preventing the completion of automated clearing house payments for 4 hours.",
        statement:
          "Short-term failure of ACH payment processing capability (4 hours).",
      },
      {
        organizationId: org.organizationId,
        name: "ACH payments cannot be completed for 1 day",
        riskCode: "1012",
        description:
          "ACH processing systems fail or are interrupted, preventing the completion of payments for a full business day.",
        statement:
          "Medium-term failure of ACH payment processing capability (1 day).",
      },
      {
        organizationId: org.organizationId,
        name: "ACH payments cannot be completed for 1 week",
        riskCode: "1013",
        description:
          "ACH processing systems fail or are interrupted, preventing the completion of payments for a prolonged period.",
        statement:
          "Long-term failure of ACH payment processing capability (1 week).",
      },
      {
        organizationId: org.organizationId,
        name: "Wire transfer data is exposed",
        riskCode: "1014",
        description:
          "Confidential data associated with wire transfers (e.g., beneficiary details, instructions) is accessed by unauthorized parties.",
        statement: "Unauthorized disclosure of wire transfer data.",
      },
      {
        organizationId: org.organizationId,
        name: "Wire transfer is corrupted and no longer accurate",
        riskCode: "1015",
        description:
          "Wire transfer records are modified, leading to incorrect amounts or destinations.",
        statement: "Integrity failure in wire transfer data.",
      },
      {
        organizationId: org.organizationId,
        name: "Wire transfers cannot be completed for 4 hours",
        riskCode: "1016",
        description:
          "The system for initiating and executing wire transfers is unavailable for a short duration.",
        statement: "Short-term inability to complete wire transfers (4 hours).",
      },
      {
        organizationId: org.organizationId,
        name: "Wire transfers cannot be completed for 1 day",
        riskCode: "1017",
        description:
          "The system for initiating and executing wire transfers is unavailable for a full business day.",
        statement: "Medium-term inability to complete wire transfers (1 day).",
      },
      {
        organizationId: org.organizationId,
        name: "Wire transfers cannot be completed for 1 week",
        riskCode: "1018",
        description:
          "The system for initiating and executing wire transfers is unavailable for a prolonged period.",
        statement: "Long-term inability to complete wire transfers (1 week).",
      },
      {
        organizationId: org.organizationId,
        name: "ATM data is exposed",
        riskCode: "1019",
        description:
          "Sensitive data processed or stored by ATM systems (e.g., transaction logs, card details) is compromised.",
        statement: "Unauthorized disclosure of sensitive ATM system data.",
      },
      {
        organizationId: org.organizationId,
        name: "ATM data is corrupted and no longer accurate",
        riskCode: "1020",
        description:
          "ATM transaction records or system logs are damaged or inaccurate.",
        statement: "Integrity failure in ATM data, leading to corruption.",
      },
      {
        organizationId: org.organizationId,
        name: "ATMs are not available for 1 day",
        riskCode: "1021",
        description:
          "A significant portion of the ATM network is out of service for 24 hours.",
        statement: "Denial of service for ATMs for 1 day.",
      },
      {
        organizationId: org.organizationId,
        name: "ATMs are not available for 1 week",
        riskCode: "1022",
        description:
          "A significant portion of the ATM network is out of service for seven days.",
        statement: "Extended denial of service for ATMs for 1 week.",
      },
      {
        organizationId: org.organizationId,
        name: "Fraud monitoring is data exposed",

        description:
          "Confidential fraud intelligence, alert rules, or case data from the monitoring system is illegally accessed.",
        statement: "Exposure of sensitive fraud monitoring system data.",
      },
      {
        organizationId: org.organizationId,
        name: "Fraud monitoring is not available for 1 week",
        description:
          "The core system responsible for monitoring and alerting on fraudulent activities is non-operational for an extended period.",
        statement: "Loss of capability to perform fraud monitoring for 1 week.",
      },
      {
        organizationId: org.organizationId,
        name: "KYC data is exposed",

        description:
          "Confidential Know Your Customer (KYC) documentation, such as identity proofs and verification records, is accessed by unauthorized parties.",
        statement: "Unauthorized disclosure of sensitive KYC data.",
      },
      {
        organizationId: org.organizationId,
        name: "KYC data is corrupted and no longer accurate",

        description:
          "KYC records are damaged or inaccurately reflect a customer's verified identity.",
        statement:
          "Integrity failure in KYC data, leading to corruption or inaccuracy.",
      },
      {
        organizationId: org.organizationId,
        name: "KYC is not able to process new applications for 1 week",
        description:
          "The system used to verify and onboard new customers via KYC processes is unavailable for one week, halting new business.",
        statement:
          "Inability to process new customer applications due to KYC system unavailability for 1 week.",
      },
    ];

    await safeSeed(OrganizationRiskScenario, risk_scenarios, "name");
  },

  async down() {
    await OrganizationRiskScenario.destroy({ truncate: true, cascade: true });
  },
};
