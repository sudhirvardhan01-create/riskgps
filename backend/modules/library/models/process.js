const { DataTypes } = require("sequelize");

const PROCESS_STATUS = ['draft', 'published', 'not_published'];

module.exports = (sequelize) => {
  const Process = sequelize.define(
    "Process",
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      process_code: {
        unique: true,
        type: DataTypes.STRING,
      },
      process_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      process_description: { 
        type: DataTypes.STRING,
        allowNull: true 
      },
      senior_executive__owner_name: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      senior_executive__owner_email: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      operations__owner_name: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      operations__owner_email: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      technology_owner_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      technology_owner_email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      organizational_revenue_impact_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      financial_materiality: {
        type: DataTypes.STRING,
        allowNull: true
      },
      third_party_involvement: {
        type: DataTypes.STRING,
        allowNull: true
      },
      users_customers: {
        type: DataTypes.STRING,
        allowNull: true
      },
      regulatory_and_compliance: {
        type: DataTypes.STRING,
        allowNull: true
      },
      criticality_of_data_processed: {
        type: DataTypes.STRING,
        allowNull: true
      },
      data_processed: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: { 
        defaultValue: 'published',
        allowNull: false,
        type: DataTypes.ENUM(...PROCESS_STATUS) 
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

  Process.afterCreate(async (instance) => {
    const paddedId = String(instance.id).padStart(5, "0");
    const code = `BP-${paddedId}`;
    await instance.update({ process_code: code });
  });
  return Process;

};

