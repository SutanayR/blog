const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../Model/userschema');

const publicKey = fs.readFileSync('public.pem', 'utf8');
module.exports.checkUser = async (req, res, next) => {
  const jsontoken = req.cookies.jwt;
  if (jsontoken) {
    jwt.verify(jsontoken, publicKey, { algorithms: ['RS512'] }, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
    // next();
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports.verify = (req, res, next) => {
  const jtoken = req.cookies.jwt;
  if (jtoken) {
    jwt.verify(jtoken, publicKey, { algorithms: ['RS512'] }, (err) => {
      if (err) { res.redirect('/login'); } else { next(); }
    });
  } else {
    res.redirect('/login');
  }
};
module.exports.checkLogin = (req, res, next) => {
  const jtoken = req.cookies.jwt;
  if (jtoken) {
    jwt.verify(jtoken, publicKey, { algorithms: ['RS512'] }, (err) => {
      if (err) { next(); } else { res.redirect('/'); }
    });
  } else { next(); }
};
