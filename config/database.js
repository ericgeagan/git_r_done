const {
  db: { username, password, database, host },
  session: { sessionSecret }
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
