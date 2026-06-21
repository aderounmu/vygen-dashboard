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
  AssignBusinessRolePermissionsRequest,
  AssignBusinessRolePermissionsResponse,
  CreateBusinessMemberRequest,
  CreateBusinessMemberResponse,
  CreateBusinessRequest,
  CreateBusinessResponse,
  CreateBusinessRoleRequest,
  CreateBusinessRoleResponse,
  GetBusinessesResponse,
  GetBusinessMembersResponse,
  GetBusinessRolesResponse,
  UnassignBusinessRolePermissionsRequest,
  UnassignBusinessRolePermissionsResponse,
  GetBusinessMemberResponse,
  AssignRoleToMemberResponse,
  GetBusinessMemberProfilesResponse,
  DeleteBusinessResponse,
  DeleteBusinessMemberResponse,
  DeleteBusinessRoleResponse,
  GetBusinessReportRequest,
  GetBusinessReportResponse,
} from "./types";

/* =========================
   QUERY KEYS
========================= */

export const businessQueryKeys = {
  all: ["business"] as const,
  lists: () => [...businessQueryKeys.all, "list"] as const,
  detail: (id: string) => [...businessQueryKeys.all, "detail", id] as const,
  members: (businessId: string) =>
    [...businessQueryKeys.all, "members", businessId] as const,
  membersPaginated: (businessId: string, pageSize: number, page: number) =>
    [...businessQueryKeys.all, "members", businessId, page, pageSize] as const,
  member: (businessId: string) =>
    [...businessQueryKeys.all, "member", businessId] as const,
  roles: (businessId: string) =>
    [...businessQueryKeys.all, "roles", businessId] as const,
  rolesPaginated: (businessId: string, pageSize: number, page: number) =>
    [...businessQueryKeys.all, "roles", businessId, page, pageSize] as const,
  role: (businessId: string, roleId: string) =>
    [...businessQueryKeys.all, "roles", businessId, roleId] as const,
  memberProfiles: () =>
    [...businessQueryKeys.all, "memberProfiles"] as const,
  report: (businessId: string, startDate: string, endDate: string) =>
    [
      ...businessQueryKeys.all,
      "report",
      businessId,
      startDate,
      endDate,
    ] as const,
};

/* =========================
   API CALLS
========================= */

export const getBusinessMembers = async (
  businessId: string,
  pageSize: number,
  page: number,
): Promise<GetBusinessMembersResponse> => {
  const response = await api.get<GetBusinessMembersResponse>(
    `/business/${businessId}/members?pageSize=${pageSize}&page=${page}`,
  );

  return response.data;
};

export const getBusinesses = async (): Promise<GetBusinessesResponse> => {
  const response = await api.get<GetBusinessesResponse>("/business");
  return response.data;
};

export const createBusiness = async (
  payload: CreateBusinessRequest,
): Promise<CreateBusinessResponse> => {
  const response = await api.post<CreateBusinessResponse>("/business", payload);
  return response.data;
};

export const createBusinessMember = async (
  businessId: string,
  payload: CreateBusinessMemberRequest,
): Promise<CreateBusinessMemberResponse> => {
  const response = await api.post<CreateBusinessMemberResponse>(
    `/business/${businessId}/member`,
    payload,
  );
  return response.data;
};

export const createBusinessRole = async (
  businessId: string,
  payload: CreateBusinessRoleRequest,
): Promise<CreateBusinessRoleResponse> => {
  const response = await api.post<CreateBusinessRoleResponse>(
    `/business/${businessId}/roles`,
    payload,
  );
  return response.data;
};

export const assignBusinessRolePermissions = async (
  businessId: string,
  roleId: string,
  payload: AssignBusinessRolePermissionsRequest,
): Promise<AssignBusinessRolePermissionsResponse> => {
  const response = await api.post<AssignBusinessRolePermissionsResponse>(
    `/business/${businessId}/roles/${roleId}/permissions/assign`,
    payload,
  );
  return response.data;
};

export const unassignBusinessRolePermissions = async (
  businessId: string,
  roleId: string,
  payload: UnassignBusinessRolePermissionsRequest,
): Promise<UnassignBusinessRolePermissionsResponse> => {
  const response = await api.post<UnassignBusinessRolePermissionsResponse>(
    `/business/${businessId}/roles/${roleId}/permissions/unassign`,
    payload,
  );
  return response.data;
};

export const getBusinessRoles = async (
  businessId: string,
  pageSize: number,
  page: number,
): Promise<GetBusinessRolesResponse> => {
  const response = await api.get<GetBusinessRolesResponse>(
    `/business/${businessId}/roles?pageSize=${pageSize}&page=${page}`,
  );

  return response.data;
};

export const getBusinessMember = async (
  businessId: string,
): Promise<GetBusinessMemberResponse> => {
  const response = await api.get<GetBusinessMemberResponse>(
    `/business/${businessId}/member`,
  );

  return response.data;
};

export const getBusinessMemberProfiles =
  async (): Promise<GetBusinessMemberProfilesResponse> => {
    const response = await api.get<GetBusinessMemberProfilesResponse>(
      `/users/business-member-profiles?page=1&pageSize=5000`, // TODO: Remove Hard Coding
    );

    return response.data;
  };

