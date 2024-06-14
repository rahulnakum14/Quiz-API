const { Sequelize } = require('sequelize')

/**
 * Sequelize instance for connecting to the database.
 * @type {Sequelize}
 * @name sequelize
 * @property {string} dialect - The dialect of the database.
 * @property {string} host - The hostname of the database.
 * @property {string} username - The username for database connection.
 * @property {string} password - The password for database connection.
 * @property {string} database - The name of the database for connection.
 */
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'voting',
  pool: {
    max: 200,
    min: 0,
    acquire: 300000,
    idle: 20000
  }
})

module.exports = { sequelize, Sequelize }