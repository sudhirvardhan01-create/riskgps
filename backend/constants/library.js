module.exports = {
  GENERAL: {
    ALLOWED_SORT_ORDER: ["ASC", "DESC"],
    STATUS_SUPPORTED_VALUES: ["draft", "published", "not_published"],
  },
  RISK_SCENARIO: {
      RISK_SCENARIO_SORT_FIELDS: [
      "created_at",
      "updated_at",
      "risk_scenario",
      "risk_description",
      "risk_statement",
      "risk_code"
    ],
  },
  PROCESS: {
    PROCESS_RELATIONSHIP_TYPES: ["follows", "precedes"],
    PROCESS_ALLOWED_SORT_FIELDS: [
      "created_at",
      "updated_at",
      "process_name",
      "process_description",
      "process_code"
    ],
  },
  ASSETS: {
    ASSET_ALLOWED_SORT_FILED: [
    "created_at",
    "updated_at",
    "application_name",
    "asset_code",
    ],
    HOSTING_SUPPORTED_VALUES: [
      "SaaS",
      "PaaS",
      "IaaS",
      "On-Premise"
    ],
    HOSTING_FACILITY_SUPPORTED_VALUES: [
      "Public Cloud",
      "Private Cloud",      
    ],
    CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES: [
      "AWS",
      "Azure",
      "Google Cloud Platform",
      "Other"
    ]
  }
};
