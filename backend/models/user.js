module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    userid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'user',
    timestamps: false
  });
};
