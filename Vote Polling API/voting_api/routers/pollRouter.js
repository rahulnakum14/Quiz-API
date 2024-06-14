const express = require("express");
const pollRouter = express.Router();
const {
  createPoll,
  getPoll,
  updatePoll,
  deletePoll,
} = require("../controllers/pollController");
const { checkAuthenticated } = require("../middlewares/auth");
const passport = require("../utills/passport-config");
const { pollValidator,pollChoicesValidator } = require("../validators/pollValidator");

/**
 * Routes For Poll..
 * @name get /getpoll -  get polls created by user.
 * @name POST /createpoll - create a new poll.
 * @name put /updatepoll - update a poll
 * @name delete /deletePoll - delete a  poll
 */
pollRouter.get("/getpoll", getPoll);
pollRouter.post("/createpoll",pollValidator,pollChoicesValidator, checkAuthenticated,  passport.authenticate('jwt', { session: false, failureRedirect: '/unauthorized' }),createPoll);
pollRouter.put("/updatepoll",pollValidator, checkAuthenticated,  passport.authenticate('jwt', { session: false, failureRedirect: '/unauthorized' }),updatePoll);
pollRouter.delete("/deletePoll", checkAuthenticated,   passport.authenticate('jwt', { session: false, failureRedirect: '/unauthorized' }),deletePoll);

module.exports = {
  pollRouter,
};
