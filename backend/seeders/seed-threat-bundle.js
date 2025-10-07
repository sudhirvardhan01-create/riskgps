"use strict";
const { ThreatBundle } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const threatBundle = [
      {
        threatBundleName: "",
        mitreTechniqueId: "",
        mitreTechniqueName: "",
        status: "published",
      },
    ];

    await safeSeed(ThreatBundle, threatBundle);
  },

  async down() {
    await ThreatBundle.destroy({ truncate: true, cascade: true });
  },
};
