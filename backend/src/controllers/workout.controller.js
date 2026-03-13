const prisma = require("../config/db");

// ── GET /api/workouts ─────────────────────────────────────
exports.getSessions = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const sessions = await prisma.workoutSession.findMany({
      where:   { userId: req.user.id },
      orderBy: { completedAt: "desc" },
      take:    Number(limit),
      skip,
      include: { exercises: { include: { exercise: true } } },
    });

    const total = await prisma.workoutSession.count({ where: { userId: req.user.id } });
    res.json({ success:true, sessions, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

// ── POST /api/workouts ────────────────────────────────────
exports.createSession = async (req, res, next) => {
  try {
    const { name, notes, durationMin, caloriesBurned, exercises } = req.body;

    const session = await prisma.workoutSession.create({
      data: {
        userId: req.user.id,
        name, notes,
        durationMin:    durationMin    ? parseInt(durationMin) : null,
        caloriesBurned: caloriesBurned ? parseFloat(caloriesBurned) : null,
        exercises: {
          create: (exercises || []).map(ex => ({
            exerciseId: ex.exerciseId,
            sets:       parseInt(ex.sets),
            reps:       parseInt(ex.reps),
            weightKg:   ex.weightKg ? parseFloat(ex.weightKg) : null,
            notes:      ex.notes || null,
          })),
        },
      },
      include: { exercises: { include: { exercise: true } } },
    });

    res.status(201).json({ success:true, session });
  } catch (err) { next(err); }
};

// ── DELETE /api/workouts/:id ──────────────────────────────
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await prisma.workoutSession.findUnique({ where: { id: req.params.id } });
    if (!session || session.userId !== req.user.id)
      return res.status(404).json({ success:false, message:"Session not found" });

    await prisma.workoutSession.delete({ where: { id: req.params.id } });
    res.json({ success:true, message:"Session deleted" });
  } catch (err) { next(err); }
};

// ── GET /api/workouts/exercises ───────────────────────────
exports.getExercises = async (req, res, next) => {
  try {
    const { muscle, equipment, difficulty, search, lang = "en" } = req.query;

    const exercises = await prisma.exercise.findMany({
      where: {
        ...(muscle    && { muscleGroup: muscle }),
        ...(equipment && { equipment }),
        ...(difficulty && { difficulty }),
        ...(search && {
          OR: [
            { name:    { contains: search, mode:"insensitive" } },
            { nameEs:  { contains: search, mode:"insensitive" } },
          ],
        }),
      },
      orderBy: { name: "asc" },
    });

    // Return name in user's language
    const localized = exercises.map(ex => ({
      ...ex,
      displayName: lang === "es" ? (ex.nameEs || ex.name)
                 : lang === "ja" ? (ex.nameJa || ex.name)
                 : lang === "ko" ? (ex.nameKo || ex.name)
                 : ex.name,
    }));

    res.json({ success:true, exercises: localized });
  } catch (err) { next(err); }
};
