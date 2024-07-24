import { Model, DataTypes } from "sequelize";
import User from "./userModel";
import {sequelize} from "../db";
import BlogAttributes from "../../types/blogType";

/**
 * Blog model class representing a blog in the database.
 */
class Blog extends Model<BlogAttributes> {
  public id!: number;
  public title!: string;
  public description!: string;
  public imageUrl!: any;
  public createdBy?: any;

  static associate() {
    Blog.belongsTo(User, {
      foreignKey: "createdBy",
    });
  }

}

/**
 * Initialize the Blog model with attributes and options.
 */
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://abc.com/tmp.jpeg",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "blog",
  }
);

export default Blog;
