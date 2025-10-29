const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrganizationProcessRiskScenarioMappings = sequelize.define(
    "OrganizationProcessRiskScenarioMappings",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      risk_scenario_id: {
        type: DataTypes.UUID,
        references: { model: "organization_risk_scenario", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      process_id: {
        type: DataTypes.UUID,
        references: { model: "organization_process", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "organization_process_risk_scenario_mapping",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return OrganizationProcessRiskScenarioMappings;
};
