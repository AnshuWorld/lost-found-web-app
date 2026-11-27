const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    (process.env.RENDER_EXTERNAL_URL
      ? `${process.env.RENDER_EXTERNAL_URL}/api/auth/google/callback`
      : 'http://localhost:5000/api/auth/google/callback');

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value || '';
          const name = profile.displayName || '';

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
          done(null, { token, user: tokenPayload });
        } catch (err) {
          console.error('Google strategy error:', err);
          done(err, null);
        }
      }
    )
  );
} else {
  console.warn('Google OAuth disabled: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set.');
}

passport.serializeUser((obj, done) => done(null, obj));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
