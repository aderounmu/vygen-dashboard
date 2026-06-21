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
  DeleteResponse,
  GetAiToolConfigurationsResponse,
  GetDataClassificationConfigurationsResponse,
  UpdateAiToolConfigurationRequest,
  UpdateAiToolConfigurationResponse,
  UpdateDataClassificationConfigurationRequest,
  UpdateDataClassificationConfigurationResponse,
} from "./types";

/* =========================
   QUERY KEYS
========================= */

export const aiConfigurationQueryKeys = {
  all: ["ai-configurations"] as const,

  aiTools: (businessId: string) =>
    [...aiConfigurationQueryKeys.all, "ai-tools", businessId] as const,
  aiToolsPaginated: (businessId: string, pageSize: number, page: number) =>
    [
      ...aiConfigurationQueryKeys.all,
      "ai-tools",
      businessId,
      pageSize,
      page,
    ] as const,

  dataClassifications: (businessId: string) =>
    [
      ...aiConfigurationQueryKeys.all,
      "data-classifications",
      businessId,
    ] as const,
  dataClassificationsPaginated: (
    businessId: string,
    pageSize: number,
    page: number,
  ) =>
    [
      ...aiConfigurationQueryKeys.all,
      "data-classifications",
      businessId,
      pageSize,
      page,
    ] as const,
};

/* =========================
   API CALLS
========================= */

export const createAiToolConfiguration = async (
  businessId: string,
  payload: CreateAiToolConfigurationRequest,
): Promise<CreateAiToolConfigurationResponse> => {
  const response = await api.post<CreateAiToolConfigurationResponse>(
    `/business/${businessId}/dlp/config/ai-tools`,
    payload,
  );

  return response.data;
};

export const getAiToolConfigurations = async (
  businessId: string,
  pageSize: number,
  page: number,
): Promise<GetAiToolConfigurationsResponse> => {
  const response = await api.get<GetAiToolConfigurationsResponse>(
    `/business/${businessId}/dlp/config/ai-tools?pageSize=${pageSize}&page=${page}`,
  );

  return response.data;
};

export const createDataClassificationConfiguration = async (
  businessId: string,
  payload: CreateDataClassificationConfigurationRequest,
): Promise<CreateDataClassificationConfigurationResponse> => {
  const response =
    await api.post<CreateDataClassificationConfigurationResponse>(
      `/business/${businessId}/dlp/config/data-classifications`,
      payload,
    );

  return response.data;
};

export const updateDataClassificationConfiguration = async (
  businessId: string,
  configurationId: string,
  payload: UpdateDataClassificationConfigurationRequest,
): Promise<UpdateDataClassificationConfigurationResponse> => {
  const response =
    await api.patch<UpdateDataClassificationConfigurationResponse>(
      `/business/${businessId}/dlp/config/data-classifications/${configurationId}`,
      payload,
    );

  return response.data;
};

export const getDataClassificationConfigurations = async (
  businessId: string,
  pageSize: number,
  page: number,
): Promise<GetDataClassificationConfigurationsResponse> => {
  const response = await api.get<GetDataClassificationConfigurationsResponse>(
    `/business/${businessId}/dlp/config/data-classifications?pageSize=${pageSize}&page=${page}`,
  );

  return response.data;
};

export const deleteAiToolConfiguration = async (
  businessId: string,
  configurationId: string,
): Promise<DeleteResponse> => {
  const response = await api.delete<DeleteResponse>(
    `/business/${businessId}/dlp/config/ai-tools/${configurationId}`,
  );

  return response.data;
};

export const deleteDataClassificationConfiguration = async (
  businessId: string,
  configurationId: string,
): Promise<DeleteResponse> => {
  const response = await api.delete<DeleteResponse>(
    `/business/${businessId}/dlp/config/data-classifications/${configurationId}`,
  );

  return response.data;
};

/* =========================
   QUERY HOOKS
========================= */

export const useGetAiToolConfigurations = (
  businessId: string,
  pageSize: number,
  page: number,
  options?: Omit<
    UseQueryOptions<
      GetAiToolConfigurationsResponse,
      AxiosError<ApiErrorResponse>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<
    GetAiToolConfigurationsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: aiConfigurationQueryKeys.aiToolsPaginated(
      businessId,
      pageSize,
      page,
    ),
    queryFn: () => getAiToolConfigurations(businessId, pageSize, page),
    enabled: !!businessId,
    ...options,
  });
};

