const { DataTypes } = require("sequelize");
const { PROCESS } = require("../../constants/library");

module.exports = (sequelize) => {
  const OrganizationProcessRelationship = sequelize.define(
    "OrganizationProcessRelationship",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      source_process_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "organization_process",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      target_process_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "organization_process",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      relationship_type: {
        type: DataTypes.ENUM(...PROCESS.PROCESS_RELATIONSHIP_TYPES),
        allowNull: false,
        defaultValue: "follows",
      },
      description: DataTypes.TEXT,
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "organization_process_relationships",
      validate: {
        // Prevent self-referencing relationships
        notSelfReferencing() {
          if (this.source_process_id === this.target_process_id) {
            throw new Error("A process cannot have a relationship with itself");
          }
        },
      },
    }
  );

  // Associations
  OrganizationProcessRelationship.associate = (models) => {
    // Belongs to source process
    OrganizationProcessRelationship.belongsTo(models.OrganizationProcess, {
      foreignKey: "source_process_id",
      as: "sourceProcess",
    });

    // Belongs to target process
    OrganizationProcessRelationship.belongsTo(models.OrganizationProcess, {
      foreignKey: "target_process_id",
      as: "targetProcess",
    });
  };

  return OrganizationProcessRelationship;
};
