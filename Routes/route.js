const express = require('express');

const router = express.Router();
const passport = require('passport');
const { checkUser, verify, checkLogin } = require('../middleware/middleware');
const cont = require('../Controllers/controller');
const pass = require('../Controllers/passport');

router.get('*', checkUser);
router.get('/', cont.get_home);
router.get('/blogs', cont.get_blogs);
router.post('/blogs', cont.post_blog);
router.get('/login', checkLogin, cont.get_login);
router.post('/login', cont.post_login);
router.get('/addblog', verify, cont.addBlog);
router.get('/blogs/:id', verify, cont.get_details);
router.delete('/blogs/:id', cont.delete_blog);
router.get('/signup', cont.get_signup);
router.post('/signup', cont.post_signup);
router.get('/logout', cont.get_logout);
router.get('/googleLogin', checkLogin, passport.authenticate('login', {
  scope: ['profile', 'email'],
}), pass.get_google);
module.exports = router;
