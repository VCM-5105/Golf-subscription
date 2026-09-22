import { api } from "./api.js";

export const scoreService = {
  async getMyScores() {
    const res = await api.get("/scores");
    return res.data;
  },

  async addScore(scoreData) {
    const res = await api.post("/scores", scoreData);
    return res.data;
  },

  async updateScore(scoreId, scoreData) {
    const res = await api.patch(`/scores/${scoreId}`, scoreData);
    return res.data;
  },

  async deleteScore(scoreId) {
    const res = await api.delete(`/scores/${scoreId}`);
    return res.data;
  }
};
