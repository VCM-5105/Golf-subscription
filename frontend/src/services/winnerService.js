import { api } from "./api.js";

export const winnerService = {
  async getMyWinnings() {
    const res = await api.get("/winners/my-winnings");
    return res.data;
  },

  async uploadProof(winnerId, formDataOrPayload) {
    const res = await api.post(`/winners/${winnerId}/proof`, formDataOrPayload);
    return res.data;
  }
};
