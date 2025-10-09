"use strict";
const {
  sequelize,
  FrameWorkControl,
  MitreThreatControl,
  MitreFrameworkControlMappings,
} = require("../models");

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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],
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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],

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
        mitreControls: [
          "DS0009",
          "DS0012",
          "DS0017",
          "DS0020",
          "DS0022",
          "DS0030",
          "DS0034",
        ],

        status: "published",
        created_at: now,
        updated_at: now,
      },
    ];
    await sequelize.transaction(async (t) => {
      for (const frameworkControl of frameworkControls) {
        const allowedFrameworkdControlFields = [
          "frameWorkName",
          "frameWorkControlCategoryId",
          "frameWorkControlCategory",
          "frameWorkControlSubCategoryId",
          "frameWorkControlSubCategory",
          "status",
          "created_at",
          "updated_at",
        ];

        const frameworkControlData = {};
        for (const key of allowedFrameworkdControlFields) {
          if (frameworkControl[key] !== undefined)
            frameworkControlData[key] = frameworkControl[key];
        }
        const [createdFrameworkControl, created] =
          await FrameWorkControl.findOrCreate({
            where: {
              frameWorkName: frameworkControlData.frameWorkName,
              frameWorkControlCategoryId:
                frameworkControlData.frameWorkControlCategoryId,
              frameWorkControlSubCategoryId:
                frameworkControlData.frameWorkControlSubCategoryId,
            },
            defaults: frameworkControlData,
            transaction: t,
          });
        if (created) {
          const controls = await MitreThreatControl.findAll({
            where: { mitre_control_id: frameworkControl.mitreControls },
            attributes: ["id"],
            transaction: t,
          });

          const frameworkControlMitreControlMappings = controls.map((c) => ({
            framework_control_id: createdFrameworkControl.id,
            mitre_control_id: c.id,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          
          if (frameworkControlMitreControlMappings.length > 0) {
            await MitreFrameworkControlMappings.bulkCreate(
              frameworkControlMitreControlMappings,
              { transaction: t }
            );
            console.log("inserted framework control mapping")
          }
        }
      }
    });
  },

  async down() {
    await FrameWorkControl.destroy({ truncate: true, cascade: true });
  },
};
