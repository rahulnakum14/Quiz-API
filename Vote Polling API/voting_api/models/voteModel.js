const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

/**
 * Vote model.
 *
 * @typedef {object} - vote
 * @property {number} id - The unique identifier for the vote.
 * @property {string} pollId - The pollId of the poll which user voted.
 * @property {string} choice - The choice to which user voted.
 * @property {string} count - The total count of votes
 * @property {string} votedBy - The user id which voted to the given choice
 */
const vote = sequelize.define('vote', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    choice: {
      type: DataTypes.STRING,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 
    },
    votedBy:{
      type: DataTypes.STRING,
      get() {
        return JSON.parse(this.getDataValue("votedBy"));
      },
      set(val) {
        return this.setDataValue("votedBy", JSON.stringify(val));
      },
    }
  },{
    indexes:[{fields:["pollId"]}],
    timestamps:false
  });
  
module.exports = {
    vote
};
