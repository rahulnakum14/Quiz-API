import multer from "multer";
import { Request } from "express";
import path from "path";

/** Storage Configuration for file uploading. */
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uploadDir = path.resolve(__dirname, "../uploads"); 
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

export { upload };
