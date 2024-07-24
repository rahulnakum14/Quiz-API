import { Router } from "express";
import { ImageController } from "../controllers/imageController";
import { upload } from "../services/fileUpload";
const imageRouter: Router = Router();
const imageController = new ImageController();

/**
 * Routes For Image.
 * @name POST / - Uploading an image.
 */
imageRouter.post("/", upload.single("image"), imageController.imageController);

export { imageRouter };