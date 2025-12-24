"use strict";
const { Organization } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const organizations = [
      { name: "Demo Org 1", desc: "Demo Org 1", orgCode: "OR0001" },
      { name: "Default Org 2", desc: "Default Org 2", orgCode: "OR0002" },
      { name: "Default Org 3", desc: "Default Org 3", orgCode: "OR0003" },
      { name: "Default Org 4", desc: "Default Org 4", orgCode: "OR0004" },
    ];

    await safeSeed(Organization, organizations, "name");
  },

  async down() {
    await Organization.destroy({ truncate: true, cascade: true });
  },
};
