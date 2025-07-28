const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.RiskScenario = require("./riskScenario")(sequelize);
db.Process = require("./process")(sequelize);
db.MetaData = require("./meta_data")(sequelize);
db.RiskScenarioAttribute = require("./risk_scenario_attribute")(sequelize);
db.ProcessRiskScenarioMappings = require("./risk_scenario_process")(sequelize);

// RiskScenario hasMany RiskScenarioAttribute
db.RiskScenario.hasMany(db.RiskScenarioAttribute, {
  foreignKey: 'risk_scenario_id',
  as: 'attributes',
});

// RiskScenarioAttribute belongsTo RiskScenario
db.RiskScenarioAttribute.belongsTo(db.RiskScenario, {
  foreignKey: 'risk_scenario_id',
});

// RiskScenarioAttribute belongsTo MetaData (meta_data_key_id should map to MetaData's id)
db.RiskScenarioAttribute.belongsTo(db.MetaData, {
  foreignKey: 'meta_data_key_id',
  as: 'metaData',
});

// RiskScenario belongsToMany Process through ProcessRiskScenarioMappings
db.RiskScenario.belongsToMany(db.Process, {
  through: db.ProcessRiskScenarioMappings,
  foreignKey: 'risk_scenario_id',
  otherKey: 'process_id',
  as: 'processes', // alias to access related processes from RiskScenario
});

// Process belongsToMany RiskScenario through ProcessRiskScenarioMappings
db.Process.belongsToMany(db.RiskScenario, {
  through: db.ProcessRiskScenarioMappings,
  foreignKey: 'process_id',
  otherKey: 'risk_scenario_id',
  as: 'riskScenarios', // alias to access related risk scenarios from Process
});

module.exports = db;
