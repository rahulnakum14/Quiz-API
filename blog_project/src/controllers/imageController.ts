import { Request, Response } from "express";
import {
  sendErrorResponse,
  successResponse,
} from "../services/responseHandler";
import logger from "../services/logger";
import fs from "fs";
import path from "path";

const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
const audioTypes = ["audio/mp3", "audio/wav"];
const videoTypes = ["video/mp4", "video/mkv"];

/**Allow Image to upload based on validation. */
export class ImageController {
  async imageController(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        logger.warn("No image uploaded");
        sendErrorResponse(res, 400, "No image uploaded");
        return;
      } else {
        if (
          imageTypes.includes(req.file.mimetype) &&
          req.file.size <= 10 * 1024 * 1024
        ) {
          successResponse(res, 200, "File uploaded", req.file.filename);
        } else if (
          audioTypes.includes(req.file.mimetype) &&
          req.file.size <= 15 * 1024 * 1024
        ) {
          successResponse(res, 200, "File uploaded", req.file.filename);
        } else if (
          videoTypes.includes(req.file.mimetype) &&
          req.file.size <= 50 * 1024 * 1024
        ) {
          successResponse(res, 200, "File uploaded", req.file.filename);
        } else {
          sendErrorResponse(
            res,
            400,
            "Invalid file type or size exceeds the limit"
          );
        }
      }
    } catch (error) {
      const dirPath = "./uploads";
      deleteFiles(dirPath);
      logger.fatal("Internal Server Error.");
      sendErrorResponse(res, 500, "Internal Server Error");
    }
  }
}

/**Delete the most recent file if error occured in catch block. */
function deleteFiles(dirPath: string): void {
  function getMostRecentFile(dir: string): string | undefined {
    const files = orderRecentFiles(dir);
    return files.length ? files[0].file : undefined;
  }

  function orderRecentFiles(dir: string) {
    return fs
      .readdirSync(dir)
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({
        file,
        mtime: fs.lstatSync(path.join(dir, file)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  }

  const mostRecentFile = getMostRecentFile(dirPath);
  if (mostRecentFile) {
    const filePath = path.join(dirPath, mostRecentFile);
    fs.unlinkSync(filePath);
    logger.warn("dewleted files of the most recent",filePath);
  } else {
    console.log(`No files found in directory: ${dirPath}`);
  }
}
