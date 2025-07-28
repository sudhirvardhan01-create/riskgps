const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Process', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
  }, {
    tableName: 'library_processes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
};
