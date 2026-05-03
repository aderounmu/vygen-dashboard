import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { businessQueryKeys } from "@/services/business/hooks";
import { GetBusinessMemberResponse } from "@/services/business/types";

type Permission = {
  name: string;
  slug: string;
  description: string;
};

type UseHasPermissionOptions = {
  /** Query key where permissions are stored */
  queryKey?: unknown[];
};

/**
 * Checks if user has ANY of the provided permission slugs
 */
export function useHasPermission(
  slugs: string | string[],
  businessId: string,
  requiredAll: boolean = false,
  options?: UseHasPermissionOptions,
): boolean {
  const queryClient = useQueryClient();

  const queryKey = options?.queryKey ?? businessQueryKeys.member(businessId);

  // Normalize input
  const requiredSlugs = Array.isArray(slugs) ? slugs : [slugs];

  // Get cached permissions (no refetch here — relies on TanStack cache)
  const response =
    queryClient.getQueryData<GetBusinessMemberResponse>(queryKey);
  const permissions =
    response?.data?.business_member_role?.Role?.permissions ?? [];

  console.log(permissions, "<!----!>");

  const hasPermission = useMemo(() => {
    if (!permissions || permissions.length === 0) return false;

    const permissionSet = new Set(permissions.map((p) => p.slug));

    if (requiredAll) {
      return requiredSlugs.every((slug) => permissionSet.has(slug));
    }

    return requiredSlugs.some((slug) => permissionSet.has(slug));
  }, [permissions, requiredSlugs]);

  return hasPermission;
}
