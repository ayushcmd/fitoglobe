const prisma = require("../config/db");

// ── PUT /api/user/onboarding ─────────────────────────────
exports.completeOnboarding = async (req, res, next) => {
  try {
    const { country, countryName, countryDiet, height, weight, age, unit, goal, language } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data:  { country, countryName, countryDiet, height: parseFloat(height), weight: parseFloat(weight), age: parseInt(age), unit, goal, language },
      select: { id:true, name:true, email:true, country:true, countryName:true, countryDiet:true, height:true, weight:true, age:true, unit:true, goal:true, language:true },
    });

    res.json({ success:true, user });
  } catch (err) { next(err); }
};

// ── PUT /api/user/profile ────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, height, weight, age, unit, language } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data:  {
        ...(name   && { name }),
        ...(height && { height: parseFloat(height) }),
        ...(weight && { weight: parseFloat(weight) }),
        ...(age    && { age:    parseInt(age) }),
        ...(unit   && { unit }),
        ...(language && { language }),
      },
      select: { id:true, name:true, email:true, height:true, weight:true, age:true, unit:true, language:true },
    });

    res.json({ success:true, user });
  } catch (err) { next(err); }
};

// ── GET /api/user/stats ──────────────────────────────────
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [workoutCount, nutritionCount, progressCount, latestProgress] = await Promise.all([
      prisma.workoutSession.count({ where: { userId, completedAt: { gte: thirtyDaysAgo } } }),
      prisma.nutritionLog.count({ where: { userId, date: { gte: thirtyDaysAgo } } }),
      prisma.progressLog.count({ where: { userId } }),
      prisma.progressLog.findFirst({ where: { userId }, orderBy: { date: "desc" } }),
    ]);

    res.json({
      success: true,
      stats: { workoutsThisMonth: workoutCount, nutritionLogs: nutritionCount, totalCheckIns: progressCount, latestWeight: latestProgress?.weightKg || null },
    });
  } catch (err) { next(err); }
};
