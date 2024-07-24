import { Model, DataTypes } from "sequelize";
import {sequelize} from "./index";
import User from "./userModel";
import FileAttributes from "../../../types/fileType";

/**
 * File model class representing a file in the database.
 */
class File extends Model<FileAttributes> {
  public id!: number;
  public path!: string;
  public shortenUrl!: string;
  public password!: string;
  public createdBy!: number;

  // Define associations
  static associate() {
    File.belongsTo(User, {
      foreignKey: "createdBy",
    });
  }
}

/**
 * Initialize the File model with attributes and options.
 */
File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortenUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "File",
  }
);

export default File;
