import { axiosClient } from "./axiosClient";

export const sendMessageToBot = async (message, sessionId = null) => {
  return axiosClient.post("/chat/message", { message, sessionId });
};
