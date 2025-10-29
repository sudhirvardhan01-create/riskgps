const { GENERAL } = require("../../constants/library");
const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const OrganizationProcess = sequelize.define(
    "OrganizationProcess",
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
        field: "org_id", // alias → maps to DB column org_id
      },
      orgBusinessUnitId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "org_business_unit_id", // new field added
      },
      autoIncrementId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        field: "auto_increment_id",
      },
      processCode: {
        unique: true,
        type: DataTypes.STRING,
        field: "process_code",
      },
      processName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: "process_name",
      },
      processDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "process_description",
      },
      seniorExecutiveOwnerName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "senior_executive__owner_name",
      },
      seniorExecutiveOwnerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "senior_executive__owner_email",
      },
      operationsOwnerName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "operations__owner_name",
      },
      operationsOwnerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "operations__owner_email",
      },
      technologyOwnerName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "technology_owner_name",
      },
      technologyOwnerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "technology_owner_email",
      },
      organizationalRevenueImpactPercentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "organizational_revenue_impact_percentage",
      },
      financialMateriality: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "financial_materiality",
      },
      thirdPartyInvolvement: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "third_party_involvement",
      },
      usersCustomers: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "users_customers",
      },
      regulatoryAndCompliance: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: "regulatory_and_compliance",
      },
      criticalityOfDataProcessed: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "criticality_of_data_processed",
      },
      dataProcessed: {
        type: DataTypes.ARRAY(DataTypes.ENUM(...GENERAL.DATA_TYPES)),
        allowNull: true,
        field: "data_processed",
      },
      status: {
        defaultValue: "published",
        allowNull: false,
        type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES),
        field: "status",
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization_process",
      timestamps: false, // using custom fields instead of Sequelize defaults
    }
  );

  OrganizationProcess.associate = (models) => {
    // belongsTo Organization
    OrganizationProcess.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      targetKey: "organizationId",
      as: "organizationDetails",
    });

    // belongsTo Organization Business Unit
    OrganizationProcess.belongsTo(models.OrganizationBusinessUnit, {
      foreignKey: "orgBusinessUnitId",
      targetKey: "orgBusinessUnitId",
      as: "businessUnitDetails",
    });

    // One Organization → Many Processes
    if (models.Organization) {
      models.Organization.hasMany(OrganizationProcess, {
        foreignKey: "organizationId",
        sourceKey: "organizationId",
        as: "processes",
      });
    }

    // One Business Unit → Many Processes
    if (models.OrganizationBusinessUnit) {
      models.OrganizationBusinessUnit.hasMany(OrganizationProcess, {
        foreignKey: "orgBusinessUnitId",
        sourceKey: "orgBusinessUnitId",
        as: "unitProcesses",
      });
    }
    // Self-referencing relationships - source relationships (where this process is the source)
    OrganizationProcess.hasMany(models.OrganizationProcessRelationship, {
      foreignKey: "source_process_id",
      as: "sourceRelationships",
    });

    // Self-referencing relationships - target relationships (where this process is the target)
    OrganizationProcess.hasMany(models.OrganizationProcessRelationship, {
      foreignKey: "target_process_id",
      as: "targetRelationships",
    });

    // Many-to-many with RiskScenario
    OrganizationProcess.belongsToMany(models.OrganizationRiskScenario, {
      through: models.OrganizationProcessRiskScenarioMappings,
      foreignKey: "process_id",
      otherKey: "risk_scenario_id",
      as: "riskScenarios",
    });

    // Many-to-many with Asset
    OrganizationProcess.belongsToMany(models.OrganizationAsset, {
      through: models.OrganizationAssetProcessMappings,
      foreignKey: "process_id",
      otherKey: "asset_id",
      as: "assets",
    });

    OrganizationProcess.hasMany(models.OrganizationProcessAttribute, {
      foreignKey: "process_id",
      as: "attributes",
    });
  };

  OrganizationProcess.afterCreate(async (instance, options) => {
    const paddedId = String(instance.autoIncrementId).padStart(5, "0");
    const code = `BP${paddedId}`;
    await instance.update(
      { processCode: code },
      { transaction: options.transaction }
    );
  });

  return OrganizationProcess;
};
