"use strict";
const { Organization, Taxonomy } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const org = await Organization.findOne({
      where: { name: "CDW" },
    });

    const taxonomy = [
      {
        organizationId: org.organizationId,
        name: "Financial Impact",
        weightage: 10,
        order: 1,
      },
      {
        organizationId: org.organizationId,
        name: "Regulatory",
        weightage: 20,
        order: 2,
      },
      {
        organizationId: org.organizationId,
        name: "Reputational",
        weightage: 30,
        order: 3,
      },
      {
        organizationId: org.organizationId,
        name: "Operational",
        weightage: 40,
        order: 4,
      },
    ];

    await safeSeed(Taxonomy, taxonomy, "name");
  },

  async down() {
    await Taxonomy.destroy({ truncate: true, cascade: true });
  },
};
