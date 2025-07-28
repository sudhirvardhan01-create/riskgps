module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    organisation: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    communicationPreference: { type: DataTypes.ENUM('Email', 'Phone', 'Both'), allowNull: true }
  });
  User.associate = models => {
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
  };
  return User;
};