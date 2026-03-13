const prisma = require("../config/db");

// ── GET /api/nutrition?date=2024-01-15 ───────────────────
exports.getLogs = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const start = new Date(targetDate.setHours(0,0,0,0));
    const end   = new Date(targetDate.setHours(23,59,59,999));

    const logs = await prisma.nutritionLog.findMany({
      where: { userId: req.user.id, date: { gte: start, lte: end } },
      orderBy: { date: "asc" },
    });

    // Aggregate totals
    const totals = logs.reduce((acc, log) => ({
      calories: acc.calories + log.calories,
      protein:  acc.protein  + log.proteinG,
      carbs:    acc.carbs    + log.carbsG,
      fat:      acc.fat      + log.fatG,
    }), { calories:0, protein:0, carbs:0, fat:0 });

    // Group by meal type
    const grouped = logs.reduce((acc, log) => {
      if (!acc[log.mealType]) acc[log.mealType] = [];
      acc[log.mealType].push(log);
      return acc;
    }, {});

    res.json({ success:true, logs, grouped, totals });
  } catch (err) { next(err); }
};

// ── POST /api/nutrition ───────────────────────────────────
exports.addLog = async (req, res, next) => {
  try {
    const { mealType, foodName, calories, proteinG, carbsG, fatG, quantity, unit, notes } = req.body;

    const log = await prisma.nutritionLog.create({
      data: {
        userId: req.user.id,
        mealType, foodName,
        calories:  parseFloat(calories),
        proteinG:  parseFloat(proteinG  || 0),
        carbsG:    parseFloat(carbsG    || 0),
        fatG:      parseFloat(fatG      || 0),
        quantity:  parseFloat(quantity  || 1),
        unit:      unit  || "serving",
        notes:     notes || null,
      },
    });

    res.status(201).json({ success:true, log });
  } catch (err) { next(err); }
};

// ── DELETE /api/nutrition/:id ─────────────────────────────
exports.deleteLog = async (req, res, next) => {
  try {
    const log = await prisma.nutritionLog.findUnique({ where: { id: req.params.id } });
    if (!log || log.userId !== req.user.id)
      return res.status(404).json({ success:false, message:"Log not found" });

    await prisma.nutritionLog.delete({ where: { id: req.params.id } });
    res.json({ success:true, message:"Log deleted" });
  } catch (err) { next(err); }
};

// ── GET /api/nutrition/weekly ─────────────────────────────
exports.getWeekly = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const logs = await prisma.nutritionLog.findMany({
      where: { userId: req.user.id, date: { gte: sevenDaysAgo } },
      orderBy: { date: "asc" },
    });

    // Group by day
    const byDay = {};
    logs.forEach(log => {
      const day = log.date.toISOString().split("T")[0];
      if (!byDay[day]) byDay[day] = { calories:0, protein:0, carbs:0, fat:0 };
      byDay[day].calories += log.calories;
      byDay[day].protein  += log.proteinG;
      byDay[day].carbs    += log.carbsG;
      byDay[day].fat      += log.fatG;
    });

    res.json({ success:true, weekly: byDay });
  } catch (err) { next(err); }
};
