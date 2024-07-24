import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validate } from "../middleware/vaidate";
import { userSchema } from "../schema/userSchema";
const userRouter: Router = Router();
const userController = new UserController();

/**
 * Routes For User.
 * @name GET /signup - Display The Login Page.
 * @name GET /login - Display The Signup Page.
 * @name GET /files/:id - Display The Authentication Page for access File.
 * 
 * @name POST /signup - Create A new user.
 * @name POST /login - Login A new user.
 * @name POST /files/:id - Authentication Page for access File.
 */
userRouter.get("/login",userController.loginUserGet);
userRouter.get("/signup",userController.signupUserGet);
userRouter.get("/files/:id",userController.shortenUrlget);

userRouter.post("/signup", validate(userSchema),userController.registerUser);
userRouter.post("/login", validate(userSchema), userController.loginUser);
userRouter.post("/files/:id",userController.shortenUrlpost);


export { userRouter };