import { Request, Response, NextFunction } from "express";
import { validateToken } from "../services/jwt";
import logger from "../services/logger";
import { sendErrorResponse } from "../services/responseHandler";

/**
 * Middleware to check for authentication using a token stored in a cookie.
 * @param {string} cookieName - The name of the cookie containing the authentication token.
 * @returns {function} Express middleware function.
 */
export default function checkForAuthentication(cookieName: string) {
  /**
   * Express middleware function to check for authentication using a token stored in a cookie.
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The Express NextFunction callback.
   */
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenCookieValue: string | undefined = req.cookies[cookieName];

    if (!tokenCookieValue) {
      logger.error("Unauthorized or Token does not exist...");
      return sendErrorResponse(res, 403, "Unauthorized or Token does not exist");
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      logger.fatal("Internal Server Error.");
      return sendErrorResponse(res, 500, "Internal Server Error");
    }
    return next();
  };
}
