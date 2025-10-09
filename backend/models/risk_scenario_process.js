const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProcessRiskScenarioMappings = sequelize.define(
    "ProcessRiskScenarioMappings",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      risk_scenario_id: {
        type: DataTypes.UUID,
        references: { model: "library_risk_scenarios", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      process_id: {
        type: DataTypes.UUID,
        references: { model: "library_processes", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "library_process_risk_scenario_mapping",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ProcessRiskScenarioMappings;
};
