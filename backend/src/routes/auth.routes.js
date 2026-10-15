// ─── auth.routes.js ───────────────────────────────────────
const express  = require("express");
const passport = require("../config/passport");
const { signup, login, googleCallback, forgotPassword, resetPassword, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup",          signup);
router.post("/login",           login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);
router.get("/me",               protect, getMe);

// Google OAuth
const checkGoogleConfigured = (req, res, next) => {
  const isConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_ID !== "placeholder" &&
    process.env.GOOGLE_CLIENT_SECRET
  );
  if (!isConfigured) {
    return res.status(503).json({
      success: false,
      message: "Google OAuth is not configured on this server. Please ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are set.",
    });
  }
  next();
};

const frontendBase = (process.env.FRONTEND_URL || "https://fitoglobe.vercel.app").replace(/\/$/, "");

router.get("/google", checkGoogleConfigured, (req, res, next) => {
  const callbackURL = passport.getGoogleCallbackURL ? passport.getGoogleCallbackURL() : process.env.GOOGLE_CALLBACK_URL;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    callbackURL,
  })(req, res, next);
});

router.get("/google/callback",
  checkGoogleConfigured,
  (req, res, next) => {
    const callbackURL = passport.getGoogleCallbackURL ? passport.getGoogleCallbackURL() : process.env.GOOGLE_CALLBACK_URL;
    passport.authenticate("google", {
      session: false,
      callbackURL,
      failureRedirect: `${frontendBase}/auth/callback?error=oauth`,
    })(req, res, next);
  },
  googleCallback
);

module.exports = router;
