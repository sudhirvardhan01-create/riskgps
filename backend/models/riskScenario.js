const { DataTypes } = require("sequelize");
const { GENERAL } = require("../constants/library");

module.exports = (sequelize) => {
  const RiskScenario = sequelize.define(
    "RiskScenario",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      auto_increment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      },
      risk_code: {
        type: DataTypes.STRING,
        unique: true,
      },
      risk_scenario: {
        allowNull: false,
        type: DataTypes.TEXT,
        unique: true,
      },
      risk_description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      risk_statement: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      cia_mapping: {
        allowNull: true,
        type: DataTypes.ARRAY(DataTypes.ENUM(...GENERAL.CIA_MAPPING_VALUES)),
      },
      status: {
        defaultValue: "published",
        allowNull: false,
        type: DataTypes.ENUM(GENERAL.STATUS_SUPPORTED_VALUES),
      },
      risk_field_1: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      risk_field_2: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "library_risk_scenarios",
    }
  );

  // Associations
  RiskScenario.associate = (models) => {
    RiskScenario.hasMany(models.RiskScenarioAttribute, {
      foreignKey: "risk_scenario_id",
      as: "attributes",
    });

    RiskScenario.belongsToMany(models.Process, {
      through: models.ProcessRiskScenarioMappings,
      foreignKey: "risk_scenario_id",
      otherKey: "process_id",
      as: "processes",
    });
  };

  RiskScenario.afterCreate(async (instance, options) => {
    const paddedId = String(instance.auto_increment_id).padStart(5, "0");
    const code = `RS-${paddedId}`;
    await instance.update({ risk_code: code }, { transaction: options.transaction });
  });

  return RiskScenario;
};
