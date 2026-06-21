import { Department } from "@/types";
import React from "react";
import DepartmentUpsertForm from "./DepartmentUpsertForm";
import { BusinessPermission } from "@/services/business/types";
import {
  useAssignBusinessRolePermissions,
  useUnassignBusinessRolePermissions,
} from "@/services/business/hooks";
import { toast } from "sonner"; // adjust import to match your toast lib

const DepartmentEditModal = (props: {
  handleCloseModal: () => void;
  formData: Partial<Department>;
  bussinessId: string;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      permissions: Array<BusinessPermission>;
    }>
  >;
  roleId: string;
  originalPermission: Array<BusinessPermission>;
  isLoading?: boolean;
}) => {
  const {
    bussinessId,
    roleId,
    formData,
    originalPermission,
    handleCloseModal,
  } = props;

  const assign = useAssignBusinessRolePermissions();
  const unassign = useUnassignBusinessRolePermissions();

  const handleSubmit = async () => {
    const currentPermissions = (formData.permissions ??
      []) as BusinessPermission[];

    const originalSlugs = new Set(originalPermission.map((p) => p.slug));
    const currentSlugs = new Set(currentPermissions.map((p) => p.slug));

    // Diff the original vs current permissions by slug
    const toAssign = currentPermissions.filter(
      (p) => !originalSlugs.has(p.slug),
    );
    const toUnassign = originalPermission.filter(
      (p) => !currentSlugs.has(p.slug),
    );

    // Nothing changed — just close
    if (toAssign.length === 0 && toUnassign.length === 0) {
      handleCloseModal();
      return;
    }

    // Track what actually succeeded so we know what to revert on partial failure
    let assignSucceeded = false;
    let unassignSucceeded = false;

    try {
      const operations: Array<Promise<unknown>> = [];

      if (toAssign.length > 0) {
        operations.push(
          assign
            .mutateAsync({
              businessId: bussinessId,
              roleId,
              payload: { permissions: toAssign },
            })
            .then((res) => {
              assignSucceeded = true;
              return res;
            }),
        );
      }

      if (toUnassign.length > 0) {
        operations.push(
          unassign
            .mutateAsync({
              businessId: bussinessId,
              roleId,
              payload: { permissions: toUnassign },
            })
            .then((res) => {
              unassignSucceeded = true;
              return res;
            }),
        );
      }

      await Promise.all(operations);

      toast.success(`Department updated successfully`);
      handleCloseModal();
    } catch (error) {
      // Revert whichever side did succeed so we end up back at originalPermission
      try {
        const revertOps: Array<Promise<unknown>> = [];

        // Assign succeeded but unassign failed → undo the assign
        if (assignSucceeded && !unassignSucceeded && toAssign.length > 0) {
          revertOps.push(
            unassign.mutateAsync({
              businessId: bussinessId,
              roleId,
              payload: { permissions: toAssign },
            }),
          );
        }

        // Unassign succeeded but assign failed → re-assign what we removed
        if (unassignSucceeded && !assignSucceeded && toUnassign.length > 0) {
          revertOps.push(
            assign.mutateAsync({
              businessId: bussinessId,
              roleId,
              payload: { permissions: toUnassign },
            }),
          );
        }

        if (revertOps.length > 0) {
          await Promise.all(revertOps);
        }
      } catch (revertError) {
        toast.error(
          `Error occurred updating permissions. Manual cleanup may be required.`,
        );
        return;
      }

      toast.error(`Error occurred updating department permissions`);
    }
  };

  return (
    <DepartmentUpsertForm
      mode={"edit"}
      title="Edit Department"
      submitTitle="Update Department"
      isLoading={assign.isPending || unassign.isPending}
      handleSubmit={() => handleSubmit()}
      {...props}
    />
  );
};

export default DepartmentEditModal;
