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
        field: "id"
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
        unique: true,
      },
      riskDescription: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: "risk_description"
      },
      riskStatement: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: "risk_statement"
      },
      ciaMapping: {
        allowNull: true,
        type: DataTypes.ARRAY(DataTypes.ENUM(...GENERAL.CIA_MAPPING_VALUES)),
        field: "cia_mapping"
      },
      status: {
        defaultValue: "published",
        allowNull: false,
        type: DataTypes.ENUM(GENERAL.STATUS_SUPPORTED_VALUES),
        field: "status"
      },
      riskField1: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: "risk_field_1"
      },
      riskField2: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: "risk_field_2"

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
    const paddedId = String(instance.autoIncrementId).padStart(5, "0");
    const code = `RS${paddedId}`;
    await instance.update({ risk_code: code }, { transaction: options.transaction });
  });

  return RiskScenario;
};
