"use strict";
const { Organization, Taxonomy } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const org = await Organization.findOne({
      where: { name: "Default Org 1" },
    });

    const taxonomy = [
      {
        organizationId: org.organizationId,
        name: "Financial Impact",
        weightage: 10,
      },
      {
        organizationId: org.organizationId,
        name: "Regulatory",
        weightage: 20,
      },
      {
        organizationId: org.organizationId,
        name: "Reputational",
        weightage: 30,
      },
      {
        organizationId: org.organizationId,
        name: "Operational",
        weightage: 40,
      },
    ];

    await safeSeed(Taxonomy, taxonomy, "name");
  },

  async down() {
    await Taxonomy.destroy({ truncate: true, cascade: true });
  },
};
