const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const OrganizationFrameworkControl = sequelize.define(
    "OrganizationFrameworkControl",
    {
      orgControlId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "org_control_id",
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "org_id", // alias → DB column org_id
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization_framework_control",
      timestamps: false, // we’re handling timestamps manually
    }
  );

  OrganizationFrameworkControl.associate = (models) => {
    // belongsTo Organization
    OrganizationFrameworkControl.belongsTo(models.Organization, {
      foreignKey: "organizationId", // alias
      targetKey: "organizationId",
      as: "organizationDetails",
    });

    // One Organization → Many Controls
    if (models.Organization) {
      models.Organization.hasMany(OrganizationFrameworkControl, {
        foreignKey: "organizationId",
        sourceKey: "organizationId",
        as: "controls",
      });
    }

    OrganizationFrameworkControl.belongsToMany(models.OrganizationThreat, {
      through: models.OrganizationFrameworkControlMitreControlMapping,
      foreignKey: "framework_control_id", // mapping table column
      otherKey: "mitre_control_id", // mapping table column
      targetKey: "id", // business key in MitreThreatControl
      as: "mitre_controls",
    });
  };

  return OrganizationFrameworkControl;
};
