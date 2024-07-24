import { Model, DataTypes } from "sequelize";
import {sequelize} from "../db";
import UserAttributes from "../../types/userType";
import Blog from "./blogModel";

/**
 * User model class representing a user in the database.
 */
class User extends Model<UserAttributes> {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: any;

  static associate() {
    User.hasMany(Blog, {
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
