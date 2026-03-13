const express = require("express");
const { getSessions, createSession, deleteSession, getExercises } = require("../controllers/workout.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.use(protect);
router.get("/exercises", getExercises);
router.get("/",          getSessions);
router.post("/",         createSession);
router.delete("/:id",    deleteSession);

module.exports = router;
