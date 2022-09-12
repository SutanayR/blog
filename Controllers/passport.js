
const passport = require('passport');
const GooogleStrategy = require('passport-google-oauth20');
const User = require('../Model/userschema');

passport.use('login', new GooogleStrategy({
  callbackURL: 'http://localhost:3000/',
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOne({ email: profile.emails.value });
  if (user) {
    return done(null, user);
  }

  return done(null, false);
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findOne({ id }, (err, user) => {
    done(err, user);
  });
});
const getGoogle = (req, res) => {
  res.send('Hello there');
};

module.exports = { getGoogle };
