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

module.exports = db;
