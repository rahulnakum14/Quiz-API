/** Middleware to check if user is authenticate or not */

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.createdBy = req.user.id;
    return next();
  }
  return res.json({ msg: "User is not logged in." });
};

module.exports = {
  checkAuthenticated,
};
