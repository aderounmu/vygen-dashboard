import { PaginatedResponse } from "../types";

/* =========================
   NESTED ENTITY TYPES
========================= */

export interface PromptEventBusiness {
  id: string;
  user_id: string;
  name: string;
  reference: string;
  email: string;
  image: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface PromptEventUser {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  email: string;
  image: string;
  country: string;
  registration_medium: string;
  last_login: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export interface PromptEventBusinessMemberRole {
  id?: string;
  role?: string;
}

export interface PromptEventBusinessMember {
  id: string;
  user_id: string;
  business_id: string;
  email: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  business_member_role: PromptEventBusinessMemberRole | null;
  user: PromptEventUser;
}

export interface PromptEventAiToolData {
  id: string;
  business_id: string;
  tool_name: string;
  domain: string;
  is_allowed: boolean;
  created_at: string;
  updated_at: string;
}

/* =========================
   MAIN ENTITY
========================= */

export interface PromptEvent {
  id: string;
  business_id: string;
  business_member_id: string;
  ai_tool: string;
  encrypted_content: string;
  risk_score: number;
  action: string;
  reasons: string;
  created_at: string;
  business: PromptEventBusiness;
  business_member: PromptEventBusinessMember;
  ai_tool_data: PromptEventAiToolData;
}

/* =========================
   RESPONSE TYPES
========================= */

export type GetPromptEventsResponse = PaginatedResponse<PromptEvent>;