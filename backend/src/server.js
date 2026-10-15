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
const HOST = process.env.HOST || "0.0.0.0";

// ── Security & Parsing ────────────────────────────────────
app.use(helmet());

const configuredFrontend = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
const allowedOrigins = [
  configuredFrontend,
  "https://fitoglobe.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalized) || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
      return callback(null, true);
    }
    return callback(null, true);
  },
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

// ── Health Check ──────────────────────────────────────────
app.get("/health", async (req, res) => {
  let dbStatus = "connected";
  let dbDetails = null;

  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Database ping timeout")), 2000)),
    ]);
  } catch (err) {
    dbStatus = "disconnected";
    dbDetails = err.message?.includes("not found")
      ? "Supabase database paused or unreachable"
      : "Database connection failed";
  }

  const isHealthy = dbStatus === "connected";
  res.status(200).json({
    status: isHealthy ? "ok" : "degraded",
    service: "FitoGlobe API",
    database: dbStatus,
    ...(dbDetails && { details: dbDetails }),
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth",      authRouter);
app.use("/api/user",      userRouter);
app.use("/api/workouts",  workoutRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/progress",  progressRouter);
app.use("/api/ai",        aiRouter);

// ── Error Handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────
async function start() {
  const server = app.listen(PORT, HOST, () => {
    console.log(`\n  FITOGLOBE API`);
    console.log(`  Running on http://${HOST}:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || "production"}\n`);
  });

  try {
    await prisma.$connect();
    console.log("✓ Database connected");
  } catch (err) {
    console.error("⚠ Warning: Database connection failed on startup:");
    console.error(`  ${err.message}`);
    console.error("  Server is listening, but database is currently unreachable (e.g. Supabase paused).\n");
  }

  return server;
}

start();

module.exports = app;
