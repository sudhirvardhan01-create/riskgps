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
      parentObjectId: {
        type: DataTypes.UUID,
        field: "parent_object_id",
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "org_id", // alias → DB column org_id
      },
      frameWorkName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "framework_name",
        validate: {
          notEmpty: true,
        },
      },
      frameWorkControlCategoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "framework_control_category_id",
        validate: {
          notEmpty: true,
        },
      },
      frameWorkControlCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "framework_control_category",
      },
      frameWorkControlDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "framework_control_description",
      },
      frameWorkControlSubCategoryId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "framework_control_sub_category_id",
      },
      frameWorkControlSubCategory: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "framework_control_sub_category",
      },
      currentScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "current_score",
      },
      targetScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "target_score",
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization_framework_control",
      timestamps: false, 
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
      foreignKey: "frameworkControlId", // mapping table column
      otherKey: "mitreControlId", // mapping table column
      targetKey: "id", // business key in MitreThreatControl
      as: "mitre_controls",
    });
  };

  return OrganizationFrameworkControl;
};
