const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('MetaData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    input_type: {
      type: DataTypes.ENUM('text', 'select', 'multiselect', 'number'),
      default: "multiselect",
      allowNull: false,
    },
    supported_values: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    applies_to: {
      type: DataTypes.ARRAY(DataTypes.STRING), // e.g., ['all', 'risk_scenario', 'process', 'threat']
      defaultValue: ['all'],
    },
    description: DataTypes.TEXT,
  }, {
    tableName: 'meta_datas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
};
