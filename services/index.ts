import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
// import * as SecureStore from "expo-secure-store";
import { ApiErrorResponse } from "./types";

export const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "Cache-Control": "no-cache",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await localStorage.getItem("sessionId");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to attach token:", error);
    }

    return config;
  },
  (error: AxiosError<ApiErrorResponse>) => Promise.reject(error)
);

export default api;