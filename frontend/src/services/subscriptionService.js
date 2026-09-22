import { api } from "./api.js";

export const subscriptionService = {
  async getPlans() {
    const res = await api.get("/subscriptions/plans");
    return res.data;
  },

  async getStatus() {
    const res = await api.get("/subscriptions/status");
    return res.data;
  },

  async subscribe(planId, paymentMethod = "Visa ending in 4242") {
    const res = await api.post("/subscriptions/subscribe", { planId, paymentMethod });
    return res.data;
  },

  async cancel() {
    const res = await api.post("/subscriptions/cancel", {});
    return res.data;
  }
};
