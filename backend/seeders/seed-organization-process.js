"use strict";

module.exports = {
  async up(queryInterface) {
    const {
      Process,
      OrganizationProcess,
      MetaData,
      Organization,
      OrganizationProcessAttribute,
      OrganizationBusinessUnit,
      sequelize,
    } = require("../models");

    const now = new Date();

    const seeedProcesses = [
      {
        process_name: "Account Management Process",
        process_description:
          "Covers the creation, maintenance, and updating of customer account information, including personal details, account settings, and service preferences. Ensures data integrity, compliance, and customer access to account management services.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "Electronic Banking",
        process_description:
          "Provides customers with digital access to their accounts via online and mobile platforms, enabling balance inquiries, fund transfers, bill payments, and account services. Ensures availability, confidentiality, and integrity of digital transactions.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "ACH",
        process_description:
          "Handles Automated Clearing House (ACH) transactions, enabling batch electronic funds transfers such as payroll, vendor payments, and bill collections. Ensures timely settlement, accuracy, and compliance with regulatory standards.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "Wire Transfer",
        process_description:
          "Manages real-time electronic transfer of funds between banks and financial institutions, both domestic and international. Ensures high-value transactions are processed securely, accurately, and in compliance with financial regulations.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "ATM Management",
        process_description:
          "Oversees the operation of Automated Teller Machines, providing customers with cash withdrawal, deposit, balance inquiry, and fund transfer services. Ensures availability, security, and accuracy of ATM transactions.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "Fraud Monitoring",
        process_description:
          "Involves detection, analysis, and prevention of fraudulent activities across customer accounts and transactions. Uses monitoring tools and models to identify suspicious activity, mitigate financial losses, and maintain compliance.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "KYC",
        process_description:
          "Know Your Customer (KYC) process involves collecting, verifying, and maintaining customer identification data to comply with anti-money laundering (AML) and counter-terrorist financing (CTF) regulations. Ensures only verified customers gain access to financial products and services.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "Loan Origination",
        process_description:
          "Covers the end-to-end process of initiating and approving new customer loans, including application intake, eligibility checks, credit review, and approval. Ensures accurate assessments, compliance, and customer satisfaction.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "Underwriting",
        process_description:
          "Involves the use of models, data, and policies to evaluate customer risk and determine creditworthiness for lending decisions. Ensures consistent, fair, and compliant credit evaluations.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
      {
        process_name: "Loan Servicing",
        process_description:
          "Covers ongoing management of active loans, including repayment tracking, interest calculation, customer inquiries, and delinquency management. Ensures accuracy, compliance, and customer satisfaction throughout the loan lifecycle.",
        senior_executive__owner_name: "",
        enior_executive__owner_email: "",
        operations__owner_name: "",
        operations__owner_email: "",
        technology_owner_name: "",
        technology_owner_email: "",
        organizational_revenue_impact_percentage: null,
        financial_materiality: "",
        third_party_involvement: null,
        users_customers: "",
        regulatory_and_compliance: null,
        criticality_of_data_processed: "",
        data_processed: null,
        status: "published",
        created_at: now,
        updated_at: now,
        industry: ["Banking"],
      },
    ];

    const industryMetadata = await MetaData.findOne({
      where: { name: "Industry" },
    });

    if (!industryMetadata) throw new Error("Industry metadata not found");
    const supportedValues = industryMetadata.supported_values;

    const organization = await Organization.findOne({
      where: { name: "Demo Org 1" },
    });
    if (!organization || !organization.organizationId) {
      throw new Error("Organization not found");
    }
    const orgId = organization.organizationId;

    const businessUnit = await OrganizationBusinessUnit.findOne({
      where: { name: "Retail Banking" },
    });
    if (!businessUnit || !businessUnit.orgBusinessUnitId) {
      throw new Error("no business unit found ");
    }
    const buId = businessUnit.orgBusinessUnitId;

    /* Application logic to seed Library Process and Process Attributes  */
    await sequelize.transaction(async (t) => {
      const processAttributes = [];
      const fieldMap = {
        process_name: "processName",
        process_description: "processDescription",
        senior_executive__owner_name: "seniorExecutiveOwnerName",
        senior_executive__owner_email: "seniorExecutiveOwnerEmail",
        operations__owner_name: "operationsOwnerName",
        operations__owner_email: "operationsOwnerEmail",
        technology_owner_name: "technologyOwnerName",
        technology_owner_email: "technologyOwnerEmail",
        organizational_revenue_impact_percentage:
          "organizationalRevenueImpactPercentage",
        financial_materiality: "financialMateriality",
        third_party_involvement: "thirdPartyInvolvement",
        regulatory_and_compliance: "regulatoryAndCompliance",
        criticality_of_data_processed: "criticalityOfDataProcessed",
        data_processed: "dataProcessed",
        status: "status",
        created_at: "createdDate",
        updated_at: "modifiedDate",
      };
      for (const process of seeedProcesses) {
        // Map process snake_case keys → camelCase keys
        const processData = {};
        for (const [snakeKey, camelKey] of Object.entries(fieldMap)) {
          if (process[snakeKey] !== undefined) {
            processData[camelKey] = process[snakeKey];
          }
        }
        processData.organizationId = orgId;
        processData.orgBusinessUnitId = buId;
        const a = await Process.findOne({
          where: { processName: process.process_name },
        });

        if (a) {
          const p = a.toJSON();
          processData.parentObjectId = p.id ?? null;
        } else {
          processData.parentObjectId = null;
        }
        // Insert the process
        const [createdProcess, created] =
          await OrganizationProcess.findOrCreate({
            where: { processName: processData.processName },
            defaults: processData,
            transaction: t,
          });

        if (created) {
          const value = process.industry ?? [];
          const validIndustryValues = value.filter((v) =>
            supportedValues.includes(v)
          );

          if (validIndustryValues.length > 0) {
            processAttributes.push({
              processId: createdProcess.id,
              metaDataKeyId: industryMetadata.id,
              values: validIndustryValues,
            });
          } else {
            console.log(
              "invalid value for industry for process:",
              process.process_name
            );
          }
        }
      }
      if (processAttributes?.length > 0) {
        await OrganizationProcessAttribute.bulkCreate(processAttributes, {
          transaction: t,
        });
      }

      console.log("seeded process data");
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("organization_process", null, {});
    await queryInterface.bulkDelete(
      "organization_process_attribute_mapping",
      null,
      {}
    );
  },
};
