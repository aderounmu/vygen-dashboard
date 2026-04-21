// metric/index.ts

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "..";
import { ApiHookEffect } from "../types";

import {
  GetTrendsResponse,
  GetTotalPromptsResponse,
  GetHighRiskCountResponse,
  GetTopToolsResponse,
  GetTopDataTypesResponse,
} from "./types";

// =========================
// Query Keys
// =========================
export const metricQueryKeys = {
  base: ["metric"] as const,

  trends: (businessId: string) =>
    [...metricQueryKeys.base, "trends", businessId] as const,

  totalPrompts: (businessId: string) =>
    [...metricQueryKeys.base, "total-prompts", businessId] as const,

  highRiskCount: (businessId: string) =>
    [...metricQueryKeys.base, "high-risk-count", businessId] as const,

  // NEW
  topTools: (businessId: string) =>
    [...metricQueryKeys.base, "top-tools", businessId] as const,

  topDataTypes: (businessId: string) =>
    [...metricQueryKeys.base, "top-data-types", businessId] as const,
};

// =========================
// API CALLS
// =========================

// 1. Trends
export const getTrends = async (
  businessId: string
): Promise<GetTrendsResponse> => {
  const response = await api.get<GetTrendsResponse>(
    `/business/${businessId}/analytics/trends`
  );
  return response.data;
};

// 2. Total Prompts
export const getTotalPrompts = async (
  businessId: string
): Promise<GetTotalPromptsResponse> => {
  const response = await api.get<GetTotalPromptsResponse>(
    `/business/${businessId}/analytics/total-prompts`
  );
  return response.data;
};

// 3. High Risk Count
export const getHighRiskCount = async (
  businessId: string
): Promise<GetHighRiskCountResponse> => {
  const response = await api.get<GetHighRiskCountResponse>(
    `/business/${businessId}/analytics/high-risk-count`
  );
  return response.data;
};

// =========================
// Top Tools
// =========================
export const getTopTools = async (
  businessId: string
): Promise<GetTopToolsResponse> => {
  const response = await api.get<GetTopToolsResponse>(
    `/business/${businessId}/analytics/top-tools`
  );
  return response.data;
};

// =========================
// Top Data Types
// =========================
export const getTopDataTypes = async (
  businessId: string
): Promise<GetTopDataTypesResponse> => {
  const response = await api.get<GetTopDataTypesResponse>(
    `/business/${businessId}/analytics/top-data-types`
  );
  return response.data;
};

// =========================
// HOOKS
// =========================

// 1. Trends
export const useGetTrends = (
  businessId: string,
  effect?: ApiHookEffect<
    GetTrendsResponse,
    unknown,
    AxiosError<any>
  >
) => {
  return useQuery({
    queryKey: metricQueryKeys.trends(businessId),
    queryFn: () => getTrends(businessId),
    enabled: !!businessId,
  });
};

// 2. Total Prompts
export const useGetTotalPrompts = (
  businessId: string,
  effect?: ApiHookEffect<
    GetTotalPromptsResponse,
    unknown,
    AxiosError<any>
  >
) => {
  return useQuery({
    queryKey: metricQueryKeys.totalPrompts(businessId),
    queryFn: () => getTotalPrompts(businessId),
    enabled: !!businessId,
  });
};

// 3. High Risk Count
export const useGetHighRiskCount = (
  businessId: string,
  effect?: ApiHookEffect<
    GetHighRiskCountResponse,
    unknown,
    AxiosError<any>
  >
) => {
  return useQuery({
    queryKey: metricQueryKeys.highRiskCount(businessId),
    queryFn: () => getHighRiskCount(businessId),
    enabled: !!businessId,
  });
};

export const useGetTopTools = (
  businessId: string,
  effect?: ApiHookEffect<
    GetTopToolsResponse,
    unknown,
    AxiosError<any>
  >
) => {
  return useQuery({
    queryKey: metricQueryKeys.topTools(businessId),
    queryFn: () => getTopTools(businessId),
    enabled: !!businessId,
  });
};



export const useGetTopDataTypes = (
  businessId: string,
  effect?: ApiHookEffect<
    GetTopDataTypesResponse,
    unknown,
    AxiosError<any>
  >
) => {
  return useQuery({
    queryKey: metricQueryKeys.topDataTypes(businessId),
    queryFn: () => getTopDataTypes(businessId),
    enabled: !!businessId,
  });
};