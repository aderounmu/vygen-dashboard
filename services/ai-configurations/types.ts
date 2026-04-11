import { ApiSuccessResponse, PaginatedResponse } from "../types";

/* =========================
   ENTITY TYPES
========================= */

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
  is_custom_config: boolean;

  metadata?: { 
    domains: Array<string>;
    rules: Array<string>;
    // [key: string]: any; 
  }

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
  is_custom_config: boolean;

  metadata?: { 
    domains: Array<string> 
    rules: Array<string>
  }
}





/* =========================
   RESPONSE TYPES
========================= */

export interface CreateAiToolConfigurationResponse
  extends ApiSuccessResponse<AiToolConfiguration[]> {}

export type GetAiToolConfigurationsResponse =
  PaginatedResponse<AiToolConfiguration>;

export interface CreateDataClassificationConfigurationResponse
  extends ApiSuccessResponse<DataClassificationConfiguration[]> {}

export type GetDataClassificationConfigurationsResponse =
  PaginatedResponse<DataClassificationConfiguration>;



export interface DataClassificationMetadata {
  domains?: string[];
  rules?: string[];
  [key: string]: any;
}

export interface UpdateDataClassificationConfigurationRequest {
  data_type: string;
  action: string;
  priority: number;
  is_enabled: boolean;
  is_custom_config: boolean;
  metadata: DataClassificationMetadata;
}

export interface UpdateDataClassificationConfigurationResponse
  extends ApiSuccessResponse<DataClassificationConfiguration[]> {}




export interface UpdateAiToolConfigurationRequest {
  tool_name: string;
  domain: string;
  is_allowed: boolean;
}

export interface UpdateAiToolConfigurationResponse
  extends ApiSuccessResponse<AiToolConfiguration[]> {}



export interface DeleteResponse {
  status: string;
  message: string;
}