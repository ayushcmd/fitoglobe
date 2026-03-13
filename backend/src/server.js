require("dotenv").config();
const express     = require("express");
const cors        = require("cors");
const helmet      = require("helmet");
const morgan      = require("morgan");
const rateLimit   = require("express-rate-limit");
const passport    = require("./config/passport");
const prisma      = require("./config/db");

const authRouter     = require("./routes/auth.routes");
const userRouter     = require("./routes/user.routes");
const workoutRouter  = require("./routes/workout.routes");
const { nutritionRouter, progressRouter, aiRouter } = require("./routes/other.routes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & Parsing ────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(passport.initialize());

// ── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max:      100,
  message:  { success:false, message:"Too many requests, please try again later" },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success:false, message:"Too many auth attempts" },
});

app.use("/api", limiter);
app.use("/api/auth/login",           authLimiter);
app.use("/api/auth/signup",          authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth",      authRouter);
app.use("/api/user",      userRouter);
app.use("/api/workouts",  workoutRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/progress",  progressRouter);
app.use("/api/ai",        aiRouter);

// ── Health Check ──────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status:"ok", service:"FitoGlobe API", timestamp: new Date().toISOString() });
});

// ── Error Handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────
async function start() {
  try {
    await prisma.$connect();
    console.log("✓ Database connected");

    app.listen(PORT, () => {
      console.log(`\n  FITOGLOBE API`);
      console.log(`  Running on http://localhost:${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV}\n`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();

module.exports = app;
