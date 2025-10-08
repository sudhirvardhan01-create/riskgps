"use strict";
const { ThreatBundle } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const threatBundle = [
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1535",
        mitreTechniqueName: "Unused/Unsupported Cloud Regions",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1562",
        mitreTechniqueName: "Impair Defenses",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1619",
        mitreTechniqueName: "Cloud Storage Object Discovery",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1580",
        mitreTechniqueName: "Cloud Infrastructure Discovery",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1555",
        mitreTechniqueName: "Credentials from Password Stores",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1552",
        mitreTechniqueName: "Unsecured Credentials",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1204",
        mitreTechniqueName: "User Execution",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1078",
        mitreTechniqueName: "Valid Accounts",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1136",
        mitreTechniqueName: "Create Account",
        status: "published",
      },
      {
        threatBundleName: "TOP10",
        mitreTechniqueId: "T1486",
        mitreTechniqueName: "Data Encrypted for Impact",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1535",
        mitreTechniqueName: "Unused/Unsupported Cloud Regions",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1562",
        mitreTechniqueName: "Impair Defenses",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1619",
        mitreTechniqueName: "Cloud Storage Object Discovery",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1580",
        mitreTechniqueName: "Cloud Infrastructure Discovery",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1555",
        mitreTechniqueName: "Credentials from Password Stores",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1552",
        mitreTechniqueName: "Unsecured Credentials",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1204",
        mitreTechniqueName: "User Execution",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1078",
        mitreTechniqueName: "Valid Accounts",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1136",
        mitreTechniqueName: "Create Account",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1486",
        mitreTechniqueName: "Data Encrypted for Impact",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1098",
        mitreTechniqueName: "Account Manipulation",
        status: "published",
      },
      {
        threatBundleName: "FSI",
        mitreTechniqueId: "T1110",
        mitreTechniqueName: "Brute Force",
        status: "published",
      },
    ];

    await safeSeed(
      ThreatBundle,
      threatBundle,
      "threatBundleName",
      "mitreTechniqueId"
    );
  },

  async down() {
    await ThreatBundle.destroy({ truncate: true, cascade: true });
  },
};