export const deleteBusiness = async (
  businessId: string,
): Promise<DeleteBusinessResponse> => {
  const response = await api.delete<DeleteBusinessResponse>(
    `/business/${businessId}`,
  );
  return response.data;
};

export const deleteBusinessMember = async (
  businessId: string,
  businessMemberId: string,
): Promise<DeleteBusinessMemberResponse> => {
  const response = await api.delete<DeleteBusinessMemberResponse>(
    `/business/${businessId}/members/${businessMemberId}`,
  );
  return response.data;
};

export const deleteBusinessRole = async (
  businessId: string,
  roleId: string,
): Promise<DeleteBusinessRoleResponse> => {
  const response = await api.delete<DeleteBusinessRoleResponse>(
    `/business/${businessId}/roles/${roleId}`,
  );
  return response.data;
};

export const getBusinessReport = async (
  businessId: string,
  params: GetBusinessReportRequest,
): Promise<GetBusinessReportResponse> => {
  const response = await api.get<GetBusinessReportResponse>(
    `/business/${businessId}/report?startDate=${params.startDate}&endDate=${params.endDate}`,
  );
  return response.data;
};

/* =========================
   QUERIES
========================= */

export const useGetBusinessRoles = (
  businessId: string,
  pageSize: number,
  page: number,
  options?: Omit<
    UseQueryOptions<GetBusinessRolesResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<GetBusinessRolesResponse, AxiosError<ApiErrorResponse>>({
    queryKey: businessQueryKeys.rolesPaginated(businessId, pageSize, page),
    queryFn: () => getBusinessRoles(businessId, pageSize, page),
    enabled: !!businessId,
    ...options,
  });
};

export const useGetBusinessMembers = (
  businessId: string,
  pageSize: number,
  page: number,
  options?: Omit<
    UseQueryOptions<GetBusinessMembersResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<GetBusinessMembersResponse, AxiosError<ApiErrorResponse>>({
    queryKey: businessQueryKeys.membersPaginated(businessId, pageSize, page),
    queryFn: () => getBusinessMembers(businessId, pageSize, page),
    enabled: !!businessId,
    ...options,
  });
};

export const useGetBusinesses = (
  options?: Omit<
    UseQueryOptions<GetBusinessesResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<GetBusinessesResponse, AxiosError<ApiErrorResponse>>({
    queryKey: businessQueryKeys.lists(),
    queryFn: getBusinesses,
    ...options,
  });
};

export const useGetBusinessMember = (
  businessId: string,
  options?: Omit<
    UseQueryOptions<GetBusinessMemberResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<GetBusinessMemberResponse, AxiosError<ApiErrorResponse>>({
    queryKey: businessQueryKeys.member(businessId),
    queryFn: () => getBusinessMember(businessId),
    enabled: !!businessId,
    ...options,
  });
};

export const useGetBusinessReport = (
  businessId: string,
  params: GetBusinessReportRequest,
  options?: Omit<
    UseQueryOptions<GetBusinessReportResponse, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<GetBusinessReportResponse, AxiosError<ApiErrorResponse>>({
    queryKey: businessQueryKeys.report(
      businessId,
      params.startDate,
      params.endDate,
    ),
    queryFn: () => getBusinessReport(businessId, params),
    enabled: !!businessId && !!params.startDate && !!params.endDate,
    ...options,
  });
};

export interface GenerateBusinessReportVariables {
  businessId: string;
  params: GetBusinessReportRequest;
}

export const useGenerateBusinessReport = (
  effect?: ApiHookEffect<
    GetBusinessReportResponse,
    GenerateBusinessReportVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  return useMutation<
    GetBusinessReportResponse,
    AxiosError<ApiErrorResponse>,
    GenerateBusinessReportVariables
  >({
    mutationFn: ({ businessId, params }) =>
      getBusinessReport(businessId, params),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      effect?.successFn?.(data, variables, context);
    },
  });
};

// Add Pagination
export const useGetBusinessMemberProfiles = (
  options?: Omit<
    UseQueryOptions<
      GetBusinessMemberProfilesResponse,
      AxiosError<ApiErrorResponse>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<
    GetBusinessMemberProfilesResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: businessQueryKeys.memberProfiles(),
    queryFn: getBusinessMemberProfiles,
    ...options,
  });
};

/* =========================
   MUTATIONS
========================= */

