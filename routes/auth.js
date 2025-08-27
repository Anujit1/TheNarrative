const { Router } = require('express');
const router = Router();
const { handleUserSignup, handleUserSignin, handleUserSignout } = require('../controllers/auth')


// GET signup
router.get('/signup', (req, res) => res.render('signup'));

// POST signup → auto signin
router.post('/signup', handleUserSignup);


// GET signin
router.get('/signin', (req, res) => res.render('signin'));

// POST signin
router.post('/signin', handleUserSignin);


// SIGNOUT (prefer POST; GET shown for now)
router.post('/signout', handleUserSignout);


module.exports = router;
