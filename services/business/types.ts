import { ApiSuccessResponse } from "../types";

export interface Business {
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

export interface BusinessMember {
  id: string;
  user_id: string;
  business_id: string;
  email: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export interface BusinessPermission {
  name: string;
  slug: string;
  description: string;
  is_admin_only?: boolean;
}

export interface BusinessRole {
  id: string;
  business_id: string;
  role: string;
  permissions: BusinessPermission[];
  created_at: string;
  updated_at: string;
}

/* =========================
   REQUEST TYPES
========================= */

export interface CreateBusinessRequest {
  name: string;
  email: string;
}

export interface CreateBusinessMemberRequest {
  first_name: string;
  last_name: string;
  country: string;
  password: string;
  business_reference: string;
  business_email: string;
  email: string;
}

export interface CreateBusinessRoleRequest {
  role: string;
}

export interface AssignBusinessRolePermissionsRequest {
  permissions: BusinessPermission[];
}

export interface UnassignBusinessRolePermissionsRequest {
  permissions: BusinessPermission[];
}

/* =========================
   RESPONSE TYPES
========================= */

export interface GetBusinessesResponse {
  data: Business[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface CreateBusinessResponse
  extends ApiSuccessResponse<Business[]> {}

export interface CreateBusinessMemberResponse
  extends ApiSuccessResponse<BusinessMember[]> {}

export interface CreateBusinessRoleResponse
  extends ApiSuccessResponse<BusinessRole[]> {}

export interface AssignBusinessRolePermissionsResponse
  extends ApiSuccessResponse<BusinessRole[]> {}

export interface UnassignBusinessRolePermissionsResponse
  extends ApiSuccessResponse<BusinessRole[]> {}