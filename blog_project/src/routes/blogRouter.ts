import { Router } from "express";
import { BlogController } from "../controllers/blogController";
import AuthMiddleware from "../middleware/auth";
import { validate } from "../middleware/vaidate";
import { blogSchema } from "../schema/blogSchema";

const blogRouter: Router = Router();
const blogController = new BlogController();

/**
 * Routes For Blogs.
 * @name GET / - Get All Blogs.
 * @name POST / - Create A Blog.
 * @name PUT /:id - Update A Blog
 * @name DELETE /:id - Delete A Blog.
 */
blogRouter.get("/", blogController.getBlog);
blogRouter.post(
  "/create",
  validate(blogSchema),
  AuthMiddleware.authenticateToken,
  blogController.createBlog
);
blogRouter.put(
  "/update/:id",
  validate(blogSchema),
  AuthMiddleware.authenticateToken,
  blogController.updateBlog
);
blogRouter.delete(
  "/delete/:id",
  AuthMiddleware.authenticateToken,
  blogController.deleteBlog
);

export { blogRouter };
