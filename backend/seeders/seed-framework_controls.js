"use strict";
const { FrameWorkControl } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  async up() {
    const now = new Date();
    const frameworkControls = [
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "DE.CM",
        frameWorkControlCategory: "Continuous Monitoring",
        frameWorkControlSubCategoryId: "DE.CM-09",
        frameWorkControlSubCategory:
          "Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "DE.CM",
        frameWorkControlCategory: "Continuous Monitoring",
        frameWorkControlSubCategoryId: "DE.CM-06",
        frameWorkControlSubCategory:
          "External service provider activities and services are monitored to find potentially adverse events",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "DE.CM",
        frameWorkControlCategory: "Continuous Monitoring",
        frameWorkControlSubCategoryId: "DE.CM-03",
        frameWorkControlSubCategory:
          "Personnel activity and technology usage are monitored to find potentially adverse events",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "DE.CM",
        frameWorkControlCategory: "Continuous Monitoring",
        frameWorkControlSubCategoryId: "DE.CM-01",
        frameWorkControlSubCategory:
          "Networks and network services are monitored to find potentially adverse events",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "PR.AT",
        frameWorkControlCategory: "Awareness and Training",
        frameWorkControlSubCategoryId: "PR.AT-02",
        frameWorkControlSubCategory:
          "Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "PR.AT",
        frameWorkControlCategory: "Awareness and Training",
        frameWorkControlSubCategoryId: "PR.AT-01",
        frameWorkControlSubCategory:
          "Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with cybersecurity risks in mind",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "PR.AA",
        frameWorkControlCategory:
          "Identity Management, Authentication, and Access Control",
        frameWorkControlSubCategoryId: "PR.AA-01",
        frameWorkControlSubCategory:
          "Identities and credentials for authorized users, services, and hardware are managed by the organization",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "PR.AA",
        frameWorkControlCategory:
          "Identity Management, Authentication, and Access Control",
        frameWorkControlSubCategoryId: "PR.AA-03",
        frameWorkControlSubCategory:
          "Users, services, and hardware are authenticated",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "PR.IR",
        frameWorkControlCategory: "Technology Infrastructure Resilience",
        frameWorkControlSubCategoryId: "PR.IR-01",
        frameWorkControlSubCategory:
          "Networks and environments are protected from unauthorized logical access and usage",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "PR.PS",
        frameWorkControlCategory: "Platform Security",
        frameWorkControlSubCategoryId: "PR.PS-02",
        frameWorkControlSubCategory:
          "Software is maintained, replaced, and removed commensurate with risk",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "ID.RA",
        frameWorkControlCategory: "Risk Assessment",
        frameWorkControlSubCategoryId: "ID.RA-01",
        frameWorkControlSubCategory:
          "Vulnerabilities in assets are identified, validated, and recorded",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        frameWorkName: "NIST",
        frameWorkControlCategoryId: "PR.PS",
        frameWorkControlCategory: "Platform Security",
        frameWorkControlSubCategoryId: "PR.PS-01",
        frameWorkControlSubCategory:
          "Configuration management practices are established and applied",
        status: "published",
        created_at: now,
        updated_at: now,
      },
    ];

    await safeSeed(FrameWorkControl, frameworkControls);
  },

  async down() {
    await FrameWorkControl.destroy({ truncate: true, cascade: true });
  },
};
