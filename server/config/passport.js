// Passport configuration for Google OAuth 2.0
// -------------------------------------------------
// Sets up Passport with the Google strategy, creates/links a user record,
// and generates a JWT that the front‑end can store.

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || '';
        const name = profile.displayName || '';

        // Find user by Google ID or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        if (!user) {
          user = new User({ name, email, googleId });
          await user.save();
        } else if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }

        const tokenPayload = { id: user._id, email: user.email, name: user.name };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Pass the token via the user object
        done(null, { token, user: tokenPayload });
      } catch (err) {
        console.error('Google strategy error:', err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((obj, done) => done(null, obj));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
