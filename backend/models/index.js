'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];


const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
// db.RiskScenario = require("../modules/library/models/riskScenario")(sequelize);
// db.Process = require("../modules/library/models/process")(sequelize);
// db.MetaData = require("../modules/library/models/meta_data")(sequelize);
// db.RiskScenarioAttribute = require("../modules/library/models/risk_scenario_attribute")(sequelize);
// db.ProcessRiskScenarioMappings = require("../modules/library/models/risk_scenario_process")(sequelize);
// db.ProcessRelationship = require("../modules/library/models/process_relation")(sequelize);
// db.ProcessAttribute = require("../modules/library/models/process_attribute")(sequelize);
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;