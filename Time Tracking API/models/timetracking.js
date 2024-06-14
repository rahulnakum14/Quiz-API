const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const moment = require('moment');

const timetracking = sequelize.define(
  'timetracking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    empId: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    timeIn: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    timeOut: {
      allowNull: true,
      type: DataTypes.TIME,
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeValidate: (timetracking, options) => {
        if (!timetracking.date) {
          timetracking.date = moment.utc().format('YYYY-MM-DD');
        }
      },
    },
  }
);

module.exports = {
  timetracking,
};
