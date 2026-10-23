import { axiosClient } from "./axiosClient";

export const logMood = async (moodData) => {
  return axiosClient.post("/mood", moodData);
};

export const getMoodHistory = async (limit = 30) => {
  return axiosClient.get(`/mood/history?limit=${limit}`);
};

export const getMoodSummary = async () => {
  return axiosClient.get("/mood/summary");
};
