const { check, validationResult } = require("express-validator");

const pollValidator = [
  check("pollName")
    .trim()
    .escape()
    .custom(value =>{
        if(!value.trim()){
            throw new Error('PollName should not be empty')
        }
        return true;
    })
    .withMessage("Poll Name should not be empty.")
    .bail()
    .isLength({ min: 5, max: 10 })
    .withMessage("Poll Name should be between 5 to 10 characters.")
    .bail()
    .custom(value =>{
        if (value.match(/\d/)) {
            throw new Error("Poll Name must not contain any digits.");
        }
        return true;
    })
    .withMessage("Poll Name must not contain any digits.")
    .bail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgs = errors.array().map(error => error.msg).join("; ");
      return res.status(422).json({ msg: errorMsgs });
    }
    next();
  },
];

const pollChoicesValidator = [
    check("pollChoices")
      .isArray({ min: 1 })
      .withMessage("At least one poll choice is required.")
      .bail()
      .custom((value) => {
        if (value.includes("")) {
          throw new Error("Poll choice should not be empty.");
        }
        return true;
      })
      .withMessage("Poll choice should not be empty.")
      .bail()
      .custom((value) => {
        if (value.some(choice => choice.match(/\d/))) {
          throw new Error("Poll choice must not contain any digits.");
        }
        return true;
      })
      .withMessage("Poll choice must not contain any digits."),
    
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
  pollValidator,
  pollChoicesValidator
};