export const useGetDataClassificationConfigurations = (
  businessId: string,
  pageSize: number,
  page: number,
  options?: Omit<
    UseQueryOptions<
      GetDataClassificationConfigurationsResponse,
      AxiosError<ApiErrorResponse>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<
    GetDataClassificationConfigurationsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: aiConfigurationQueryKeys.dataClassificationsPaginated(
      businessId,
      pageSize,
      page,
    ),
    queryFn: () =>
      getDataClassificationConfigurations(businessId, pageSize, page),
    enabled: !!businessId,
    ...options,
  });
};

export const updateAiToolConfiguration = async (
  businessId: string,
  configurationId: string,
  payload: UpdateAiToolConfigurationRequest,
): Promise<UpdateAiToolConfigurationResponse> => {
  const response = await api.patch<UpdateAiToolConfigurationResponse>(
    `/business/${businessId}/dlp/config/ai-tools/${configurationId}`,
    payload,
  );

  return response.data;
};

/* =========================
   MUTATION HOOKS
========================= */

export interface CreateAiToolConfigurationVariables {
  businessId: string;
  payload: CreateAiToolConfigurationRequest;
}

export interface UpdateDataClassificationConfigurationVariables {
  businessId: string;
  configurationId: string;
  payload: UpdateDataClassificationConfigurationRequest;
}

export interface UpdateDataClassificationConfigurationVariables {
  businessId: string;
  configurationId: string;
  payload: UpdateDataClassificationConfigurationRequest;
}

export const useUpdateDataClassificationConfiguration = (
  effect?: ApiHookEffect<
    UpdateDataClassificationConfigurationResponse,
    UpdateDataClassificationConfigurationVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateDataClassificationConfigurationResponse,
    AxiosError<ApiErrorResponse>,
    UpdateDataClassificationConfigurationVariables
  >({
    mutationFn: ({ businessId, configurationId, payload }) =>
      updateDataClassificationConfiguration(
        businessId,
        configurationId,
        payload,
      ),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: aiConfigurationQueryKeys.dataClassifications(
          variables.businessId,
        ),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export const useCreateAiToolConfiguration = (
  effect?: ApiHookEffect<
    CreateAiToolConfigurationResponse,
    CreateAiToolConfigurationVariables,
    AxiosError<ApiErrorResponse>
  >,
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
  >,
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
          variables.businessId,
        ),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface UpdateAiToolConfigurationVariables {
  businessId: string;
  configurationId: string;
  payload: UpdateAiToolConfigurationRequest;
}

export const useUpdateAiToolConfiguration = (
  effect?: ApiHookEffect<
    UpdateAiToolConfigurationResponse,
    UpdateAiToolConfigurationVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAiToolConfigurationResponse,
    AxiosError<ApiErrorResponse>,
    UpdateAiToolConfigurationVariables
  >({
    mutationFn: ({ businessId, configurationId, payload }) =>
      updateAiToolConfiguration(businessId, configurationId, payload),

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

export interface DeleteAiToolConfigurationVariables {
  businessId: string;
  configurationId: string;
}

export const useDeleteAiToolConfiguration = (
  effect?: ApiHookEffect<
    DeleteResponse,
    DeleteAiToolConfigurationVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteResponse,
    AxiosError<ApiErrorResponse>,
    DeleteAiToolConfigurationVariables
  >({
    mutationFn: ({ businessId, configurationId }) =>
      deleteAiToolConfiguration(businessId, configurationId),

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

export interface DeleteDataClassificationConfigurationVariables {
  businessId: string;
  configurationId: string;
}

export const useDeleteDataClassificationConfiguration = (
  effect?: ApiHookEffect<
    DeleteResponse,
    DeleteDataClassificationConfigurationVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteResponse,
    AxiosError<ApiErrorResponse>,
    DeleteDataClassificationConfigurationVariables
  >({
    mutationFn: ({ businessId, configurationId }) =>
      deleteDataClassificationConfiguration(businessId, configurationId),

    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },

    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: aiConfigurationQueryKeys.dataClassifications(
          variables.businessId,
        ),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};
