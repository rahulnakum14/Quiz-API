const express = require("express");
const userRouter = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const { createUserValidator } = require("../validators/userValidator");
const passport = require("../utills/passport-config");

/**
 * Routes For User register & login..
 * @name POST /register
 * @name POST /login
 */

userRouter.post("/register", createUserValidator, registerUser);
userRouter.post("/login", createUserValidator, loginUser);
userRouter.get("/logout", logoutUser);

module.exports = {
  userRouter,
};
