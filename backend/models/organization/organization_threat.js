const { GENERAL, ASSETS } = require("../../constants/library");
const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const OrganizationThreat = sequelize.define(
    "OrganizationThreat",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "org_id", // alias → DB column org_id
      },
      platforms: {
        type: DataTypes.ARRAY(DataTypes.ENUM(...ASSETS.ASSET_CATEGORY)),
        field: "platforms",
        allowNull: false,
      },
      mitreTechniqueId: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "mitre_technique_id",
      },
      mitreTechniqueName: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "mitre_technique_name",
      },
      ciaMapping: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.ENUM(...GENERAL.CIA_MAPPING_VALUES)),
        field: "cia_mapping",
      },
      subTechniqueId: {
        type: DataTypes.STRING,
        field: "sub_technique_id",
      },
      subTechniqueName: {
        type: DataTypes.STRING,
        field: "sub_technique_name",
      },
      mitreControlId: {
        type: DataTypes.STRING,
        field: "mitre_control_id",
      },
      mitreControlName: {
        type: DataTypes.STRING,
        field: "mitre_control_name",
      },
      mitreControlType: {
        type: DataTypes.STRING,
        field: "mitre_control_type",
      },
      mitreControlDescription: {
        type: DataTypes.TEXT,
        field: "mitre_control_description",
      },
      controlPriority: {
        type: DataTypes.INTEGER,
        field: "control_priority",
      },
      bluOceanControlDescription: {
        type: DataTypes.TEXT,
        field: "bluocean_control_description",
      },
      status: {
        defaultValue: "published",
        allowNull: false,
        type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES),
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization_threat",
      timestamps: false, // using custom audit fields instead of Sequelize defaults
    }
  );

  OrganizationThreat.associate = (models) => {
    // belongsTo Organization
    OrganizationThreat.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      targetKey: "organizationId",
      as: "organizationDetails",
    });

    // One Organization → Many Threats
    if (models.Organization) {
      models.Organization.hasMany(OrganizationThreat, {
        foreignKey: "organizationId",
        sourceKey: "organizationId",
        as: "threats",
      });
    }
    if (models.FrameWorkControl) {
      OrganizationThreat.belongsToMany(models.OrganizationFrameworkControl, {
        through: models.OrganizationFrameworkControlMitreControlMapping,
        foreignKey: "mitreControlId", // mapping table column
        otherKey: "frameworkControlId", // mapping table column
        sourceKey: "id", // business key in this model
        as: "framework_controls",
      });
    }
  };

  return OrganizationThreat;
};
