import multer from "multer";
import path from "path";
/**
 * Configuration for disk storage used by multer for file uploads.
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
  /**
   * Defines the destination directory for uploaded files.
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Multer.File} file - The uploaded file object.
   * @param {Function} cb - The callback function to be called with the destination path.
   */
  destination: (req, file, cb) => {
    // Callback with the destination directory path.
    const uploadDir = path.resolve(__dirname, "../uploads"); 
    cb(null, uploadDir);
  },

  /**
   * Defines the filename for the uploaded file.
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Multer.File} file - The uploaded file object.
   * @param {Function} cb - The callback function to be called with the filename.
   */
  filename: (req, file, cb) => {
    // Generate a filename using the current timestamp and original filename.
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//   export const upload = multer({ storage: storage }).single("file");
const upload = multer({ storage: storage });
export default upload;
