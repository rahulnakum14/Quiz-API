import { Request, Response } from "express";
import User from "../db/models/userModel";
import { generateToken } from "../services/jwt";
import UserAttributes from "../types/userType";
import logger from "../services/logger";
import {
  sendErrorResponse,
  successResponse,
} from "../services/responseHandler";
import bcrypt from "bcrypt";

export class UserController {
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
        sendErrorResponse(
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
        sendErrorResponse(res, 404, "Email or Username Is Already Exists..");
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      logger.info("user registered successfully..");
      successResponse(res, 200, "User Is register SuccessFully.", result);
    } catch (error) {
      console.log(error);

      logger.fatal("Internal Server Error registerUser.");
      sendErrorResponse(res, 500, "Internal Server Error from registerUser");
      return;
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
        sendErrorResponse(
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
        sendErrorResponse(res, 404, "Invalid email or password..");
      }

      const isMatch = await bcrypt.compare(password, isUserExist.password);

      if (isMatch) {
        const token = generateToken(isUserExist);
        logger.info("user Login successfully..");
        successResponse(res, 200, "User is Successfully Logged IN..", token);
      } else {
        logger.warn("Invalid email or password.. user not found");
        sendErrorResponse(res, 404, "Invalid email or password..");
      }
    } catch (error) {
      logger.fatal("Internal Server Error.");
      sendErrorResponse(res, 500, "Internal Server Error");
      return;
    }
  }
}
