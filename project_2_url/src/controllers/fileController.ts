import { Request, Response } from "express";
import logger from "../services/logger";
import { generateShortenedUrl } from "../services/shortenUrl";
import {
  sendErrorResponse,
  successResponse,
} from "../services/responseHandler";

export class FileController {
  /**
   * Display the page to user upload files.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @return {*}  {Promise<Response>}
   * @memberof FileController
   */
  async fileUploadGet(req: Request, res: Response): Promise<Response> {
    try {
      res.render("fileUpload");
    } catch (error) {
      logger.fatal("Internal Server Error.");
      return sendErrorResponse(res, 500, error);
    }
  }

  /**
   *Allow Authenticate user to upload a file.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @return {*}  {Promise<Response>}
   * @memberof FileController
   */
async fileUploadPost(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.file) {
      logger.warn("No file uploaded");
      return sendErrorResponse(res, 400, "No file uploaded");
    } else {
      const shortenedUrl = await generateShortenedUrl(req);
      return successResponse(
        res,
        200,
        "File uploaded successfully",
        shortenedUrl
      );
    }
  } catch (error) {
    logger.error(`${error.message}`);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
}
}
