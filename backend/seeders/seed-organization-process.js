"use strict";
const {
  Organization,
  OrganizationBusinessUnit,
  OrganizationProcess,
} = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const org = await Organization.findOne({
      where: { name: "CDW" },
    });

    const org_bu = await OrganizationBusinessUnit.findOne({
      where: { name: "Retail Banking" },
    });

    const process = [
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "Account Management Process",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "Electronic Banking",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "ACH",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "Wire Transfer",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "ATM Management",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "Fraud Monitoring",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "KYC",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "Loan Origination",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "Underwriting",
      },
      {
        organizationId: org.organizationId,
        orgBusinessUnitId: org_bu.orgBusinessUnitId,
        name: "Loan Servicing",
      },
    ];

    await safeSeed(OrganizationProcess, process, "name");
  },

  async down() {
    await OrganizationProcess.destroy({ truncate: true, cascade: true });
  },
};
