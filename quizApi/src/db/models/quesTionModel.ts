import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import quizAttributes from "../../types/quizType";


class Question extends Model<quizAttributes> {
    public id!: number;
    public quizId!: number;
    public question!: any;
    public ans!: any;
    public expirationTime!: any;
  }

  
Question.init(
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
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ans: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expirationTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'questions',
      sequelize,
      modelName: 'question',
      timestamps: false,
    }
  );
  
  export default Question;