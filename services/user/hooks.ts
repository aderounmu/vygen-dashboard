import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../index";
import { ApiErrorResponse } from "../types";
import { GetUsersResponse } from "./types";

/* =========================
   QUERY KEYS
========================= */

export const userQueryKeys = {
  all: ["users"] as const,
  list: () => [...userQueryKeys.all, "list"] as const,
};

/* =========================
   API CALL
========================= */

export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await api.get<GetUsersResponse>("/users");
  return response.data;
};

/* =========================
   HOOK
========================= */

export const useGetUsers = (
  options?: Omit<
    UseQueryOptions<GetUsersResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetUsersResponse, AxiosError<ApiErrorResponse>>({
    queryKey: userQueryKeys.list(),
    queryFn: getUsers,
    ...options,
  });
};