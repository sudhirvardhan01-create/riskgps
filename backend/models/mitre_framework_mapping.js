const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MitreFrameworkControlMappings = sequelize.define('MitreFrameworkControlMappings', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mitre_control_id: {
      type: DataTypes.INTEGER,
      references: { model: 'library_mitre_threats_controls', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    framework_control_id: {
      type: DataTypes.INTEGER,
      references: { model: 'library_framework_controls', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'library_mitre_framework_control_mapping',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });


  return MitreFrameworkControlMappings;
};
