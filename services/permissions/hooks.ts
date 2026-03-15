import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../index";
import { ApiErrorResponse } from "../types";
import { GetPermissionsResponse } from "./types";

/* =========================
   QUERY KEYS
========================= */

export const permissionQueryKeys = {
  all: ["permissions"] as const,
  list: () => [...permissionQueryKeys.all, "list"] as const,
};

/* =========================
   API CALL
========================= */

export const getPermissions = async (): Promise<GetPermissionsResponse> => {
  const response = await api.get<GetPermissionsResponse>(`/permissions`);
  return response.data;
};

/* =========================
   HOOK
========================= */

export const useGetPermissions = (
  options?: Omit<
    UseQueryOptions<GetPermissionsResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetPermissionsResponse, AxiosError<ApiErrorResponse>>({
    queryKey: permissionQueryKeys.list(),
    queryFn: getPermissions,
    ...options,
  });
};