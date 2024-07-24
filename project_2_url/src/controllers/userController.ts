import { Request, Response } from "express";
import User from "../config/db/models/userModel";
import { generateToken } from "../services/jwt";
import UserAttributes from "../types/userType";
import logger from "../services/logger";
import {
  sendErrorResponse,
  successResponse,
} from "../services/responseHandler";
import File from "../config/db/models/fileModel";
import bcrypt from "bcrypt";

export class UserController {
  /**
   * Displays The login Page to the user.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} A promise resolving to the response.
   */
  async loginUserGet(req: Request, res: Response): Promise<Response> {
    try {
      res.render("login");
    } catch (error) {
      logger.fatal("Internal Server Error.");
      return sendErrorResponse(res, 500, "Internal Server Error");
    }
  }

  /**
   * Displays The Signup Page to the user.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} A promise resolving to the response.
   */
  async signupUserGet(req: Request, res: Response): Promise<Response> {
    try {
      res.render("signup");
    } catch (error) {
      logger.fatal("Internal Server Error.");
      return sendErrorResponse(res, 500, "Internal Server Error");
    }
  }

  /**
   * Register A New User
   *
   * @param {Object} req -  The Request Object
   * @param {Object} res - A JSON response indicating success or failure based on validation.
   * @param {string} req.body.username - The username of the user.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @return {*}  {Promise<Response>}
   * @memberof UserController
   */
  async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password }: UserAttributes = req.body;

      if (!email || !password || !username) {
        logger.error("Please provide username, email, and password");
        return sendErrorResponse(
          res,
          400,
          "Please provide username, email, and password"
        );
      }

      const isExists = await User.findOne({
        where: {
          email,
          username,
        },
      });

      if (isExists) {
        logger.warn("Email or Username Is Already Exists..");
        return sendErrorResponse(
          res,
          404,
          "Email or Username Is Already Exists.."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      logger.info("user registered successfully..");
      return successResponse(
        res,
        200,
        "User Is register SuccessFully.",
        result
      );
    } catch (error) {
      logger.fatal("Internal Server Error.");
      return sendErrorResponse(res, 500, "Internal Server Error");
    }
  }

  /**
   * Login A New User.
   *
   * @param {Object} req -  The Request Object
   * @param {Object} res - A JSON response indicating success or failure based on validation.
   * @param {string} req.body.username - The username of the user.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @return {*}  {Promise<Response>}
   * @memberof UserController
   */
  async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password }: UserAttributes = req.body;

      if (!email || !password || !username) {
        logger.error("Please provide username, email, and password for login");
        return sendErrorResponse(
          res,
          400,
          "Please provide username, email, and password"
        );
      }

      const isUserExist = await User.findOne({
        where: {
          username,
          email,
        },
      });

      if (!isUserExist) {
        logger.warn("Invalid email or password.. user not found");
        return sendErrorResponse(res, 404, "Invalid email or password..");
      }

      const isMatch = await bcrypt.compare(password, isUserExist.password);

      if (isMatch) {
        const token = generateToken(isUserExist);
        logger.info("user Login successfully..");
        res.cookie("token", token).redirect("/upload");
      } else {
        logger.warn("Invalid email or password.. user not found");
        return sendErrorResponse(res, 404, "Invalid email or password..");
      }
    } catch (error) {
      logger.fatal("Internal Server Error.");
      return sendErrorResponse(res, 500, "Internal Server Error");
    }
  }

  /**
   * Handles the GET request to display the password entry form for accessing a file.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} A promise resolving to the response.
   */
  async shortenUrlget(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (req.params.id) {
        const result = await File.findOne({
          where: {
            shortenUrl: "http://localhost:3000/user/files/" + id,
          },
        });
        if (!result) {
          return sendErrorResponse(res, 400, "File Not Found");
        }
        res.render("enterPassword", { id });
      }
    } catch (error) {
      logger.fatal("Internal Server Error.");
      return sendErrorResponse(res, 500, "Internal Server Error");
    }
  }

  /**
   * Handles the POST request to validate the password and display the file.
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {number} req.body.id - The id of the file.
   * @param {string} req.body.data - The password of the shared file.
   * @returns {Promise<Response>} A Promise that resolves to the Express Response object.
   */
  async shortenUrlpost(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const data = req.body;

      const result = await File.findOne({
        where: {
          shortenUrl: "http://localhost:3000/user/files/" + id,
        },
      });
      if (!result) {
        logger.warn("File not found");
        return sendErrorResponse(res, 404, "File not found");
      }
      if (result.password === data.password) {
        res.render("displayData", { path: result.path });
      } else {
        logger.warn("Invalid password for accessing file");
        return sendErrorResponse(res, 401, "Invalid password accessing file");
      }
    } catch (error) {
      logger.fatal("Internal Server Error.");
      return sendErrorResponse(res, 500, "Internal Server Error");
    }
  }
}
