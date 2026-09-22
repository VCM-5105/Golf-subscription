import { api } from "./api.js";

export const drawService = {
  async getActiveDraw() {
    const res = await api.get("/draws/active");
    return res.data;
  },

  async getDrawHistory() {
    const res = await api.get("/draws/history");
    return res.data;
  },

  async getMyTicket() {
    const res = await api.get("/draws/my-ticket");
    return res.data;
  },

  async getDrawDetails(drawId) {
    const res = await api.get(`/draws/${drawId}`);
    return res.data;
  }
};
