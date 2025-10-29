const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrganizationAssetAttribute = sequelize.define(
    "OrganizationAssetAttribute",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      asset_id: {
        type: DataTypes.UUID,
        references: { model: "organization_asset", key: "id" },
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
      tableName: "organization_asset_attribute_mapping",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  OrganizationAssetAttribute.associate = (models) => {
    OrganizationAssetAttribute.belongsTo(models.OrganizationAsset, {
      foreignKey: "asset_id",
    });

    
    OrganizationAssetAttribute.belongsTo(models.MetaData, {
      foreignKey: "meta_data_key_id",
      as: "metaData",
    });
  };

  return OrganizationAssetAttribute;
};
