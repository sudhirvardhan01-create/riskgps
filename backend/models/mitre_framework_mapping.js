const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MitreFrameworkControlMappings = sequelize.define(
    "MitreFrameworkControlMappings",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      mitre_control_id: {
        type: DataTypes.UUID,
        references: { model: "library_mitre_threats_controls", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      framework_control_id: {
        type: DataTypes.UUID,
        references: { model: "library_framework_controls", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "library_mitre_framework_control_mapping",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return MitreFrameworkControlMappings;
};
