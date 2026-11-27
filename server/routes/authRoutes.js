const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const passport = require('passport');

router.post('/signup', signup);
router.post('/login', login);

const ensureGoogleConfigured = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({
      message: 'Google OAuth is not configured on the server (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET).',
    });
  }
  next();
};

// Google OAuth routes
router.get(
  '/google',
  ensureGoogleConfigured,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  ensureGoogleConfigured,
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}` }),
  (req, res) => {
    const token = req.user.token;
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
    res.redirect(`${clientUrl}?token=${token}`);
  }
);

module.exports = router;
