"use strict";
const { Organization, OrganizationAsset } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const org = await Organization.findOne({
      where: { name: "CDW" },
    });

    const assets = [
      {
        organizationId: org.organizationId,
        name: "Customer Database",
        description:
          "Stores sensitive customer information, including personally identifiable information (PII), contact details, and account relationships.",
      },
      {
        organizationId: org.organizationId,
        name: "Banking Application",
        description:
          "The core software system used by customers and staff for daily banking operations, such as viewing balances, transferring funds, and managing accounts.",
      },
      {
        organizationId: org.organizationId,
        name: "Payment Rails",
        description:
          "The infrastructure and protocols (e.g., SWIFT, Fedwire, ACH network) used to facilitate and process external money transfers and payments.",
      },
      {
        organizationId: org.organizationId,
        name: "Fraud Application",
        description:
          "The dedicated system or software that monitors transactions and user behavior in real-time to detect, prevent, and manage financial fraud.",
      },
      {
        organizationId: org.organizationId,
        name: "Loan Application",
        description:
          "The system used to receive, process, and track customer applications for various types of loans and credit products.",
      },
      {
        organizationId: org.organizationId,
        name: "Underwriting Application",
        description:
          "Software utilized by analysts and decision-makers to assess the risk and eligibility of a loan or insurance application.",
      },
    ];

    await safeSeed(OrganizationAsset, assets, "name");
  },

  async down() {
    await OrganizationAsset.destroy({ truncate: true, cascade: true });
  },
};
