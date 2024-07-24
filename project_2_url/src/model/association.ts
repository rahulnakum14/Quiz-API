import User from "../config/db/models/userModel";
import File from "../config/db/models/fileModel";

/**
 * many-to-one association between the User and Blog models.
 *
 * @param {object} Blog - The Blog model.
 * @param {object} User - The User model.
 * @param {string} options.foreignKey - The foreign key to use for the association.
 */
File.belongsTo(User, { foreignKey: "createdBy" });

/**
 * one-to-many association between the User and Blog models.
 *
 * @param {object} User - The User model.
 * @param {object} Blog - The Blog model.
 * @param {string} options.foreignKey - The foreign key to use for the association.
 */
User.hasMany(File, { foreignKey: "createdBy" });

export { User, File };
