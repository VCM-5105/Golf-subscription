import { api } from "./api.js";

export const charityService = {
  async getAll(params = {}) {
    const res = await api.get("/charities", params);
    return res.data;
  },

  async getSpotlight() {
    const res = await api.get("/charities/spotlight");
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/charities/${id}`);
    return res.data;
  },

  async donate(data) {
    const res = await api.post("/charities/donate", data);
    return res.data;
  },

  async selectCharity(charityId, percentage) {
    const res = await api.post("/charities/select", { charityId, percentage });
    return res.data;
  }
};
