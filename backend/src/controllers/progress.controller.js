const prisma = require("../config/db");

// ── GET /api/progress ─────────────────────────────────────
exports.getLogs = async (req, res, next) => {
  try {
    const { limit = 30 } = req.query;

    const logs = await prisma.progressLog.findMany({
      where:   { userId: req.user.id },
      orderBy: { date: "desc" },
      take:    Number(limit),
    });

    res.json({ success:true, logs });
  } catch (err) { next(err); }
};

// ── POST /api/progress ────────────────────────────────────
exports.addLog = async (req, res, next) => {
  try {
    const { weightKg, bodyFatPct, chestCm, waistCm, hipsCm, armCm, thighCm, notes } = req.body;

    const log = await prisma.progressLog.create({
      data: {
        userId: req.user.id,
        ...(weightKg   && { weightKg:   parseFloat(weightKg) }),
        ...(bodyFatPct && { bodyFatPct: parseFloat(bodyFatPct) }),
        ...(chestCm    && { chestCm:    parseFloat(chestCm) }),
        ...(waistCm    && { waistCm:    parseFloat(waistCm) }),
        ...(hipsCm     && { hipsCm:     parseFloat(hipsCm) }),
        ...(armCm      && { armCm:      parseFloat(armCm) }),
        ...(thighCm    && { thighCm:    parseFloat(thighCm) }),
        notes,
      },
    });

    // Also update user's current weight
    if (weightKg) {
      await prisma.user.update({
        where: { id: req.user.id },
        data:  { weight: parseFloat(weightKg) },
      });
    }

    res.status(201).json({ success:true, log });
  } catch (err) { next(err); }
};
