const { DataTypes } = require('sequelize');

const RISK_STATUS = ['draft', 'published', 'not_published'];

module.exports = (sequelize) => {
  const RiskScenario = sequelize.define('RiskScenario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    risk_code: { type: DataTypes.STRING, unique: true },
    risk_scenario: DataTypes.TEXT,
    risk_description: DataTypes.TEXT,
    risk_statement: DataTypes.TEXT,
    status: { type: DataTypes.ENUM(...RISK_STATUS) },
    risk_field_1: DataTypes.TEXT,
    risk_field_2: DataTypes.TEXT,
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'library_risk_scenarios',
  });

  // Associations
  RiskScenario.associate = (models) => {
    RiskScenario.hasMany(models.RiskScenarioAttribute, {
      foreignKey: 'risk_scenario_id',
      as: 'attributes',
    });

    RiskScenario.belongsToMany(models.Process, {
      through: models.ProcessRiskScenarioMappings,
      foreignKey: 'risk_scenario_id',
      otherKey: 'process_id',
      as: 'processes',
    });
  };

  // Generate risk_code hook
  RiskScenario.afterCreate(async (instance) => {
    const paddedId = String(instance.id).padStart(5, '0');
    const code = `RS-${paddedId}`;
    await instance.update({ risk_code: code });
  });

  return RiskScenario;
};
