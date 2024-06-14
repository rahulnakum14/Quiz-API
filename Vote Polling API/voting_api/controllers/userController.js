const bcrypt = require("bcrypt");
const passport = require("../utills/passport-config");
const { user } = require("../models/userModel");
const jwt = require('jsonwebtoken');

/**
 * Register User.
 *
 * @param {Object} req -  The Request Object
 * @param {Object} res - A JSON response indicating success or failure based on validation.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @return {Object} - User Details.
 */
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 5);
    const isUserExist = await user.findOne({
      where: {
        email: email,
      },
    });

    if (isUserExist) {
      return res.json({ msg: "Email Is already Exists." });
    }
    const newUser = await user.create({
      email: email,
      password: hashPassword,
    });

    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error logging in after registration",
          error: err.message,
        });
      }
      return res.status(201).json({
        message: "User is registered.",
        newUser,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something Went Wrong While Creating A new User",
      error: error.message,
    });
  }
};

/**
 * Login User.
 *
 * @param {Object} req -  The Request Object
 * @param {Object} res - A JSON response indicating success or failure based on validation.
 * @return {Object}  - Token If User is Successfully loggged in.
 */
const loginUser = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error authenticating user:", err);
      return res.status(500).json({
        message: "Error authenticating user",
        error: err.message || "Internal server error", 
      });
    }

    if (!user) {
      const message = info ? info.message : "Invalid credentials";
      return res.status(401).json({ message });
    }

    req.login(user, (err) => {
      if (err) {
        console.error("Error logging in user:", err);
        return res.status(500).json({
          message: "Error logging in user",
          error: err.message || "Internal server error",
        });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
      return res.status(200).json({
        message: "Logged In Successfully",
        user: {
          id: user.id,
          email: user.email,
          token
        },
      });
    });
  })(req, res, next);
};

/**
 * Logout User.
 *
 * @param {Object} req -  The Request Object
 * @param {Object} res - A JSON response indicating success or failure based on validation.
 * @return {Object}  - Destroy user session make them logout.
 */
const logoutUser = async(req,res) =>{
  req.session.destroy();
  return res.json({msg:'User Successfully logged Out.'})
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};
