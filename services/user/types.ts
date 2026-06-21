import { PaginatedResponse } from "../types";

/* =========================
   ENTITY TYPES
========================= */

export interface User {
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

/* =========================
   RESPONSE TYPES
========================= */

export type GetUsersResponse = PaginatedResponse<User>;