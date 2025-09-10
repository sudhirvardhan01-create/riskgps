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
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

// Recursive function to read all .js files inside models and subfolders
function loadModels(dir) {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // If it's a folder, go deeper
            loadModels(filePath);
        } else if (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file !== 'common_fields.js'
        ) {
            const modelDef = require(filePath);

            // Only initialize if it's a function (Sequelize model definition)
            if (typeof modelDef === "function") {
                const model = modelDef(sequelize, Sequelize.DataTypes);
                db[model.name] = model;
            }
        }
    });
}


// Start loading from current directory
loadModels(__dirname);

// Set up associations if present
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
