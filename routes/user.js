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
  const user = await USER.matchPassword(email, password);

  /* console.log('User: => ',user);  // test */

  if(!user) {
    return res.render('signin');
  }
  // home
  return res.redirect('/');
});


// signout
router.post('/signout', (req, res) => {

  // home
  return res.redirect('/');
})


module.exports = router;