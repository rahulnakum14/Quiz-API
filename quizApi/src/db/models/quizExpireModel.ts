import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import quizAttributes from "../../types/quizType";

/**
 * Blog model class representing a QuizExpire in the database.
 */
class QuizExpiration extends Model<quizAttributes> {
  public id!: number;
  public quizId!: number;
  public quizExpirationTime!: string;
}

/**
 * Initialize the QuizExpire model with attributes and options.
 */
QuizExpiration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quizId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'quizs',
        key: 'id',
      },
    },
    quizExpirationTime: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
  },
  {
    tableName: 'quizExpirations',
    sequelize,
    modelName: 'quizExpiration',
    timestamps: false,
  }
);

export default QuizExpiration;
