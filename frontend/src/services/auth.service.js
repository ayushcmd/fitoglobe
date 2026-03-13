import api from "./api";

export const authService = {
  signup: async (name, email, password, language = "en") => {
    const res = await api.post("/auth/signup", { name, email, password, language });
    if (res.data.token) {
      localStorage.setItem("fitoglobe_token", res.data.token);
      localStorage.setItem("fitoglobe_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("fitoglobe_token", res.data.token);
      localStorage.setItem("fitoglobe_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("fitoglobe_token");
    localStorage.removeItem("fitoglobe_user");
  },

  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  resetPassword: (token, newPassword) => api.post("/auth/reset-password", { token, newPassword }),

  getMe: async () => {
    const res = await api.get("/auth/me");
    if (res.data.user) localStorage.setItem("fitoglobe_user", JSON.stringify(res.data.user));
    return res.data.user;
  },

  completeOnboarding: async (data) => {
    const res = await api.put("/user/onboarding", data);
    if (res.data.user) localStorage.setItem("fitoglobe_user", JSON.stringify(res.data.user));
    return res.data.user;
  },

  getStoredUser: () => {
    try { return JSON.parse(localStorage.getItem("fitoglobe_user")); }
    catch { return null; }
  },

  getToken: () => localStorage.getItem("fitoglobe_token"),
};
