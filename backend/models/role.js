const commonFields = require("./common_fields");

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      roleId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "role_id",
      },
      roleKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "role_key",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "name",
      },
      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, tenantId, etc.
    },
    {
      tableName: "role",
      schema: "public",
      timestamps: false, // disable default createdAt/updatedAt
    }
  );

  Role.associate = (models) => {
    // One Role → Many Users
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      sourceKey: "roleId",
      as: "users",
    });
  };

  return Role;
};
