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
router.get("/google", passport.authenticate("google", { scope:["profile","email"], session:false }));
router.get("/google/callback",
  passport.authenticate("google", { session:false, failureRedirect:`${process.env.FRONTEND_URL}/login?error=oauth` }),
  googleCallback
);

module.exports = router;
