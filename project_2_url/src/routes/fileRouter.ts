import { Router } from "express";
import { FileController } from "../controllers/fileController"; 
import upload from "../services/fileUpload";

const fileRouter: Router = Router();
const filecontroller = new FileController(); 

/**
 * Routes For File.
 * @name GET / - Display the password page to access file.
 * @name POST / - Upload a file.
 */
fileRouter.get("/",filecontroller.fileUploadGet); 
fileRouter.post("/",upload.single('file'),filecontroller.fileUploadPost); 

export { fileRouter };