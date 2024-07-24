import { validateToken } from "../services/jwt";
import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from "../services/responseHandler";

/**
 * Middleware to authenticate the provided token in the request headers.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction to pass control to the next middleware.
 * @returns {Promise<void>}
 * @throws {Error} If there's an issue validating the token or if the token is invalid.
 */
class AuthMiddleware {
  async authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token: string | undefined = req.headers["authorization"];
      if (!token) {
        sendErrorResponse(res, 403, "Unauthorized or Token does not exist");
      }
      const tokenSplit = token.split(" ")[1];
      const result = validateToken(tokenSplit);
      
      if (result) {
        req.createdBy = result.id;
        next(); 
      } else {
        sendErrorResponse(res, 403, "Invalid token");
      }
    } catch (error) {
      sendErrorResponse(res, 400, "Invalid token");
    }
  }
}

export default new AuthMiddleware();
