const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

/**
 * User model.
 *
 * @typedef {object} - user
 * @property {number} id - The unique identifier for the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 */

const user = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  user,
};
