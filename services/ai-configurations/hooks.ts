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
  CreateAiToolConfigurationRequest,
  CreateAiToolConfigurationResponse,
  CreateDataClassificationConfigurationRequest,
  CreateDataClassificationConfigurationResponse,
  GetAiToolConfigurationsResponse,
  GetDataClassificationConfigurationsResponse,
} from "./types";

/* =========================
   QUERY KEYS
========================= */

export const aiConfigurationQueryKeys = {
  all: ["ai-configurations"] as const,

  aiTools: (businessId: string) =>
    [...aiConfigurationQueryKeys.all, "ai-tools", businessId] as const,

  dataClassifications: (businessId: string) =>
    [...aiConfigurationQueryKeys.all, "data-classifications", businessId] as const,
};

/* =========================
   API CALLS
========================= */

export const getAiToolConfigurations = async (
  businessId: string
): Promise<GetAiToolConfigurationsResponse> => {
  const response = await api.get<GetAiToolConfigurationsResponse>(
    `/business/${businessId}/dlp/config/ai-tools`
  );
  return response.data;
};

export const createAiToolConfiguration = async (
  businessId: string,
  payload: CreateAiToolConfigurationRequest
): Promise<CreateAiToolConfigurationResponse> => {
  const response = await api.post<CreateAiToolConfigurationResponse>(
    `/business/${businessId}/dlp/config/ai-tools`,
    payload
  );
  return response.data;
};

export const getDataClassificationConfigurations = async (
  businessId: string
): Promise<GetDataClassificationConfigurationsResponse> => {
  const response = await api.get<GetDataClassificationConfigurationsResponse>(
    `/business/${businessId}/dlp/config/data-classifications`
  );
  return response.data;
};

export const createDataClassificationConfiguration = async (
  businessId: string,
  payload: CreateDataClassificationConfigurationRequest
): Promise<CreateDataClassificationConfigurationResponse> => {
  const response = await api.post<CreateDataClassificationConfigurationResponse>(
    `/business/${businessId}/dlp/config/data-classifications`,
    payload
  );
  return response.data;
};

/* =========================
   QUERY HOOKS
========================= */

export const useGetAiToolConfigurations = (
  businessId: string,
  options?: Omit<
    UseQueryOptions<GetAiToolConfigurationsResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetAiToolConfigurationsResponse, AxiosError<ApiErrorResponse>>({
    queryKey: aiConfigurationQueryKeys.aiTools(businessId),
    queryFn: () => getAiToolConfigurations(businessId),
    enabled: !!businessId,
    ...options,
  });
};

export const useGetDataClassificationConfigurations = (
  businessId: string,
  options?: Omit<
    UseQueryOptions<
      GetDataClassificationConfigurationsResponse,
      AxiosError<ApiErrorResponse>
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<
    GetDataClassificationConfigurationsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: aiConfigurationQueryKeys.dataClassifications(businessId),
    queryFn: () => getDataClassificationConfigurations(businessId),
    enabled: !!businessId,
    ...options,
  });
};

/* =========================
   MUTATION HOOKS
========================= */

export interface CreateAiToolConfigurationVariables {
  businessId: string;
  payload: CreateAiToolConfigurationRequest;
}

export const useCreateAiToolConfiguration = (
  effect?: ApiHookEffect<
    CreateAiToolConfigurationResponse,
    CreateAiToolConfigurationVariables,
    AxiosError<ApiErrorResponse>
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateAiToolConfigurationResponse,
    AxiosError<ApiErrorResponse>,
    CreateAiToolConfigurationVariables
  >({
    mutationFn: ({ businessId, payload }) =>
      createAiToolConfiguration(businessId, payload),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: aiConfigurationQueryKeys.aiTools(variables.businessId),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface CreateDataClassificationConfigurationVariables {
  businessId: string;
  payload: CreateDataClassificationConfigurationRequest;
}

export const useCreateDataClassificationConfiguration = (
  effect?: ApiHookEffect<
    CreateDataClassificationConfigurationResponse,
    CreateDataClassificationConfigurationVariables,
    AxiosError<ApiErrorResponse>
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateDataClassificationConfigurationResponse,
    AxiosError<ApiErrorResponse>,
    CreateDataClassificationConfigurationVariables
  >({
    mutationFn: ({ businessId, payload }) =>
      createDataClassificationConfiguration(businessId, payload),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: aiConfigurationQueryKeys.dataClassifications(
          variables.businessId
        ),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};