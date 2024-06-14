const { poll } = require("./pollModel");
const { user } = require("./userModel");

const { vote } = require("./voteModel");

/**
 * Establishes a many-to-one association between the user and poll models.
 *
 * @param {object} user - The user model.
 * @param {object} poll - The poll model.
 * @param {string} options.foreignKey - The foreign key to use for the association.
 */
poll.belongsTo(user, { foreignKey: "createdBy" , onDelete: 'cascade', onUpdate:'cascade' });

/**
 * one-to-many association between the user and poll models.
 *
 * @param {object} user - The user model.
 * @param {object} poll - The poll model.
 * @param {string} options.foreignKey - The foreign key to use for the association.
 */
user.hasMany(poll, { foreignKey: "createdBy",onDelete: 'cascade',onUpdate:'cascade' });

/**
 * Establishes a many-to-one association between the vote and poll models.
 *
 * @param {object} vote - The vote model.
 * @param {object} poll - The poll model.
 * @param {string} options.foreignKey - The foreign key to use for the association.
 */
vote.belongsTo(poll,{foreignKey: "pollId", onDelete:'cascade', onUpdate:'cascade'})