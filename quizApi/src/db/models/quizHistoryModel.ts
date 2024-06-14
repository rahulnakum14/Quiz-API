import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import quizAttributes from "../../types/quizType";

/**
 * Blog model class representing a QuizExpire in the database.
 */
class QuizHistory extends Model<quizAttributes> {
  public id!: number;
  public quizId!: string;
  public userId!: string;
  public answer!: string;
  public score!: number;
  public questionId!: number;

}

/**
 * Initialize the QuizExpire model with attributes and options.
 */
QuizHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quizId: {
      type: DataTypes.INTEGER,
      references: {
        model: "quizs",
        key: "id",
      },
    },
    questionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "questions",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    answer: {
      type: DataTypes.STRING,
    },
    score: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "quizHistorys",
    sequelize,
    modelName: "quizHistorys",
    timestamps: false,
  }
);

export default QuizHistory;
