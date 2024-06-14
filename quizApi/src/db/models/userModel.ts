import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import userAttributes from "../../types/userTypes";

/**
 * Blog model class representing a QuizExpire in the database.
 */
class User extends Model<userAttributes> {
  public id!: number;
  public name!: string;
}

/**
 * Initialize the QuizExpire model with attributes and options.
 */
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
    modelName: 'users',
    timestamps: false,
  }
);

export default User;
