const { DataTypes } = require('sequelize');
const { PROCESS_RELATIONSHIP_TYPES } = require('../constants/process');



module.exports = (sequelize) => {
  const ProcessRelationship = sequelize.define('ProcessRelationship', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    source_process_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'library_processes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    target_process_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'library_processes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    relationship_type: {
      type: DataTypes.ENUM(...PROCESS_RELATIONSHIP_TYPES),
      allowNull: false,
      defaultValue: "follows"
    },
    description: DataTypes.TEXT,
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'process_relationships',
    validate: {
      // Prevent self-referencing relationships
      notSelfReferencing() {
        if (this.source_process_id === this.target_process_id) {
          throw new Error('A process cannot have a relationship with itself');
        }
      },
    },
  });

  // Associations
  ProcessRelationship.associate = (models) => {
    // Belongs to source process
    ProcessRelationship.belongsTo(models.Process, {
      foreignKey: 'source_process_id',
      as: 'sourceProcess',
    });

    // Belongs to target process
    ProcessRelationship.belongsTo(models.Process, {
      foreignKey: 'target_process_id',
      as: 'targetProcess',
    });
  };

  return ProcessRelationship;
};