export const useCreateBusiness = (
  effect?: ApiHookEffect<
    CreateBusinessResponse,
    CreateBusinessRequest,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateBusinessResponse,
    AxiosError<ApiErrorResponse>,
    CreateBusinessRequest
  >({
    mutationFn: createBusiness,
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.lists(),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface CreateBusinessMemberVariables {
  businessId: string;
  payload: CreateBusinessMemberRequest;
}

export const useCreateBusinessMember = (
  effect?: ApiHookEffect<
    CreateBusinessMemberResponse,
    CreateBusinessMemberVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateBusinessMemberResponse,
    AxiosError<ApiErrorResponse>,
    CreateBusinessMemberVariables
  >({
    mutationFn: ({ businessId, payload }) =>
      createBusinessMember(businessId, payload),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.lists(),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface CreateBusinessRoleVariables {
  businessId: string;
  payload: CreateBusinessRoleRequest;
}

export const useCreateBusinessRole = (
  effect?: ApiHookEffect<
    CreateBusinessRoleResponse,
    CreateBusinessRoleVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateBusinessRoleResponse,
    AxiosError<ApiErrorResponse>,
    CreateBusinessRoleVariables
  >({
    mutationFn: ({ businessId, payload }) =>
      createBusinessRole(businessId, payload),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.roles(variables.businessId),
      });

      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.lists(),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface AssignBusinessRolePermissionsVariables {
  businessId: string;
  roleId: string;
  payload: AssignBusinessRolePermissionsRequest;
}

export const useAssignBusinessRolePermissions = (
  effect?: ApiHookEffect<
    AssignBusinessRolePermissionsResponse,
    AssignBusinessRolePermissionsVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    AssignBusinessRolePermissionsResponse,
    AxiosError<ApiErrorResponse>,
    AssignBusinessRolePermissionsVariables
  >({
    mutationFn: ({ businessId, roleId, payload }) =>
      assignBusinessRolePermissions(businessId, roleId, payload),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.role(
          variables.businessId,
          variables.roleId,
        ),
      });

      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.roles(variables.businessId),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface UnassignBusinessRolePermissionsVariables {
  businessId: string;
  roleId: string;
  payload: UnassignBusinessRolePermissionsRequest;
}

export const useUnassignBusinessRolePermissions = (
  effect?: ApiHookEffect<
    UnassignBusinessRolePermissionsResponse,
    UnassignBusinessRolePermissionsVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    UnassignBusinessRolePermissionsResponse,
    AxiosError<ApiErrorResponse>,
    UnassignBusinessRolePermissionsVariables
  >({
    mutationFn: ({ businessId, roleId, payload }) =>
      unassignBusinessRolePermissions(businessId, roleId, payload),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.role(
          variables.businessId,
          variables.roleId,
        ),
      });

      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.roles(variables.businessId),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface AssignRoleToMemberVariables {
  businessId: string;
  roleId: string;
  payload: {
    business_member_id: string;
  };
}

export const assignRoleToBusinessMember = async (
  businessId: string,
  roleId: string,
  payload: { business_member_id: string },
): Promise<AssignRoleToMemberResponse> => {
  const response = await api.post<AssignRoleToMemberResponse>(
    `/business/${businessId}/roles/${roleId}/members/assign`,
    payload,
  );

  return response.data;
};

export const useAssignRoleToMember = (
  effect?: ApiHookEffect<
    AssignRoleToMemberResponse,
    AssignRoleToMemberVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    AssignRoleToMemberResponse,
    AxiosError<ApiErrorResponse>,
    AssignRoleToMemberVariables
  >({
    mutationFn: ({ businessId, roleId, payload }) =>
      assignRoleToBusinessMember(businessId, roleId, payload),

    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },

    onSuccess: async (data, variables, context) => {
      // invalidate roles (role membership changed)
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.role(
          variables.businessId,
          variables.roleId,
        ),
      });

      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.roles(variables.businessId),
      });

      // invalidate members (member now has role)

      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.members(variables.businessId),
      });
      
      await queryClient.invalidateQueries({
        queryKey: ["members"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["business"],
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export const useDeleteBusiness = (
  effect?: ApiHookEffect<
    DeleteBusinessResponse,
    string,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteBusinessResponse,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: (businessId) => deleteBusiness(businessId),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.lists(),
      });
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.detail(variables),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface DeleteBusinessMemberVariables {
  businessId: string;
  businessMemberId: string;
}

export const useDeleteBusinessMember = (
  effect?: ApiHookEffect<
    DeleteBusinessMemberResponse,
    DeleteBusinessMemberVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteBusinessMemberResponse,
    AxiosError<ApiErrorResponse>,
    DeleteBusinessMemberVariables
  >({
    mutationFn: ({ businessId, businessMemberId }) =>
      deleteBusinessMember(businessId, businessMemberId),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.members(variables.businessId),
      });
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.memberProfiles(),
      });
      await queryClient.invalidateQueries({
        queryKey: ["members"],
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};

export interface DeleteBusinessRoleVariables {
  businessId: string;
  roleId: string;
}

export const useDeleteBusinessRole = (
  effect?: ApiHookEffect<
    DeleteBusinessRoleResponse,
    DeleteBusinessRoleVariables,
    AxiosError<ApiErrorResponse>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteBusinessRoleResponse,
    AxiosError<ApiErrorResponse>,
    DeleteBusinessRoleVariables
  >({
    mutationFn: ({ businessId, roleId }) =>
      deleteBusinessRole(businessId, roleId),
    onError: (error, variables, context) => {
      effect?.failureFn?.(error, variables, context);
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.roles(variables.businessId),
      });
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.role(
          variables.businessId,
          variables.roleId,
        ),
      });
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.members(variables.businessId),
      });

      effect?.successFn?.(data, variables, context);
    },
  });
};
