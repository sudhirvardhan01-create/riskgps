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
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "DE.CM",
    "frameWorkControlCategory": "Continuous Monitoring",
    "frameWorkControlSubCategoryId": "DE.CM-09",
    "frameWorkControlSubCategory": "Computing hardware and software, runtime environments, and their data\nare monitored to find potentially adverse events",
    "mitreControls": [
      "DS0022",
      "DS0017",
      "DS0032",
      "DS0007",
      "DS0030",
      "DS0009",
      "M1049",
      "DS0011",
      "DS0012",
      "DS0016",
      "DS0027",
      "M1020",
      "M1016",
      "DS0001",
      "DS0013",
      "DS0008",
      "DS0004",
      "DS0037",
      "DS0020",
      "DS0034",
      "DS0014",
      "DS0023",
      "DS0003"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "DE.CM",
    "frameWorkControlCategory": "Continuous Monitoring",
    "frameWorkControlSubCategoryId": "DE.CM-01",
    "frameWorkControlSubCategory": "Networks and network services are monitored to find potentially adverse\nevents",
    "mitreControls": [
      "DS0029",
      "M1031",
      "DS0035",
      "DS0038",
      "DS0018",
      "DS0033"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.IR",
    "frameWorkControlCategory": "Technology Infrastructure Resilience",
    "frameWorkControlSubCategoryId": "PR.IR-01",
    "frameWorkControlSubCategory": "Networks and environments are protected from unauthorized logical access and usage",
    "mitreControls": [
      "M1037",
      "M1035"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.AA",
    "frameWorkControlCategory": "Identity Management, Authentication, and Access Control",
    "frameWorkControlSubCategoryId": "PR.AA-03",
    "frameWorkControlSubCategory": "Users, services, and hardware are authenticated",
    "mitreControls": [
      "M1027",
      "M1032",
      "M1036"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "DE.CM",
    "frameWorkControlCategory": "Continuous Monitoring",
    "frameWorkControlSubCategoryId": "DE.CM-06",
    "frameWorkControlSubCategory": "External service provider activities and services are monitored to find\npotentially adverse events",
    "mitreControls": [
      "DS0015",
      "DS0021",
      "DS0025",
      "DS0019",
      "DS0010"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "DE.CM",
    "frameWorkControlCategory": "Continuous Monitoring",
    "frameWorkControlSubCategoryId": "DE.CM-03",
    "frameWorkControlSubCategory": "Personnel activity and technology usage are monitored to find potentially\nadverse events",
    "mitreControls": [
      "M1040",
      "M1056",
      "DS0005",
      "DS0024",
      "DS0026",
      "DS0002",
      "DS0028",
      "DS0036",
      "DS0006"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.PS",
    "frameWorkControlCategory": "Platform Security",
    "frameWorkControlSubCategoryId": "PR.PS-05",
    "frameWorkControlSubCategory": "Installation and execution of unauthorized software are prevented",
    "mitreControls": [
      "M1038",
      "M1021",
      "M1048",
      "M1033"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.AT",
    "frameWorkControlCategory": "Awareness and Training",
    "frameWorkControlSubCategoryId": "PR.AT-01",
    "frameWorkControlSubCategory": "Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with cybersecurity risks in mind",
    "mitreControls": [
      "M1017"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "ID.RA",
    "frameWorkControlCategory": "Risk Assessment",
    "frameWorkControlSubCategoryId": "ID.RA-01",
    "frameWorkControlSubCategory": "Vulnerabilities in assets are identified, validated, and recorded",
    "mitreControls": [
      "M1047"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.PS",
    "frameWorkControlCategory": "Platform Security",
    "frameWorkControlSubCategoryId": "PR.PS-06",
    "frameWorkControlSubCategory": "Secure software development practices are integrated, and their performance is monitored throughout the software development life cycle",
    "mitreControls": [
      "M1045",
      "M1050",
      "M1044"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.PS",
    "frameWorkControlCategory": "Platform Security",
    "frameWorkControlSubCategoryId": "PR.PS-01",
    "frameWorkControlSubCategory": "Configuration management practices are established and applied",
    "mitreControls": [
      "M1054",
      "M1028"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.AA",
    "frameWorkControlCategory": "Identity Management, Authentication, and Access Control",
    "frameWorkControlSubCategoryId": "PR.AA-01",
    "frameWorkControlSubCategory": "Identities and credentials for authorized users, services, and hardware are managed by the organization",
    "mitreControls": [
      "M1018",
      "M1026"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "DE.AE",
    "frameWorkControlCategory": "Adverse Event Analysis",
    "frameWorkControlSubCategoryId": "DE.AE-07",
    "frameWorkControlSubCategory": "Cyber threat intelligence and other contextual information are integrated into the analysis",
    "mitreControls": [
      "M1019"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.AA",
    "frameWorkControlCategory": "Identity Management, Authentication, and Access Control",
    "frameWorkControlSubCategoryId": "PR.AA-05",
    "frameWorkControlSubCategory": "Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties",
    "mitreControls": [
      "M1024",
      "M1025",
      "M1022",
      "M1052",
      "M1039"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.AA",
    "frameWorkControlCategory": "Identity Management, Authentication, and Access Control",
    "frameWorkControlSubCategoryId": "PR.AA-02",
    "frameWorkControlSubCategory": "Identities are proofed and bound to credentials based on the context of\ninteractions",
    "mitreControls": [
      "M1043"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.PS",
    "frameWorkControlCategory": "Platform Security",
    "frameWorkControlSubCategoryId": "PR.PS-02",
    "frameWorkControlSubCategory": "Software is maintained, replaced, and removed commensurate with risk",
    "mitreControls": [
      "M1046",
      "M1042"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.AT",
    "frameWorkControlCategory": "Awareness and Training",
    "frameWorkControlSubCategoryId": "PR.AT-02",
    "frameWorkControlSubCategory": "Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind",
    "mitreControls": [
      "M1013"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "ID.AM",
    "frameWorkControlCategory": "Asset Management",
    "frameWorkControlSubCategoryId": "ID.AM-02",
    "frameWorkControlSubCategory": "Inventories of software, services, and systems managed by the organization are maintained",
    "mitreControls": [
      "M1051"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.IR",
    "frameWorkControlCategory": "Technology Infrastructure Resilience",
    "frameWorkControlSubCategoryId": "PR.IR-03",
    "frameWorkControlSubCategory": "Mechanisms are implemented to achieve resilience requirements in normal and adverse situations",
    "mitreControls": [
      "M1030"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.PS",
    "frameWorkControlCategory": "Platform Security",
    "frameWorkControlSubCategoryId": "PR.PS-03",
    "frameWorkControlSubCategory": "Hardware is maintained, replaced, and removed commensurate with risk",
    "mitreControls": [
      "M1034"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.DS",
    "frameWorkControlCategory": "Data Security",
    "frameWorkControlSubCategoryId": "PR.DS-11",
    "frameWorkControlSubCategory": "Backups of data are created, protected, maintained, and tested",
    "mitreControls": [
      "M1053"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.DS",
    "frameWorkControlCategory": "Data Security",
    "frameWorkControlSubCategoryId": "PR.DS-01",
    "frameWorkControlSubCategory": "The confidentiality, integrity, and availability of data-at-rest are protected",
    "mitreControls": [
      "M1041"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.AA",
    "frameWorkControlCategory": "Identity Management, Authentication, and Access Control",
    "frameWorkControlSubCategoryId": "PR.AA-04",
    "frameWorkControlSubCategory": "Identity assertions are protected, conveyed, and verified",
    "mitreControls": [
      "M1015"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.DS",
    "frameWorkControlCategory": "Data Security",
    "frameWorkControlSubCategoryId": "PR.DS-02",
    "frameWorkControlSubCategory": "The confidentiality, integrity, and availability of data-in-transit are protected",
    "mitreControls": [
      "M1057"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "PR.DS",
    "frameWorkControlCategory": "Data Security",
    "frameWorkControlSubCategoryId": "PR.DS-10",
    "frameWorkControlSubCategory": "The confidentiality, integrity, and availability of data-in-use are protected",
    "mitreControls": [
      "M1029"
    ],
    "status": "published"
  },
  {
    "frameWorkName": "NIST",
    "frameWorkControlCategoryId": "RS.MI",
    "frameWorkControlCategory": "Incident Mitigation",
    "frameWorkControlSubCategoryId": "RS.MI-01",
    "frameWorkControlSubCategory": "Incidents are contained",
    "mitreControls": [
      "M1055"
    ],
    "status": "published"
  }
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
