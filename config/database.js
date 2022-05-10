const {
  db: { username, password, database, host },
  sessionSecret
} = require('./index');

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    sessionSecret,
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
};
