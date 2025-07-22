const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RiskScenarioAttribute', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    risk_scenario_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'risk_scenarios',
        key: 'id',
      },
    },
    meta__data_key_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'meta_datas',
        key: 'id',
      },
    },
    values: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  }, {
    tableName: 'risk_scenario_attributes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
};
