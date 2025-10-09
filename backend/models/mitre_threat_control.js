const { DataTypes } = require("sequelize");
const { ASSETS, GENERAL } = require("../constants/library");

module.exports = (sequelize) => {
  const MitreThreatControl = sequelize.define(
    "MitreThreatControl",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        field: "control_priority"
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
    },
    {
      tableName: "library_mitre_threats_controls",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  
MitreThreatControl.associate = (models) => {
  MitreThreatControl.belongsToMany(models.FrameWorkControl, {
    through: models.MitreFrameworkControlMappings,
    foreignKey: 'mitre_control_id',       // mapping table column
    otherKey: 'framework_control_id',     // mapping table column
    sourceKey: 'id',          // business key in this model
    as: 'framework_controls',
  });
};

  return MitreThreatControl;
};
