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