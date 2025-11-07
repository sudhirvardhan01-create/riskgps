const { GENERAL } = require("../../constants/library");
const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const OrganizationRiskScenario = sequelize.define(
    "OrganizationRiskScenario",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
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
      autoIncrementId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        field: "auto_increment_id",
        unique: true,
      },
      riskCode: {
        type: DataTypes.STRING,
        unique: true,
        field: "risk_code",
      },
      riskScenario: {
        allowNull: false,
        type: DataTypes.TEXT,
        field: "risk_scenario",
      },
      riskDescription: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: "risk_description",
      },
      riskStatement: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: "risk_statement",
      },
      ciaMapping: {
        allowNull: true,
        type: DataTypes.ARRAY(DataTypes.ENUM(...GENERAL.CIA_MAPPING_VALUES)),
        field: "cia_mapping",
      },
      status: {
        defaultValue: "published",
        allowNull: false,
        type: DataTypes.ENUM(GENERAL.STATUS_SUPPORTED_VALUES),
        field: "status",
      },
      riskField1: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: "risk_field_1",
      },
      riskField2: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: "risk_field_2",
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization_risk_scenario",
      timestamps: false, // we’re handling audit fields manually
    }
  );

  OrganizationRiskScenario.associate = (models) => {
    // belongsTo Organization
    OrganizationRiskScenario.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      targetKey: "organizationId",
      as: "organizationForRiskScenarios",
    });

    // One Organization → Many Risk Scenarios
    if (models.Organization) {
      models.Organization.hasMany(OrganizationRiskScenario, {
        foreignKey: "organizationId",
        sourceKey: "organizationId",
        as: "organizationRiskScenarios",
      });
    }

    OrganizationRiskScenario.belongsToMany(models.OrganizationProcess, {
      through: models.OrganizationProcessRiskScenarioMappings,
      foreignKey: "riskScenarioId",
      otherKey: "processId",
      as: "processes",
    });
    OrganizationRiskScenario.hasMany(
      models.OrganizationRiskScenarioAttribute,
      {
        foreignKey: "riskScenarioId",
        as: "attributes",
      }
    );
  };

  OrganizationRiskScenario.afterCreate(async (instance, options) => {
    const paddedId = String(instance.autoIncrementId).padStart(5, "0");
    const code = `RS${paddedId}`;
    await instance.update(
      { riskCode: code },
      { transaction: options.transaction }
    );
  });

  return OrganizationRiskScenario;
};
