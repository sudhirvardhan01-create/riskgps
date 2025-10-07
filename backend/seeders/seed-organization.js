"use strict";
const { Organization } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const organizations = [
      { name: "BluOcean", desc: "BluOcean" },
      { name: "CDW", desc: "CDW" },
      { name: "Affirm", desc: "Affirm" },
    ];

    await safeSeed(Organization, organizations, "name");
  },

  async down() {
    await Organization.destroy({ truncate: true, cascade: true });
  },
};
