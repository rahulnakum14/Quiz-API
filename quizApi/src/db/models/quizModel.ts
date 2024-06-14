import { Model, DataTypes } from "sequelize";
import {sequelize} from "../db";
import quizAttributes from "../../types/quizType";

/**
 * Blog model class representing a Quiz in the database.
 */
class Quiz extends Model<quizAttributes> {
  public id!: number;
  public question!: string;
  public ans!: string;
  expirationTime: any;
}

/**
 * Initialize the Quiz model with attributes and options.
 */
Quiz.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'quizs',
    sequelize,
    modelName: 'quiz',
    timestamps: false,
  }
);

export default Quiz;
