import { axiosClient } from "./axiosClient";

export const getSessions = async () => {
  return axiosClient.get("/chat/sessions");
};

export const getSessionHistory = async (sessionId) => {
  return axiosClient.get(`/chat/history/${sessionId}`);
};

export const createNewSession = async (title = "New Conversation") => {
  return axiosClient.post("/chat/session", { title });
};

export const deleteSession = async (sessionId) => {
  return axiosClient.delete(`/chat/session/${sessionId}`);
};
