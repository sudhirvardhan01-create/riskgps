const commonFields = require("./common_fields");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "user_id",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "name",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "email",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "phone",
      },
      organisation: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "organisation",
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "message",
      },
      communicationPreference: {
        type: DataTypes.ENUM("Email", "Phone", "Both"),
        allowNull: false,
        field: "communication_preference",
      },
      roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        field: "role_id",
      },
      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, etc.
    },
    {
      tableName: "user",
      schema: "public",
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });
    User.hasMany(models.RefreshToken, {
      foreignKey: "userId",
      as: "refreshTokens",
    });
  };

  return User;
};
