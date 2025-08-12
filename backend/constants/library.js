module.exports = {
  STATUS_SUPPORTED_VALUES: ["draft", "published", "not_published"],
  ALLOWED_SORT_ORDER: ["ASC", "DESC"],
  RISK_SCENARIO_SORT_FIELDS: [
    "created_at",
    "updated_at",
    "risk_scenario",
    "risk_description",
    "risk_statement",
    "risk_code"
  ],
  PROCESS_RELATIONSHIP_TYPES: ["follows", "precedes"],
  PROCESS_ALLOWED_SORT_FIELDS: [
    "created_at",
    "updated_at",
    "process_name",
    "process_description",
    "process_code"
  ],
};
