const passport = require("passport");

const isAuthenticated = [
  passport.authenticate('jwt', { session: false }),
  (req, req_, next) => {
    if (req.user) {
      console.log("user: ",req.user);
      next();
    } else {
      console.log('No user found');
    }
  }
];

module.exports = {isAuthenticated}