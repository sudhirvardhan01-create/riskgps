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
      incrementalId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        field: "incremental_id",
      },
      userCode: {
        type: DataTypes.STRING,
        unique: true,
        field: "user_code",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
        allowNull: true,
        field: "communication_preference",
      },
      roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        field: "role_id",
      },
      organizationId: {
        type: DataTypes.UUID,
        field: "org_id",
        allowNull: true,
      },
      isTermsAndConditionsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_terms_and_conditions_accepted",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
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
    User.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });
    User.hasMany(models.RefreshToken, {
      foreignKey: "userId",
      as: "refreshTokens",
    });
  };

  User.afterCreate(async (instance, options) => {
    const paddedId = String(instance.incrementalId).padStart(5, "0");
    const code = `US${paddedId}`;
    await instance.update(
      { userCode: code },
      {
        transaction: options.transaction,
      }
    );
  });

  return User;
};
