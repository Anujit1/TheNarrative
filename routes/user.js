const { Router } = require('express');
const USER = require('../models/user');
const { createUserToken } = require('../services/authentication');
const router = Router();

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',       // or 'strict'
  secure: false,         // set true in production (HTTPS)
  path: '/',             // match on clearCookie
  maxAge: 60 * 60 * 1000 // 1h
};

// GET signup
router.get('/signup', (req, res) => res.render('signup'));

// POST signup → auto signin
router.post('/signup', async (req, res) => {
  try {
    const { fullname, gender, email, password } = req.body;
    const user = await USER.create({ fullname, gender, email, password });
    const token = createUserToken(user);
    return res.cookie('token', token, cookieOpts).redirect('/');
  } catch (err) {
    // handle duplicate email, etc.
    const msg = err.code === 11000 ? 'Email already in use' : 'Signup failed';
    return res.status(400).render('signup', { err: msg });
  }
});

// GET signin
router.get('/signin', (req, res) => res.render('signin'));

// POST signin
router.post('/signin', async (req, res) => {
  try {
    const user = await USER.findByCredentials(req.body.email, req.body.password);
    const token = createUserToken(user);
    return res.cookie('token', token, cookieOpts).redirect('/');
  } catch (err) {
    return res.status(400).render('signin', { err: err.message });
  }
});

// SIGNOUT (prefer POST; GET shown for now)
router.get('/signout', (req, res) => {
  res.clearCookie('token', { ...cookieOpts, maxAge: undefined }); // options must match
  return res.redirect('/');
});

module.exports = router;
