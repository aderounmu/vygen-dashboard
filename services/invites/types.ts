// member-invite/types.ts

import { ApiSuccessResponse } from "../types";

// =========================
// Request
// =========================
export interface InviteBusinessMemberRequest {
  email: string;
}

// =========================
// Response
// =========================
export interface InviteBusinessMemberResponse
  extends ApiSuccessResponse<string[]> {}


// =========================
// Accept Invite / Create Member
// =========================

export interface CreateBusinessMemberRequest {
  first_name: string;
  last_name: string;
  country: string;
  password: string;

  business_reference: string;
  business_email: string;

  email: string;
  invite_reference: string;
}

// =========================
// Response Types
// =========================

export interface BusinessMember {
  id: string;
  user_id: string;
  business_id: string;
  email: string;

  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;

  business_member_role: any | null;
  user: any | null;
}

export interface CreateBusinessMemberResponse
  extends ApiSuccessResponse<BusinessMember[]> {}