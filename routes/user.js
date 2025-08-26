const { Router } = require('express');
const USER = require('../models/user');
const router = Router();
const { createUserToken } = require('../services/authentication')


// signup
router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post('/signup', async (req, res) => {
  console.log(req.body); // test

  const {fullname, gender,email, password} = req.body;

  await USER.create({
    fullname,
    gender,
    email,
    password
  });

  return res.redirect('/');
});


// signin
router.get('/signin', (req, res) => {
  return res.render('signin');
});

// controllers/user.js
router.post('/signin', async (req, res, next) => {
  try {
    const user = await USER.findByCredentials(req.body.email, req.body.password);
    const token = createUserToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    }).redirect('/');

  } catch (err) {    
    return res.render('signin', { err: err.message });
  }
});


// signout
router.post('/signout', (req, res) => {

  // home
  return res.redirect('/');
})


module.exports = router;