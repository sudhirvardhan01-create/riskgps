const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AssetProcessMappings = sequelize.define('AssetProcessMappings', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    asset_id: {
      type: DataTypes.INTEGER,
      references: { model: 'library_asset', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    process_id: {
      type: DataTypes.INTEGER,
      references: { model: 'library_processes', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'library_asset_process_mappings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });


  return AssetProcessMappings;
};
