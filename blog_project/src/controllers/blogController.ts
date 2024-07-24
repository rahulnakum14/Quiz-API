import { Request, Response } from "express";
import {
  sendErrorResponse,
  successResponse,
} from "../services/responseHandler";
import logger from "../services/logger";
import Blog from "../db/models/blogModel";
import BlogAttributes from "../types/blogType";
import queryParamsAttributes from "../types/queryParams";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";

export class BlogController {
  async getBlog(req: Request, res: Response): Promise<Response> {
    try {
      const {
        page = "1",
        limit = "10",
        sortBy = "id",
        sortOrder = "ASC",
        search = "",
      }: queryParamsAttributes = req.query;

      const offset =
        (parseInt(page.toString()) - 1) * parseInt(limit.toString());

      const whereClause: WhereOptions = {};

      if (search) {
        whereClause.title = { [Op.like]: `%${search}%` };
      }

      const results = await Blog.findAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: offset,
      });

      if (results.length === 0) {
        logger.warn("No Blogs found.");
        sendErrorResponse(res, 500, "No Blogs found.");
      }

      successResponse(res, 200, results.length, results);
    } catch (error) {
      logger.fatal("Internal Server Error.");
      sendErrorResponse(res, 500, "Internal Server Error");
      return;
    }
  }

  async createBlog(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, imageUrl }: BlogAttributes = req.body;

      if (!title || !description || !imageUrl) {
        logger.error("Please provide title, description, and imageUrl");
        sendErrorResponse(
          res,
          400,
          "Please provide title, description, and imageUrl"
        );
      }

      const newBlog = await Blog.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        createdBy: req.createdBy,
      });
      logger.info("Blog created successfully");
      successResponse(res, 200, "Blog created successfully", newBlog);
    } catch (error) {
      logger.fatal("Internal Server Error.");
      sendErrorResponse(res, 500, error.errors[0].message);
      return;
    }
  }

  async updateBlog(req: Request, res: Response): Promise<Response> {
    try {
      const blogToUpdate = req.params.id;
      const { title, description, imageUrl }: BlogAttributes = req.body;

      if (!title && !description && !imageUrl) {
        logger.error(
          "Please provide title, description, and imageUrl while updates"
        );

        sendErrorResponse(
          res,
          400,
          "Please provide title, description, and imageUrl"
        );
      }

      const blog = await Blog.findOne({
        where: {
          id: blogToUpdate,
          createdBy: req.createdBy,
        },
      });

      if (!blog) {
        logger.warn("Unauthorized Or Blog does not exist..");

        sendErrorResponse(res, 404, "Unauthorized Or Blog does not exist..");
      }

      if (title) {
        blog.title = title;
      }
      if (description) {
        blog.description = description;
      }
      if (imageUrl) {
        blog.imageUrl = imageUrl;
      }

      await blog.save();
      logger.info("Blog updated successfully");
      successResponse(res, 200, "Blog updated successfully", blog);
    } catch (error) {
      logger.fatal("Internal Server Error.");
      sendErrorResponse(res, 500, "Internal Server Error");
      return;
    }
  }

  async deleteBlog(req: Request, res: Response): Promise<Response> {
    try {
      const blogIdToDelete = req.params.id;

      const blogToDelete = await Blog.findOne({
        where: {
          id: blogIdToDelete,
          createdBy: req.createdBy,
        },
      });

      if (!blogToDelete) {
        sendErrorResponse(res, 404, "Unauthorized Or Blog does not exist..");
      }
      logger.warn("Unauthorized Or Blog does not exist..");

      await blogToDelete.destroy();

      logger.info("Blog deleted successfully");

      successResponse(res, 200, "Blog deleted successfully", blogToDelete);
    } catch (error) {
      logger.fatal("Internal Server Error.");
      sendErrorResponse(res, 500, "Internal Server Error");
      return;
    }
  }
}
