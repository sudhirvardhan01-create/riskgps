module.exports = {
  GENERAL: {
    ALLOWED_SORT_ORDER: ["ASC", "DESC"],
    STATUS_SUPPORTED_VALUES: ["draft", "published", "not_published"],
    CIA_MAPPING_VALUES: ["C", "I", "A"],
    // CIA_MAP: {
    //   C: "Confidentiality",
    //   I: "Integrity",
    //   A: "availability",
    //   Confidentiality: "C",
    //   integrity: "I",
    //   availability: "A",
    // },
    DATA_TYPES: ["PHI", "PII", "PCI"],
  },
  RISK_SCENARIO: {
    RISK_SCENARIO_SORT_FIELDS: [
      "id",
      "created_at",
      "updated_at",
      "riskScenario",
      "riskDescription",
      "riskStatement",
      "riskCode",
    ],
  },
  PROCESS: {
    PROCESS_RELATIONSHIP_TYPES: ["follows", "precedes"],
    PROCESS_ALLOWED_SORT_FIELDS: [
      "id",
      "created_at",
      "updated_at",
      "processName",
      "processDescription",
      "processCode",
    ],
  },
  ASSETS: {
    ASSET_CATEGORY: [
      "Windows",
      "macOS",
      "Linux",
      "Office 365",
      "Azure AD",
      "Google Workspace",
      "SaaS",
      "IaaS",
      "Network Devices",
      "Containers",
      "Android",
      "iOS",
    ],
    ASSET_ALLOWED_SORT_FILED: [
      "id",
      "created_at",
      "updated_at",
      "applicationName",
      "assetCode",
    ],
    HOSTING_SUPPORTED_VALUES: ["SaaS", "PaaS", "IaaS", "On-Premise"],
    HOSTING_FACILITY_SUPPORTED_VALUES: ["Public Cloud", "Private Cloud", "N/A"],
    CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES: [
      "AWS",
      "Azure",
      "Google Cloud Platform",
      "Other",
    ],
  },
  META_DATA: {
    META_DATA_ALLOWED_SORT_FIELDS: ["id", "created_at", "updated_at", "name"],
  },
  MITRE_THREAT_CONTROL: {
    ALLOWED_SORT_FILED: [
      "id",
      "created_at",
      "updated_at",
      "mitreTechniqueName",
    ],
  },

  MITRE_CONTROLS: {
    ALLOWED_SORT_FILED: [
      "id",
      "created_at",
      "updated_at",
      "mitreControlId",
      "mitreControlName",
    ],
  },
  FRAMEWORK_CONTROLS: {
    ALLOWED_SORT_FILED: [
      "id",
      "created_at",
      "updated_at",
      "frameWorkControlCategoryId",
      "frameWorkControlCategory",
      "frameWorkControlDescription",
    ],
  },
  QUESTIONNAIRE: {
    ALLOWED_SORT_FIELD: ["questionCode", "createdDate", "modifiedDate"],
  },
};
