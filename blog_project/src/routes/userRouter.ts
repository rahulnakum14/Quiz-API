import { Router } from "express";
import { UserController } from "../controllers/userController";
import { userSchema } from "../schema/userSchema";
import { validate } from "../middleware/vaidate";
const userRouter: Router = Router();
const userController = new UserController();

/**
 * Routes For User.
 * @name POST /signup - Create A new user.
 * @name POST /login - Login A new user.
 */
userRouter.post("/signup", validate(userSchema), userController.registerUser);
userRouter.post("/login", validate(userSchema), userController.loginUser);

export { userRouter };
