import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../index";
import { ApiErrorResponse } from "../types";
import { GetPromptEventsResponse } from "./types";

/* =========================
   QUERY KEYS
========================= */

export const promptQueryKeys = {
  all: ["prompt"] as const,
  events: (businessId: string) =>
    [...promptQueryKeys.all, "events", businessId] as const,
};

/* =========================
   API CALL
========================= */

export const getPromptEvents = async (
  businessId: string
): Promise<GetPromptEventsResponse> => {
  const response = await api.get<GetPromptEventsResponse>(
    `/business/${businessId}/prompt-events`
  );

  return response.data;
};

/* =========================
   HOOK
========================= */

export const useGetPromptEvents = (
  businessId: string,
  options?: Omit<
    UseQueryOptions<GetPromptEventsResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetPromptEventsResponse, AxiosError<ApiErrorResponse>>({
    queryKey: promptQueryKeys.events(businessId),
    queryFn: () => getPromptEvents(businessId),
    enabled: !!businessId,
    ...options,
  });
};