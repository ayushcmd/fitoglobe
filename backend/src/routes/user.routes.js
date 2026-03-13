// ─── user.routes.js ───────────────────────────────────────
const express = require("express");
const { completeOnboarding, updateProfile, getUserStats } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.use(protect);
router.put("/onboarding", completeOnboarding);
router.put("/profile",    updateProfile);
router.get("/stats",      getUserStats);

module.exports = router;
