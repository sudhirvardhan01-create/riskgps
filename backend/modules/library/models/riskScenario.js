const { DataTypes } = require('sequelize');

const RISK_STATUS = ['draft', 'published', 'not_published'];

module.exports = (sequelize) => {
  const RiskScenario = sequelize.define('RiskScenario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    risk_code: {
      type: DataTypes.STRING,
      unique: true
    },
    risk_scenario: DataTypes.TEXT,
    risk_description: DataTypes.TEXT,
    risk_statement: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM(...RISK_STATUS),
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'library_risk_scenarios',
  });

  // hook to generate `risk_code` like RS-00001
  RiskScenario.afterCreate(async (instance) => {
    const paddedId = String(instance.id).padStart(5, '0');
    const code = `RS-${paddedId}`;
    await instance.update({ risk_code: code });
  });

  return RiskScenario;
};
