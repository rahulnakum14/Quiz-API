const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const employee = sequelize.define('employee', {
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email:{
    type: DataTypes.STRING,
  },
  name:{
    type: DataTypes.STRING
  },
  gender:{
    type: DataTypes.STRING
  }
},{
  timestamps: false,
});

module.exports = {
  employee
};
