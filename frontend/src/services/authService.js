import { api } from "./api.js";

export const authService = {
  async register(data) {
    const res = await api.post("/auth/register", data);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post("/auth/login", credentials);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout", {});
    } finally {
      localStorage.removeItem("token");
    }
  },

  async getCurrentUser() {
    const res = await api.get("/auth/me");
    return res.data;
  },

  async updateProfile(updates) {
    const res = await api.patch("/auth/profile", updates);
    return res.data;
  }
};
