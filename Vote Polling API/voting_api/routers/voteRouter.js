const express = require("express");
const voteRouter = express.Router();
const {
  voteChoices,
  getVotes,
} = require("../controllers/voteController");
const passport = require("../utills/passport-config");

/**
 * Routes For Voting..
 * @name get /:id getVotes Result
 * @name post /:id  Vote to the choices
 */

voteRouter.get("/", getVotes);
voteRouter.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/unauthorized",
  }),
  voteChoices
);

module.exports = {
  voteRouter,
};
