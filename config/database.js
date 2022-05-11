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
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
  }
};
