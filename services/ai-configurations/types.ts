import { ApiSuccessResponse } from "../types";

export interface AiToolConfiguration {
  id: string;
  business_id: string;
  tool_name: string;
  domain: string;
  is_allowed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DataClassificationConfiguration {
  id: string;
  business_id: string;
  data_type: string;
  is_enabled: boolean;
  priority: number;
  action: string;
  created_at: string;
  updated_at: string;
}

/* =========================
   REQUEST TYPES
========================= */

export interface CreateAiToolConfigurationRequest {
  tool_name: string;
  domain: string;
  is_allowed: boolean;
}

export interface CreateDataClassificationConfigurationRequest {
  data_type: string;
  action: string;
  priority: number;
  is_enabled: boolean;
}

/* =========================
   RESPONSE TYPES
========================= */

export interface GetAiToolConfigurationsResponse {
  data: AiToolConfiguration[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface CreateAiToolConfigurationResponse
  extends ApiSuccessResponse<AiToolConfiguration[]> {}

export interface GetDataClassificationConfigurationsResponse {
  data: DataClassificationConfiguration[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface CreateDataClassificationConfigurationResponse
  extends ApiSuccessResponse<DataClassificationConfiguration[]> {}