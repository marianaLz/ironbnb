const passport = require("passport");
const User = require("../models/User");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (!err) done(null, user);
    else done(err, null);
  });
});

module.exports = passport;
