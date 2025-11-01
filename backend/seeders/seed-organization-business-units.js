"use strict";
const { Organization, OrganizationBusinessUnit } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const org = await Organization.findOne({
      where: { name: "Default Org 1" },
    });

    const units = [
      {
        organizationId: org.organizationId,
        name: "Retail Banking",
      },
      { organizationId: org.organizationId, name: "Loan Services" },
    ];

    await safeSeed(OrganizationBusinessUnit, units, "name");
  },

  async down() {
    await OrganizationBusinessUnit.destroy({ truncate: true, cascade: true });
  },
};
