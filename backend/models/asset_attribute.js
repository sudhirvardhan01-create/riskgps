const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AssetAttribute = sequelize.define(
    "AssetAttribute",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      asset_id: {
        type: DataTypes.UUID,
        references: { model: "library_assets", key: "id" },
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
      tableName: "library_attributes_asset_mapping",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  AssetAttribute.associate = (models) => {
    AssetAttribute.belongsTo(models.Asset, {
      foreignKey: "asset_id",
    });
    AssetAttribute.belongsTo(models.MetaData, {
      foreignKey: "meta_data_key_id",
      as: "metaData",
    });
  };

  return AssetAttribute;
};
