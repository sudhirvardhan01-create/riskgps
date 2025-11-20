// models/ReportsActive.js
module.exports = (sequelize, DataTypes) => {
  const ReportsActive = sequelize.define(
    "ReportsActive",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
      assessmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "assessment_id",
      },
      assessmentName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "assessment_name",
      },
      orgId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_id",
      },
      orgName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "org_id",
      },
      businessUnitId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "business_unit_-id",
      },
      businessUnit: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "business_unit",
      },
      businessProcessId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "business_process_id",
      },
      businessProcess: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "business_process",
      },
      assetId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "asset_id",
      },
      asset: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "asset",
      },
      assetCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "asset_category",
      },
      riskScenarioId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "risk_scenario_id",
      },
      riskScenario: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "risk_scenario",
      },
      riskScenarioCIAMapping: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: "risk_scenario_cia_mapping",
      },
      financial: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      financialMinRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "financial_min_range",
      },
      financialMaxRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "financial_max_range",
      },
      regulatory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      regulatoryMinRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "regulatory_min_range",
      },
      regulatoryMaxRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "financial_max_range",
      },
      reputational: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reputationalMinRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "reputational_min_range",
      },
      reputationalMaxRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "reputational_max_range",
      },
      operational: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      operationalMinRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "operational_min_range",
      },
      operationalMaxRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "operational_max_range",
      },
      mitreControlsAndScores: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "mitre_controls_and_scores",
      },
      assessmentCreatedTimestamp: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "assessment_created_timestamp",
      },
      assessmentUpdatedTimestamp: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "assessment_updated_timestamp",
      },
    },
    {
      tableName: "reports_active",
      timestamps: true,
    }
  );

  return ReportsActive;
};
