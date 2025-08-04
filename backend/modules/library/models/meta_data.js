const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MetaData = sequelize.define('MetaData', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false },
    input_type: {
      type: DataTypes.ENUM('text', 'select', 'multiselect', 'number'),
      defaultValue: "multiselect",
      allowNull: false,
    },
    supported_values: { type: DataTypes.ARRAY(DataTypes.STRING) },
    applies_to: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['all'],
    },
    description: DataTypes.TEXT,
  }, {
    tableName: 'library_meta_datas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // No association needed for now
  MetaData.associate = (models) => {};

  return MetaData;
};
