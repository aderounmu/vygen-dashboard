import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
// import * as SecureStore from "expo-secure-store";
import { ApiErrorResponse } from "./types";
import { clearAuthStorage } from "./auth/storage";
import queryClient from "../queryClient";
import { storeDispatch } from "../storeDispatch";

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
  (error: AxiosError<ApiErrorResponse>) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    console.error("Response error:", error.response?.status, error.response?.data);

    if (
      error.response?.status === 400 &&
      error.response?.data?.error === "Session expired. Login again to continue"
    ) {
      console.error("Session expired, logging out");
      clearAuthStorage();
      queryClient.clear();
      storeDispatch({ type: "LOGOUT" });
    }

    return Promise.reject(error);
  }
);

export default api;