const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrganizationProcessAttribute = sequelize.define(
    "OrganizationProcessAttribute",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      process_id: {
        type: DataTypes.UUID,
        references: { model: "organization_process", key: "id" },
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
      tableName: "organization_process_attribute_mapping",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  OrganizationProcessAttribute.associate = (models) => {
    OrganizationProcessAttribute.belongsTo(models.OrganizationProcess, {
      foreignKey: "process_id",
    });
    OrganizationProcessAttribute.belongsTo(models.MetaData, {
      foreignKey: "meta_data_key_id",
      as: "metaData",
    });
  };

  return OrganizationProcessAttribute;
};
