import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "https://fitoglobe-backend-ko63.onrender.com";
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL: normalizedApiUrl.endsWith("/api")
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitoglobe_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally - logout if token expired
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("fitoglobe_token");
      localStorage.removeItem("fitoglobe_user");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;