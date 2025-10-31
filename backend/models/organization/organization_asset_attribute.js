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
      assetId: {
        type: DataTypes.UUID,
        references: { model: "organization_asset", key: "id" },
        feild: "asset_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      metaDataKeyId: {
        type: DataTypes.UUID,
        references: { model: "library_meta_datas", key: "id" },
        field: "meta_data_key_id",
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
      foreignKey: "assetId",
    });

    
    OrganizationAssetAttribute.belongsTo(models.MetaData, {
      foreignKey: "metaDataKeyId",
      as: "metaData",
    });
  };

  return OrganizationAssetAttribute;
};
