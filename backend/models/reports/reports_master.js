module.exports = (sequelize, DataTypes) => {
  const ReportsMaster = sequelize.define(
    "ReportsMaster",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },

      // Basic assessment info
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

      orgId: { type: DataTypes.UUID, allowNull: true, field: "org_id" },
      orgName: { type: DataTypes.STRING, allowNull: true, field: "org_name" },
      organizationRiskAppetiteInMillionDollar: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "organization_risk_appetite_in_million_dollar",
      },
      businessUnitId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "business_unit_id",
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

      assetId: { type: DataTypes.UUID, allowNull: true, field: "asset_id" },
      asset: { type: DataTypes.STRING, allowNull: true, field: "asset" },
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

      // Financial / Regulatory / Reputational / Operational
      financial: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "financial",
      },
      financialWeightage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "financial_weightage",
      },
      financialMinRange: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "financial_min_range",
      },
      financialMaxRange: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "financial_max_range",
      },

      regulatory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "regulatory",
      },
      regulatoryWeightage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "regulatory_weightage",
      },
      regulatoryMinRange: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "regulatory_min_range",
      },
      regulatoryMaxRange: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "regulatory_max_range",
      },

      reputational: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "reputational",
      },
      reputationalWeightage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "reputational_weightage",
      },
      reputationalMinRange: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "reputational_min_range",
      },
      reputationalMaxRange: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "reputational_max_range",
      },

      operational: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "operational",
      },
      operationalWeightage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "operational_weightage",
      },
      operationalMinRange: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "operational_min_range",
      },
      operationalMaxRange: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "operational_max_range",
      },

      // Mitre
      mitreControlsAndScores: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "mitre_controls_and_scores",
      },

      // CIA Scores
      aggAssetCScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_c_score",
      },
      aggAssetIScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_i_score",
      },
      aggAssetAScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_a_score",
      },
      aggAssetCIAOverallScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_cia_overall_score",
      },

      // Strength
      aggAssetControlStrengthProcessToAsset: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_control_strength_process_to_asset",
      },
      aggBuBpControlStrengthRisksToImpacts: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_control_strength_risks_to_impacts",
      },

      // Impact values
      financialDollarImpactUsingQualitativeScoreAndAligningWithERMRiskModelRisksToImpacts:
        {
          type: DataTypes.FLOAT,
          allowNull: true,
          field: "financial_dollar_impact_qualitative_erm_risks_to_impacts",
        },

      financialImpactValueInMillionDollar: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "financial_impact_value_in_million_dollar",
      },
      regulatoryImpactValueInMillionDollar: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "regulatory_impact_value_in_million_dollar",
      },
      reputationalImpactValueInMillionDollar: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "reputational_impact_value_in_million_dollar",
      },
      operationalImpactValueInMillionDollar: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "operational_impact_value_in_million_dollar",
      },

      inherentFinancialExposureRisksToImpacts: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "inherent_financial_exposure_risks_to_impacts",
      },
      overallImpactScoreRisksToImpacts: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "overall_impact_score_risks_to_impacts",
      },
      // ERM Dashboard
      inherentRiskScoreRiskDashboardERMTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "inherent_risk_score_risk_dashboard_erm_tab",
      },
      inherentRiskLevelRiskDashboardERMTab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "inherent_risk_level_risk_dashboard_erm_tab",
      },
      controlStrengthRiskDashboardERMTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "control_strength_risk_dashboard_erm_tab",
      },
      residualRiskScoreRiskDashboardERMTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "residual_risk_score_risk_dashboard_erm_tab",
      },
      residualRiskLevelRiskDashboardERMTab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "residual_risk_level_risk_dashboard_erm_tab",
      },
      inherentImpactInMillionDollarsRiskDashboardERMTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "inherent_impact_in_million_dollars_risk_dashboard_erm_tab",
      },
      residualImpactInMillionDollarsRiskDashboardERMTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "residual_impact_in_million_dollars_risk_dashboard_erm_tab",
      },
      targetImpactInMillionDollarsRiskDashboardERMTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "target_impact_in_million_dollars_risk_dashboard_erm_tab",
      },

      // Business Dashboard
      aggBuBpInherentRiskScoreRiskDashboardBusinessTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_inherent_risk_score_risk_dashboard_business_tab",
      },
      aggBuBpInherentRiskLevelRiskDashboardBusinessTab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "agg_bu_bp_inherent_risk_level_risk_dashboard_business_tab",
      },
      aggBuBpControlStrengthRiskDashboardBusinessTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_control_strength_risk_dashboard_business_tab",
      },
      aggBuBpResidualRiskScoreRiskDashboardBusinessTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_residual_risk_score_risk_dashboard_business_tab",
      },
      aggBuBpResidualRiskLevelRiskDashboardBusinessTab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "agg_bu_bp_residual_risk_level_risk_dashboard_business_tab",
      },
      aggBuBpInherentImpactInMillionDollarsRiskDashboardBusinessTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_inherent_impact_in_million_dollars_risk_dashboard_business_tab",
      },
      aggBuBpResidualImpactInMillionDollarsRiskDashboardBusinessTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_residual_impact_in_million_dollars_risk_dashboard_business_tab",
      },
      aggBuBpTargetImpactRiskDashboardBusinessTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_target_impact_risk_dashboard_business_tab",
      },
      aggBuBpTargetStrengthRiskDashboardBusinessTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_target_strength_risk_dashboard_business_tab",
      },
      aggBuBpTargetResidualRiskRiskDashboardBusinessTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_bu_bp_target_residual_risk_risk_dashboard_business_tab",
      },
      aggBuBpTargetResidualRiskLevelRiskDashboardBusinessTab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "agg_bu_bp_target_residual_risk_level_risk_dashboard_business_tab",
      },

      // Process to Asset
      businessProcessInherentRiskProcessToAsset: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "business_process_inherent_risk_process_to_asset",
      },
      businessProcessInherentImpactInMillionDollarsProcessToAsset: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field:
          "business_process_inherent_impact_in_million_dollars_process_to_asset",
      },

      // CIO Dashboard
      aggAssetInherentRiskScoreRiskDashboardCIOTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_inherent_risk_score_risk_dashboard_cio_tab",
      },
      aggAssetInherentRiskLevelRiskDashboardCIOTab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "agg_asset_inherent_risk_level_risk_dashboard_cio_tab",
      },
      aggAssetControlStrengthRiskDashboardCIOTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_control_strength_risk_dashboard_cio_tab",
      },
      aggAssetResidualRiskScoreRiskDashboardCIOTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_residual_risk_score_risk_dashboard_cio_tab",
      },
      aggAssetResidualRiskLevelRiskDashboardCIOTab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "agg_asset_residual_risk_level_risk_dashboard_cio_tab",
      },
      aggAssetInherentImpactInMillionDollarsRiskDashboardCIOTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_inherent_impact_in_million_dollars_risk_dashboard_cio_tab",
      },
      aggAssetResidualImpactInMillionDollarsRiskDashboardCIOTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_residual_impact_in_million_dollars_risk_dashboard_cio_tab",
      },
      aggAssetTargetImpactRiskDashboardCIOTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_target_impact_risk_dashboard_cio_tab",
      },
      aggAssetTargetStrengthRiskDashboardCIOTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_target_strength_risk_dashboard_cio_tab",
      },
      aggAssetTargetResidualRiskScoreRiskDashboardCIOTab: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "agg_asset_target_residual_risk_score_risk_dashboard_cio_tab",
      },
      aggAssetTargetResidualRiskLevelRiskDashboardCIOTab: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "agg_asset_target_residual_risk_level_risk_dashboard_cio_tab",
      },

      // timestamps
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
      tableName: "reports_master",
      timestamps: true,
      underscored: true, 
    }
  );

  return ReportsMaster;
};
