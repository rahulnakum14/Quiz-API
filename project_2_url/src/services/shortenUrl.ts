import { Request } from "express";
import { generate } from "shortid";
import File from "../config/db/models/fileModel";

/**
 * Function for generating a shortened URL for a file upload.
 *
 * @param {Request} req - The Express Request object containing the file information in `req.file` and user information in `req.user`.
 * @param {string} req.body.password - The password of the shortenUrl.
 * @return {Promise<string>} A promise that resolves to the generated shortened URL.
 */
export async function generateShortenedUrl(req: Request): Promise<string> {
  /*Generate a unique ID for the shortened URL and assigning a password*/
  const uniqueId = generate();
  const password = req.body.password;
  const shortenedUrl = "http://localhost:3000/user/files/" + uniqueId;

  /* Create a new entry in the File database table */
  await File.create({
    path: `../../uploads/${req.file.filename}`,
    shortenUrl: shortenedUrl,
    password: password,
    createdBy: req.user.id,
  });

  /* Return the generated shortened URL*/
  return shortenedUrl;
}
