const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const blog = require('../Model/blogshema');
const User = require('../Model/userschema');
const { validator } = require('./authValidator');
// token create
const createToken = (id) => {
  const privateKey = fs.readFileSync('private.pem', 'utf8');
  return jwt.sign({ id }, privateKey, { expiresIn: '1h', algorithm: 'RS512' });
};
// password hashing
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const passWord = await bcrypt.hash(password, salt);
  return passWord;
};

const getHome = (req, res) => {
  res.render('homepage', { title: 'Home' });
};
const getBlogs = async (req, res) => {
  const skip = req.query.p || 0;
  const lim = 3;
  const blogs = await blog.find().sort({ createdAt: -1 }).skip(skip * lim).limit(lim);
  res.render('blogs', { title: 'Blogs', blogs });
};
const getLogin = (req, res) => {
  res.render('login', { title: 'login' });
};
const postBlog = async (req, res) => {
  const B = await blog.create(req.body);
  res.send(B);
};
const getDetails = async (req, res) => {
  const B = await blog.findById(req.params.id);
  res.render('details', { title: 'details page', blog: B });
};
const deleteBlog = async (req, res) => {
  await blog.deleteOne({ id: req.params.id });
  res.json({ redirect: '/' });
};
const addBlog = (req, res) => {
  res.render('postBlog', { title: 'Add Blog' });
};
const getSignup = (req, res) => {
  res.render('signup', { title: 'Sign up' });
};
const postSignup = async (req, res) => {
  const { email } = req.body;
  let { password } = req.body;
  const { number } = req.body;
  const authResult = await validator(email, password, number);
  if (authResult === true) {
    password = await hashPassword(password); let flag = true;
    const user = await User.create({ email, password, number }).catch(() => {
      const resp = {
        istrue: false,
        email: 'This email exists!',
        password: '',
        number: '',
      };
      res.json({ resp });
      flag = false;
    });
    if (flag) {
      const token = createToken(user._id);
      res.cookie('jwt', token, { maxAge: 1000 * 60 * 60, httpOnly: true });
      const resp = {
        istrue: true,
        email,
        password,
        number,
      };
      res.json({ resp });
    }
  } else {
    const resp = {
      istrue: false,
      email: authResult.email,
      password: authResult.password,
      number: authResult.number,
    };
    res.json({ resp });
  }
  //   res.send('done');
};
const postLogin = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  const user = await User.findOne({ email });
  const msg = { email: '', password: '' };
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const token = createToken(user._id);
      res.cookie('jwt', token, { maxAge: 1000 * 60 * 60, httpOnly: true });
    } else {
      msg.password = 'Wrong password';
    }
  } else {
    msg.email = 'wrong Email';
  }
  res.json({ msg });
};
const getLogout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};

module.exports = {
  // eslint-disable-next-line max-len
  getHome, getBlogs, getLogin, postBlog, addBlog, deleteBlog, getDetails, getSignup, postSignup, postLogin, getLogout,
};
