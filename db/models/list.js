'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  List.associate = function(models) {
    // associations can be defined here
    List.belongsTo(models.User, { foreignKey: "userId" })
    List.hasMany(models.Task, { foreignKey: "listId", onDelete: "CASCADE" })
  };
  return List;
};