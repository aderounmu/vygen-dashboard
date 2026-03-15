import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../index";
import { ApiErrorResponse, ApiHookEffect } from "../types";
import { RegisterRequest, AuthResponse, LoginRequest } from "./type";
import { saveSession } from "./storage";

export const registerUser = async (
  payload: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
};

export const useRegister = (
  effect?: ApiHookEffect<
    AuthResponse,
    RegisterRequest,
    AxiosError<ApiErrorResponse>
  >
) => {
  return useMutation<
    AuthResponse,
    AxiosError<ApiErrorResponse>,
    RegisterRequest
  >({
    mutationFn: async (payload) => {
      try {
        const result = await registerUser(payload);

        // Save session-related data if needed
        await saveSession(result);

        return result;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {
      if (effect?.failureFn) {
        effect.failureFn(error, variables, context);
      }
    },
    onSuccess: (data, variables, context) => {
      if (effect?.successFn) {
        effect.successFn(data, variables, context);
      }
    },
  });
};




export const loginUser = async (
  payload: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const useLogin = (
    effect?: ApiHookEffect<
    AuthResponse,
    LoginRequest,
    AxiosError<ApiErrorResponse>
  >
) => {
  return useMutation<
    AuthResponse,
    AxiosError<ApiErrorResponse>,
    LoginRequest
  >({
    mutationFn: async (payload) => {
      try {
        const result = await loginUser(payload);

        // Save session-related data if needed
        await saveSession(result);

        return result;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {
      if (effect?.failureFn) {
        effect.failureFn(error, variables, context);
      }
    },
    onSuccess: (data, variables, context) => {
      if (effect?.successFn) {
        effect.successFn(data, variables, context);
      }
    },
  });
};