import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.warn("Session check failed, clearing token", err);
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const hasActiveSubscription =
    user?.role === "admin" || user?.subscription?.status === "active";

  const isAdmin = user?.role === "admin";
  const isSubscriber = user?.role === "subscriber" || user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        hasActiveSubscription,
        isAdmin,
        isSubscriber
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
