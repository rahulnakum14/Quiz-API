const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'timetracking',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    requestTimeout: 130000
  },
});

module.exports = { sequelize, Sequelize };
