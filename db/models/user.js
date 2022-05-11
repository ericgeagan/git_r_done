'use strict';
const bcrypt = require("bcryptjs")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false    
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.List, { foreignKey: "userId", onDelete: "CASCADE" })
  };
  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString())
  }
  return User;
};