import { Sequelize } from 'sequelize';
import config from "./config/config.json";

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
const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  {
    dialect: config[env].dialect,
    host: config[env].host,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 200,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 300000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 20000,
    },
  }
);


export { Sequelize, sequelize };