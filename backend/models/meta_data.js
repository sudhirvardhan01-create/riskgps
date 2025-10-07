const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MetaData = sequelize.define('MetaData', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: true },
    input_type: {
      type: DataTypes.ENUM('text', 'select', 'multiselect', 'number'),
      defaultValue: "multiselect",
      allowNull: true,
    },
    supported_values: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    applies_to: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['all'],
      allowNull: false,
    },
    description: { type: DataTypes.TEXT, allowNull: true },
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
