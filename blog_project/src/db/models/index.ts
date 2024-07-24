import { Sequelize } from 'sequelize';
import config from '../config/config.json'

const env = process.env.NODE_ENV || 'development';

const sequelize = config[env].url
  ? new Sequelize(config[env].url, config[env])
  : new Sequelize(config[env].database, config[env].username, config[env].password, config[env]);

export { Sequelize, sequelize };
