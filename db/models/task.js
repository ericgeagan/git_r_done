'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    dueDate: DataTypes.DATE,
    startDate: DataTypes.DATE,
    repeating: DataTypes.BOOLEAN,
    completed: DataTypes.BOOLEAN,
    estimatedTime: DataTypes.INTEGER,
    note: DataTypes.STRING,
    listId: DataTypes.INTEGER
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.belongsTo(models.List, { foreignKey: "listId" })
  };
  return Task;
};