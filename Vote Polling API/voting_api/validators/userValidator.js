const { check, validationResult } = require("express-validator");

/** Validating User Data */

const createUserValidator = [
  check("email")
    .trim()
    .escape()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .not()
    .escape()
    .isEmpty()
    .withMessage("Password should not be empty.")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMsgs = errors.array().map(error => error.msg).join("; ");
        return res.status(422).json({ msg: errorMsgs });
      }
      next();
    },
];

module.exports = {
  createUserValidator,
};
