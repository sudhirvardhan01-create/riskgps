"use strict";
const { Taxonomy, SeverityLevel } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const taxonomies = await Taxonomy.findAll();

    if (!taxonomies || taxonomies.length === 0) {
      console.warn("⚠️ No taxonomies found — skipping severity_level seed.");
      return;
    }

    const defaultSeverities = [
      {
        name: "Very Low",
        minRange: "50k",
        maxRange: "100k",
        color: "#3BB966",
      },
      {
        name: "Low",
        minRange: "100k",
        maxRange: "200k",
        color: "#3366CC",
      },

      {
        name: "Moderate",
        minRange: "200k",
        maxRange: "500k",
        color: "#E3B52A",
      },
      {
        name: "High",
        minRange: "500k",
        maxRange: "1000k",
        color: "#DA7706",
      },
      {
        name: "Critical",
        minRange: "",
        maxRange: ">1000k",
        color: "#B90D0D",
      },
    ];

    const allSeverityLevels = [];

    for (const taxonomy of taxonomies) {
      for (const level of defaultSeverities) {
        allSeverityLevels.push({
          ...level,
          taxonomyId: taxonomy.taxonomyId,
        });
      }
    }

    await safeSeed(SeverityLevel, allSeverityLevels, "taxonomyId", "name");
  },

  async down() {
    await SeverityLevel.destroy({ truncate: true, cascade: true });
  },
};
