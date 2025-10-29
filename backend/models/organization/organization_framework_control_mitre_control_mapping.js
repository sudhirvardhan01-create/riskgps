const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrganizationFrameworkControlMitreControlMapping = sequelize.define(
    "OrganizationFrameworkControlMitreControlMapping",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      mitre_control_id: {
        type: DataTypes.UUID,
        references: { model: "organization_threat", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      framework_control_id: {
        type: DataTypes.UUID,
        references: { model: "organization_framework_control", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "organization_framework_control_mitre_control_mapping",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return OrganizationFrameworkControlMitreControlMapping;
};
