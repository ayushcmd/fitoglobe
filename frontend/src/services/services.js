import api from "./api";

// ─── WORKOUT SERVICE ──────────────────────────────────────
export const workoutService = {
  getSessions:  (page = 1)     => api.get(`/workouts?page=${page}`).then(r => r.data),
  createSession: (data)        => api.post("/workouts", data).then(r => r.data),
  deleteSession: (id)          => api.delete(`/workouts/${id}`).then(r => r.data),
  getExercises:  (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/workouts/exercises?${params}`).then(r => r.data);
  },
};

// ─── NUTRITION SERVICE ────────────────────────────────────
export const nutritionService = {
  getLogs:    (date)  => api.get(`/nutrition?date=${date || ""}`).then(r => r.data),
  addLog:     (data)  => api.post("/nutrition", data).then(r => r.data),
  deleteLog:  (id)    => api.delete(`/nutrition/${id}`).then(r => r.data),
  getWeekly:  ()      => api.get("/nutrition/weekly").then(r => r.data),
};

// ─── PROGRESS SERVICE ─────────────────────────────────────
export const progressService = {
  getLogs: ()     => api.get("/progress").then(r => r.data),
  addLog:  (data) => api.post("/progress", data).then(r => r.data),
};

// ─── AI SERVICE ───────────────────────────────────────────
export const aiService = {
  chat: (message, conversationId) =>
    api.post("/ai/chat", { message, conversationId }).then(r => r.data),
  getConversations: () =>
    api.get("/ai/conversations").then(r => r.data),
  getMacros: (food, quantity) =>                                    // ← add this
    api.post("/ai/macros", { food, quantity }).then(r => r.data),
  scanFood: (imageBase64, mimeType) =>
    api.post("/ai/scan", { imageBase64, mimeType }).then(r => r.data),
  fitoChat: (message) =>
    api.post("/ai/fitochat", { message }).then(r => r.data),
};

// ─── USER SERVICE ─────────────────────────────────────────
export const userService = {
  getStats:      ()     => api.get("/user/stats").then(r => r.data),
  updateProfile: (data) => api.put("/user/profile", data).then(r => r.data),
};
