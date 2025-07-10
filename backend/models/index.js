const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize);

module.exports = db;
