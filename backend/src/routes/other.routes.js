// ─── nutrition.routes.js ──────────────────────────────────
const express = require("express");
const { getLogs, addLog, deleteLog, getWeekly } = require("../controllers/nutrition.controller");
const { protect } = require("../middleware/auth.middleware");
const r1 = express.Router();
r1.use(protect);
r1.get("/weekly", getWeekly);
r1.get("/",       getLogs);
r1.post("/",      addLog);
r1.delete("/:id", deleteLog);
module.exports = { nutritionRouter: r1 };

// ─── progress.routes.js ───────────────────────────────────
const express2 = require("express");
const { getLogs: getPLogs, addLog: addPLog } = require("../controllers/progress.controller");
const r2 = express2.Router();
r2.use(protect);
r2.get("/",  getPLogs);
r2.post("/", addPLog);
module.exports.progressRouter = r2;

// ─── ai.routes.js ─────────────────────────────────────────
const express3 = require("express");
const { chat, getConversations, getMacros, scanFood, fitoChat } = require("../controllers/ai.controller");
const r3 = express3.Router();
r3.use(protect);
r3.post("/chat",          chat);
r3.get("/conversations",  getConversations);
r3.post("/macros",        getMacros);
r3.post("/scan",          scanFood);
r3.post("/fitochat",      fitoChat);
module.exports.aiRouter = r3;
