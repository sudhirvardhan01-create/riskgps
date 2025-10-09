"use strict";
const { Organization } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const organizations = [
      { name: "BluOcean", desc: "BluOcean", orgCode: "OR0001" },
      { name: "CDW", desc: "CDW", orgCode: "OR0002" },
      { name: "Affirm", desc: "Affirm", orgCode: "OR0003" },
    ];

    await safeSeed(Organization, organizations, "name");
  },

  async down() {
    await Organization.destroy({ truncate: true, cascade: true });
  },
};
