const { Router } = require('express');
const USER = require('../models/user');
const router = Router();


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

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const result = await USER.matchPassword(email, password);

  /* console.log('User: => ',user);  // test */

  if (!result.status) {
    return res.render('signin', { err: result.err });
  }

  // Set cookie or session with token
  res.cookie("token", result.token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1 hour
  }).redirect('/');  

});


// signout
router.post('/signout', (req, res) => {

  // home
  return res.redirect('/');
})


module.exports = router;