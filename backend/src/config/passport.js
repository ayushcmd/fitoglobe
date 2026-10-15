const passport = require("passport");
const prisma = require("./db");

const getGoogleCallbackURL = () => {
  if (process.env.GOOGLE_CALLBACK_URL && process.env.GOOGLE_CALLBACK_URL.trim()) {
    return process.env.GOOGLE_CALLBACK_URL.trim();
  }
  // Automatically fallback to Render service URL if available
  if (process.env.RENDER_EXTERNAL_URL) {
    return `${process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "")}/api/auth/google/callback`;
  }
  return "https://fitoglobe-backend-ko63.onrender.com/api/auth/google/callback";
};

// Only initialize Google OAuth if real credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "placeholder") {
  const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
  const callbackURL = getGoogleCallbackURL();
  const hasSecret = Boolean(process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET !== "placeholder");
  const rawClientId = process.env.GOOGLE_CLIENT_ID || "";
  const maskedClientId = rawClientId.length > 16
    ? `${rawClientId.substring(0, 8)}...${rawClientId.substring(rawClientId.length - 8)}`
    : "(configured)";

  console.log(`✓ Google OAuth initialized:`);
  console.log(`  - Client ID: ${maskedClientId}`);
  console.log(`  - Client Secret: ${hasSecret ? "Configured" : "MISSING"}`);
  console.log(`  - Callback URL: ${callbackURL}`);

  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  callbackURL,
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
              name:       profile.displayName || profile.name?.givenName || email.split("@")[0],
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
} else {
  console.log(`⚠ Google OAuth NOT initialized: GOOGLE_CLIENT_ID is missing or placeholder.`);
}

passport.getGoogleCallbackURL = getGoogleCallbackURL;

module.exports = passport;