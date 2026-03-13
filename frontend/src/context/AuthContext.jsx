import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(authService.getStoredUser());
  const [token,   setToken]   = useState(authService.getToken());
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Refresh user from server on mount if token exists
  useEffect(() => {
    if (token && !user) {
      authService.getMe().then(setUser).catch(() => logout());
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true); setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user); setToken(data.token);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  const signup = async (name, email, password, language) => {
    setLoading(true); setError(null);
    try {
      const data = await authService.signup(name, email, password, language);
      setUser(data.user); setToken(data.token);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  };

  const logout = () => {
    authService.logout();
    setUser(null); setToken(null);
  };

  const completeOnboarding = async (data) => {
    setLoading(true);
    try {
      const updated = await authService.completeOnboarding(data);
      setUser(updated); return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Onboarding failed");
    } finally { setLoading(false); }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to send reset email");
    } finally { setLoading(false); }
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      login, signup, logout, completeOnboarding, forgotPassword,
      isAuthenticated: !!token,
      needsOnboarding: !!token && !user?.country,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
