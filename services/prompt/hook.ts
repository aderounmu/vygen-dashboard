import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../index";
import { ApiErrorResponse, ApiHookEffect } from "../types";
import {
  GetPromptEventsResponse,
  SubmitPromptRequest,
  SubmitPromptResponse,
} from "./types";

/* =========================
   QUERY KEYS
========================= */

export const promptQueryKeys = {
  all: ["prompt"] as const,
  events: (businessId: string) =>
    [...promptQueryKeys.all, "events", businessId] as const,
};

/* =========================
   API CALLS
========================= */

export const getPromptEvents = async (
  businessId: string
): Promise<GetPromptEventsResponse> => {
  const response = await api.get<GetPromptEventsResponse>(
    `/business/${businessId}/prompt-events`
  );

  return response.data;
};

export const submitPrompt = async (
  businessId: string,
  payload: SubmitPromptRequest
): Promise<SubmitPromptResponse> => {
  const response = await api.post<SubmitPromptResponse>(
    `/business/${businessId}/submit-prompt`,
    payload
  );

  return response.data;
};

/* =========================
   QUERY HOOKS
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

/* =========================
   MUTATION HOOKS
========================= */

export interface SubmitPromptVariables {
  businessId: string;
  payload: SubmitPromptRequest;
}

export const useSubmitPrompt = (
  effect?: ApiHookEffect<
    SubmitPromptResponse,
    SubmitPromptVariables,
    AxiosError<ApiErrorResponse>
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    SubmitPromptResponse,
    AxiosError<ApiErrorResponse>,
    SubmitPromptVariables
  >({
    mutationFn: ({ businessId, payload }) => submitPrompt(businessId, payload),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: promptQueryKeys.events(variables.businessId),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};