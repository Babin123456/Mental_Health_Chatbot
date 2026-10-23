import { axiosClient } from "./axiosClient";

export const register = (data) =>
  axiosClient.post("/auth/register", data);

export const loginUser = (data) =>
  axiosClient.post("/auth/login", data);

export const getProfile = () =>
  axiosClient.get("/auth/profile");