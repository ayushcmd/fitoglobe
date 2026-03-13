const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const crypto   = require("crypto");
const prisma   = require("../config/db");
const { sendPasswordReset, sendWelcome } = require("../services/email.service");

// ── helpers ──────────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const respond = (res, user, statusCode = 200) => {
  const token = signToken(user.id);
  const { password: _, resetToken: __, resetTokenExp: ___, ...safe } = user;
  res.status(statusCode).json({ success: true, token, user: safe });
};

// ── POST /api/auth/signup ────────────────────────────────
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, language } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ success:false, message:"Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, language: language || "en" },
    });

    await sendWelcome(email, name).catch(() => {}); // non-blocking
    respond(res, user, 201);
  } catch (err) { next(err); }
};

// ── POST /api/auth/login ─────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      return res.status(401).json({ success:false, message:"Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ success:false, message:"Invalid credentials" });

    respond(res, user);
  } catch (err) { next(err); }
};

// ── GET /api/auth/google/callback ────────────────────────
exports.googleCallback = (req, res) => {
  const token = signToken(req.user.id);
  // Redirect to frontend with token — frontend stores it
  const needsOnboarding = !req.user.country;
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&onboarding=${needsOnboarding}`);
};

// ── POST /api/auth/forgot-password ──────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond OK (don't reveal if email exists)
    if (!user) return res.json({ success:true, message:"If that email exists, a reset link was sent" });

    const token    = crypto.randomBytes(32).toString("hex");
    const tokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { email },
      data:  { resetToken: token, resetTokenExp: tokenExp },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordReset(email, user.name, resetUrl);

    res.json({ success:true, message:"If that email exists, a reset link was sent" });
  } catch (err) { next(err); }
};

// ── POST /api/auth/reset-password ───────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExp: { gt: new Date() } },
    });
    if (!user) return res.status(400).json({ success:false, message:"Invalid or expired reset token" });

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data:  { password: hashed, resetToken: null, resetTokenExp: null },
    });

    res.json({ success:true, message:"Password reset successfully" });
  } catch (err) { next(err); }
};

// ── GET /api/auth/me ─────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id:true, name:true, email:true, avatar:true, language:true, country:true, countryName:true, goal:true, height:true, weight:true, age:true, unit:true, createdAt:true },
    });
    res.json({ success:true, user });
  } catch (err) { next(err); }
};
