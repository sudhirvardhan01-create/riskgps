const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Process = sequelize.define('Process', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
  }, {
    tableName: 'library_processes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Associations
  Process.associate = (models) => {
    Process.belongsToMany(models.RiskScenario, {
      through: models.ProcessRiskScenarioMappings,
      foreignKey: 'process_id',
      otherKey: 'risk_scenario_id',
      as: 'riskScenarios',
    });
  };

  return Process;
};
