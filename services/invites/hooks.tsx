// member-invite/index.ts

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "..";

import { ApiHookEffect, ApiErrorResponse } from "../types";
import {
  InviteBusinessMemberRequest,
  InviteBusinessMemberResponse,
  CreateBusinessMemberRequest,
  CreateBusinessMemberResponse,
} from "./types";

// =========================
// API CALL
// =========================
export const inviteBusinessMember = async (
  businessId: string,
  payload: InviteBusinessMemberRequest
): Promise<InviteBusinessMemberResponse> => {
  const response = await api.post<InviteBusinessMemberResponse>(
    `/business/${businessId}/member/invite`,
    payload
  );

  return response.data;
};

export const createBusinessMember = async (
  businessId: string,
  payload: CreateBusinessMemberRequest
): Promise<CreateBusinessMemberResponse> => {
  const response = await api.post<CreateBusinessMemberResponse>(
    `/business/${businessId}/member`,
    payload
  );

  return response.data;
};

// =========================
// HOOK
// =========================
export const useInviteBusinessMember = (
  effect?: {
    successFn?: (
      data: InviteBusinessMemberResponse,
      variables: { businessId: string; payload: InviteBusinessMemberRequest },
      context?: any
    ) => void;
    failureFn?: (
      error: AxiosError<ApiErrorResponse>,
      variables: { businessId: string; payload: InviteBusinessMemberRequest },
      context?: any
    ) => void;
  }
) => {
  return useMutation<
    InviteBusinessMemberResponse,
    AxiosError<ApiErrorResponse>,
    { businessId: string; payload: InviteBusinessMemberRequest }
  >({
    mutationFn: ({ businessId, payload }) =>
      inviteBusinessMember(businessId, payload),

    onError: (error, variables, context) => {
      if (effect?.failureFn)
        effect.failureFn(error, variables, context);
    },

    onSuccess: (data, variables, context) => {
      if (effect?.successFn)
        effect.successFn(data, variables, context);
    },
  });
};

export const useCreateBusinessMember = (
  effect?: {
    successFn?: (
      data: CreateBusinessMemberResponse,
      variables: {
        businessId: string;
        payload: CreateBusinessMemberRequest;
      },
      context?: any
    ) => void;
    failureFn?: (
      error: AxiosError<ApiErrorResponse>,
      variables: {
        businessId: string;
        payload: CreateBusinessMemberRequest;
      },
      context?: any
    ) => void;
  }
) => {
  return useMutation<
    CreateBusinessMemberResponse,
    AxiosError<ApiErrorResponse>,
    {
      businessId: string;
      payload: CreateBusinessMemberRequest;
    }
  >({
    mutationFn: ({ businessId, payload }) =>
      createBusinessMember(businessId, payload),

    onError: (error, variables, context) => {
      if (effect?.failureFn)
        effect.failureFn(error, variables, context);
    },

    onSuccess: (data, variables, context) => {
      if (effect?.successFn)
        effect.successFn(data, variables, context);
    },
  });
};