// metric/types.ts

import { PaginatedResponse } from "../types";


// =========================
// 1. Trends
// =========================
export interface TrendMetric {
  risk_score: number;
  created_at: string;
}

export interface GetTrendsResponse extends  PaginatedResponse<TrendMetric>{

}

// =========================
// 2. Total Prompts
// =========================
export interface GetTotalPromptsResponse {
  data: number;
}

// =========================
// 3. High Risk Count
// =========================
export interface GetHighRiskCountResponse {
  data: number;
}

// =========================
// Top Tools
// =========================

export interface GetTopToolsResponse {
  data: Record<string, number>; // e.g. { chatgpt: 42 }
}

// =========================
// Top Data Types
// =========================

export interface TopDataTypeItem {
  action: string;
  name: string;
  count: number;
}



export interface GetTopDataTypesResponse {
  data: Record<string,TopDataTypeItem[]>;
  
}