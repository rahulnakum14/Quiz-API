import { Model, DataTypes } from "sequelize";
import {sequelize} from "./index";
import UserAttributes from "../../../types/userType";
import File from "./fileModel";

/**
 * User model class representing a user in the database.
 */
class User extends Model<UserAttributes> {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: any;

  static associate() {
    User.hasMany(File, {
      foreignKey: "createdBy",
    });
  }
}

/**
 * Initialize the User model with attributes and options.
 */
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "user",
  }
);

export default User;
