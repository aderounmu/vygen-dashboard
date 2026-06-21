import { BusinessPermission } from "../business/types";
import { ApiSuccessResponse } from "../types";

/* =========================
   ENTITY TYPES
========================= */

// export interface Permission {
//   name: string;
//   slug: string;
//   description: string;
//   is_admin_only: boolean;
// }

/*
API returns nested array:

data: [
  [ Permission, Permission, Permission ]
]
*/

export interface GetPermissionsResponse
  extends ApiSuccessResponse<BusinessPermission[][]> {}