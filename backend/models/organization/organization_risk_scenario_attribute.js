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
      riskScenarioId: {
        type: DataTypes.UUID,
        field: "risk_scenario_id",
        references: { model: "organization_risk_scenario", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      metaDataKeyId: {
        type: DataTypes.UUID,
        field: "meta_data_key_id",
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
      foreignKey: "riskScenarioId",
    });
    OrganizationRiskScenarioAttribute.belongsTo(models.MetaData, {
      foreignKey: "metaDataKeyId",
      as: "metaData",
    });
  };

  return OrganizationRiskScenarioAttribute;
};
