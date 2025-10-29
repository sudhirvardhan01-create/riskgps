const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrganizationRiskScenarioAttribute = sequelize.define(
    "OrganizationRiskScenarioAttribute",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      risk_scenario_id: {
        type: DataTypes.UUID,
        references: { model: "organization_risk_scenario", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      meta_data_key_id: {
        type: DataTypes.UUID,
        references: { model: "library_meta_datas", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      values: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    },
    {
      tableName: "organization_risk_scenario_attribute_mapping",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  OrganizationRiskScenarioAttribute.associate = (models) => {
    OrganizationRiskScenarioAttribute.belongsTo(models.OrganizationRiskScenario, {
      foreignKey: "risk_scenario_id",
    });
    OrganizationRiskScenarioAttribute.belongsTo(models.MetaData, {
      foreignKey: "meta_data_key_id",
      as: "metaData",
    });
  };

  return OrganizationRiskScenarioAttribute;
};
