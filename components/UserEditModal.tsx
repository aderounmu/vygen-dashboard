import { User } from "@/types";
import React from "react";
import UserUpsertForm from "./UserUpsertForm";
import { useAssignRoleToMember } from "@/services/business/hooks";
import { toast } from "sonner";

const UserEditModal = (props: {
  handleCloseModal: () => void;
  formData: Partial<User & { roleId: string }>;
  userId: string;
  bussinessMemberId: string;
  bussinessId: string;
  setFormData: (user: Partial<User & { roleId: string }>) => void;
}) => {
  const editUserRole = useAssignRoleToMember({
    successFn: () => {
      toast.success(`User succesfully edited `);
      props.handleCloseModal();
    },
    failureFn: () => {
      toast.error(`User error occured editing user`);
    },
  });
  const handleSubmit = async () => {
    // console.log({
    editUserRole.mutate({
      roleId: props.formData.department ?? "",
      businessId: props.bussinessId,
      payload: {
        business_member_id: props.bussinessMemberId,
      },
    });
  };

  return (
    <UserUpsertForm<Partial<User & { roleId: string }>>
      showStatusSection={false}
      mode="edit"
      isLoading={editUserRole.isPending}
      handleSubmit={() => handleSubmit()}
      title="Edit User"
      submitTitle="Save Changes"
      {...props}
    />
  );
};

export default UserEditModal;
