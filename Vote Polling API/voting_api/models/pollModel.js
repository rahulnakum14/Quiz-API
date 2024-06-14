const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

/**
 * Poll model.
 *
 * @typedef {object} - poll
 * @property {number} id - The unique identifier for the poll.
 * @property {string} pollName - The Name of the poll.
 * @property {string} pollChoices - The choice of the polls.
 */
const poll = sequelize.define(
  "poll",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pollName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pollChoices: {
      type: DataTypes.STRING,
      get() {
        return JSON.parse(this.getDataValue("pollChoices"));
      },
      set(val) {
        return this.setDataValue("pollChoices", JSON.stringify(val));
      },
    },
    
  },
  {
    indexes: [{ fields: ["pollName"] }],
    timestamps: false,
    hooks: {
      beforeValidate: (poll, options) => {
        if (poll.title || poll.description) {
          poll.pollName = poll.pollName.trim();
          poll.pollChoices = poll.pollChoices.trim();
        }
      },
    },
  }
);

module.exports = {
  poll,
};
