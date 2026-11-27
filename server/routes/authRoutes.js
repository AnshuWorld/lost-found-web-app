const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const passport = require('passport');

router.post('/signup', signup);
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // req.user contains { token, user }
    const token = req.user.token;
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}?token=${token}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;
