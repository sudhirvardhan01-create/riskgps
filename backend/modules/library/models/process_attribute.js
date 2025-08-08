const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProcessAttribute = sequelize.define('ProcessAttribute', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    process_id: {
      type: DataTypes.INTEGER,
      references: { model: 'library_processes', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    meta_data_key_id: {
      type: DataTypes.INTEGER,
      references: { model: 'library_meta_datas', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    values: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  }, {
    tableName: 'library_attributes_process_mapping',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Associations
  ProcessAttribute.associate = (models) => {
    ProcessAttribute.belongsTo(models.Process, {
      foreignKey: 'process_id',
    });
    ProcessAttribute.belongsTo(models.MetaData, {
      foreignKey: 'meta_data_key_id',
      as: 'metaData',
    });
  };

  return ProcessAttribute;
};
