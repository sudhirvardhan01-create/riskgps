const commonFields = require("../common_fields");

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
      orgBusinessUnitId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_business_unit_id",
      },
      orgProcessId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_process_id",
      },
      orgAssetId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_asset_id",
      },
      orgRiskScenarioId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_risk_scenario_id",
      },
      financialImpact: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "financial_impact",
      },
      regulatoryImpact: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "regulatory_impact",
      },
      reputationalImpact: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "assessment_id",
      },
      organizationalImpact: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "reputational_impact",
      },
      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, etc.
    },
    {
      tableName: "reports_master",
      schema: "public",
      timestamps: false,
    }
  );

  return ReportsMaster;
};
