const { DataTypes } = require("sequelize");
const { GENERAL } = require("../constants/library");

module.exports = (sequelize) => {
  const Process = sequelize.define(
    "Process",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id"
      },
      autoIncrementId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      field: "auto_increment_id"

      },
      processCode: {
        unique: true,
        type: DataTypes.STRING,
        field: "process_code"
      },
      processName: { 
        type: DataTypes.STRING, 
        unique: true,
        allowNull: false,
        field: "process_name"
      },
      processDescription: { 
        type: DataTypes.TEXT,
        allowNull: true,
        field: "process_description" 
      },
      seniorExecutiveOwnerName: {
        type: DataTypes.STRING,
        allowNull: true ,
        field: "senior_executive__owner_name"
      },
      seniorExecutiveOwnerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "senior_executive__owner_email"

      },
      operationsOwnerName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "operations__owner_name" 
      },
      operationsOwnerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "operations__owner_email" 
      },
      technologyOwnerName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "technology_owner_name"
      },
      technologyOwnerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "technology_owner_email"
      },
      organizationalRevenueImpactPercentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "organizational_revenue_impact_percentage"
      },
      financialMateriality: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "financial_materiality"
      },
      thirdPartyInvolvement: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "third_party_involvement"
      },
      usersCustomers: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "users_customers"
      },
      regulatoryAndCompliance: {
        type: DataTypes.ARRAY(
          DataTypes.STRING
        ),
        allowNull: true,
        field: "regulatory_and_compliance"
      },
      criticalityOfDataProcessed: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "criticality_of_data_processed"
      },
      dataProcessed: {
        type: DataTypes.ARRAY(
          DataTypes.ENUM(...GENERAL.DATA_TYPES)
        ),
        allowNull: true,
        field: "data_processed"
      },
      status: { 
        defaultValue: 'published',
        allowNull: false,
        type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES), 
        field: "status"
      },
    },
    {
      tableName: "library_processes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Process.associate = (models) => {
    // Self-referencing relationships - source relationships (where this process is the source)
    Process.hasMany(models.ProcessRelationship, {
      foreignKey: 'source_process_id',
      as: 'sourceRelationships',
    });

    // Self-referencing relationships - target relationships (where this process is the target)
    Process.hasMany(models.ProcessRelationship, {
      foreignKey: 'target_process_id',
      as: 'targetRelationships',
    });

    // Many-to-many with RiskScenario
    Process.belongsToMany(models.RiskScenario, {
      through: models.ProcessRiskScenarioMappings,
      foreignKey: 'process_id',
      otherKey: 'risk_scenario_id',
      as: 'riskScenarios',
    });

    Process.hasMany(models.ProcessAttribute, {
      foreignKey: 'process_id',
      as: 'attributes',
    });
  };

  Process.afterCreate(async (instance, options) => {
    const paddedId = String(instance.autoIncrementId).padStart(5, "0");
    const code = `BP${paddedId}`;
    await instance.update({ process_code: code }, { transaction: options.transaction });
  });
  return Process;

};

