const passport = require("passport");
const prisma = require("./db");

// Only initialize Google OAuth if real credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "placeholder") {
  const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error("No email from Google"), null);

      // Find or create user
      let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

      if (!user) {
        // Check if email already exists
        user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          // Link Google account to existing email user
          user = await prisma.user.update({
            where: { email },
            data: { googleId: profile.id, isVerified: true, avatar: profile.photos?.[0]?.value },
          });
        } else {
          // New user via Google
          user = await prisma.user.create({
            data: {
              email,
              name:       profile.displayName,
              googleId:   profile.id,
              avatar:     profile.photos?.[0]?.value,
              isVerified: true,
            },
          });
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

module.exports = passport;