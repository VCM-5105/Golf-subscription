import { api } from "./api.js";

export const adminService = {
  // Surface 01: Users
  async getUsers() {
    const res = await api.get("/admin/users");
    return res.data;
  },
  async updateUser(userId, data) {
    const res = await api.patch(`/admin/users/${userId}`, data);
    return res.data;
  },
  async updateUserScores(userId, scores) {
    const res = await api.put(`/admin/users/${userId}/scores`, { scores });
    return res.data;
  },

  // Surface 02: Draws
  async getDrawData() {
    const res = await api.get("/admin/draws");
    return res.data;
  },
  async simulateDraw(options) {
    const res = await api.post("/admin/draws/simulate", options);
    return res.data;
  },
  async publishDraw(data) {
    const res = await api.post("/admin/draws/publish", data);
    return res.data;
  },

  // Surface 03: Charities
  async createCharity(charityData) {
    const res = await api.post("/admin/charities", charityData);
    return res.data;
  },
  async updateCharity(charityId, updates) {
    const res = await api.patch(`/admin/charities/${charityId}`, updates);
    return res.data;
  },
  async deleteCharity(charityId) {
    const res = await api.delete(`/admin/charities/${charityId}`);
    return res.data;
  },

  // Surface 04: Winners & Verification
  async getWinners() {
    const res = await api.get("/admin/winners");
    return res.data;
  },
  async reviewWinnerProof(winnerId, action, notes) {
    const res = await api.post(`/admin/winners/${winnerId}/review`, { action, notes });
    return res.data;
  },
  async markPayoutPaid(winnerId, transactionRef) {
    const res = await api.post(`/admin/winners/${winnerId}/payout`, { transactionRef });
    return res.data;
  },

  // Surface 05: Reports
  async getReports() {
    const res = await api.get("/admin/reports");
    return res.data;
  }
};
