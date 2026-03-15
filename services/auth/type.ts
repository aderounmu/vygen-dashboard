import { ApiSuccessResponse, BaseTimestamps } from "../types";

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User extends BaseTimestamps {
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
}

export interface AuthDataItem {
  session_id: string;
  user: User;
}

export interface AuthResponse
  extends ApiSuccessResponse<AuthDataItem[]> {}