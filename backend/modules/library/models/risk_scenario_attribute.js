const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RiskScenarioAttribute = sequelize.define('RiskScenarioAttribute', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    risk_scenario_id: {
      type: DataTypes.INTEGER,
      references: { model: 'library_risk_scenarios', key: 'id' },
    },
    meta_data_key_id: {
      type: DataTypes.INTEGER,
      references: { model: 'library_meta_datas', key: 'id' },
    },
    values: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  }, {
    tableName: 'library_attributes_risk_scenario_mapping',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Associations
  RiskScenarioAttribute.associate = (models) => {
    RiskScenarioAttribute.belongsTo(models.RiskScenario, {
      foreignKey: 'risk_scenario_id',
    });
    RiskScenarioAttribute.belongsTo(models.MetaData, {
      foreignKey: 'meta_data_key_id',
      as: 'metaData',
    });
  };

  return RiskScenarioAttribute;
};
