/**
 * Interface representing attributes of a user.
 * @interface UserAttributes
 * @property {number} id - The unique identifier of the file.
 * @property {string} shortenUrl - The shortenUrl of the uploaded file.
 * @property {string} password - The password of the shorten url.
 * @property {any} createdBy - The authour id of the uploaded file.
 */

interface FileAttributes {
  id: number;
  path: string;
  shortenUrl: string;
  password: string;
  createdBy: number;
}

export default FileAttributes;