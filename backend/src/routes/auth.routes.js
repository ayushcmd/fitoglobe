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

router.get("/google", checkGoogleConfigured, passport.authenticate("google", { scope:["profile","email"], session:false }));
router.get("/google/callback",
  checkGoogleConfigured,
  passport.authenticate("google", { session:false, failureRedirect:`${frontendBase}/login?error=oauth` }),
  googleCallback
);

module.exports = router;
