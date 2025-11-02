"use strict";
const { v4: uuidv4 } = require("uuid");
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
        order: 1,
      },
      {
        name: "Low",
        minRange: "100k",
        maxRange: "200k",
        color: "#3366CC",
        order: 2,
      },

      {
        name: "Moderate",
        minRange: "200k",
        maxRange: "500k",
        color: "#E3B52A",
        order: 3,
      },
      {
        name: "High",
        minRange: "500k",
        maxRange: "1000k",
        color: "#DA7706",
        order: 4,
      },
      {
        name: "Critical",
        minRange: "",
        maxRange: ">1000k",
        color: "#B90D0D",
        order: 5,
      },
    ];

    const allSeverityLevels = [];

    for (const taxonomy of taxonomies) {
      for (const level of defaultSeverities) {
        allSeverityLevels.push({
          ...level,
          taxonomyId: taxonomy.taxonomyId,
          severityId: uuidv4(),
        });
      }
    }

    await safeSeed(SeverityLevel, allSeverityLevels, "taxonomyId", "name");
  },

  async down() {
    await SeverityLevel.destroy({ truncate: true, cascade: true });
  },
};
