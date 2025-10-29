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
      mitreControlId: {
        type: DataTypes.UUID,
        field: "mitre_control_id",
        references: { model: "organization_threat", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      frameworkControlId: {
        type: DataTypes.UUID,
        field: "framework_control_id",
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
