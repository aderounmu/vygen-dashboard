import React from "react";
import UserUpsertForm from "./UserUpsertForm";
import { User } from "@/types";
// import { useCreateBusinessMember } from '@/services/business/hooks'
import { useInviteBusinessMember } from "@/services/invites/hooks";
import { toast } from "sonner";
import { AppState, useStore } from "@/context/Store";
import { generateSecurePassword } from "@/utils";
import UserInviteForm from "./UserInviteForm";
const UserInviteModal = (props: {
  handleCloseModal: () => void;
  formData: Partial<User>;
  setFormData: (user: Partial<User>) => void;
}) => {
  const { state }: { state: AppState } = useStore();
  const invitebusinessUser = useInviteBusinessMember({
    successFn: (data) => {
      toast.success("User Invitation completed");
      props.handleCloseModal()
    },
    failureFn: (error) => {
      const message = "";
      toast.error(`Error Inviting User`);
    },
  });

  // const assignUserToRole = useAs

  const handleSubmit = async () => {
    // for testing
    // const password = generateSecurePassword(17)
    // console.log(password)
    invitebusinessUser.mutate({
      businessId: state?.organization?.id ?? "",
      payload: {
        // first_name: props.formData?.firstName ?? "",
        // last_name: props.formData?.lastName  ?? "",
        // country: props.formData?.country  ?? "",
        // password: password,
        // business_reference: state.organization?.reference ?? "",
        // business_email: props.formData?.email ?? "",
        email: props.formData?.email ?? "",
      },
    });
  };

  return (
    <UserInviteForm
      isLoading={invitebusinessUser.isPending}
      handleSubmit={() => handleSubmit()}
      title="Invite New User"
      submitTitle="Send Invite"
      {...props}
    />

    // <UserUpsertForm isLoading={invitebusinessUser.isPending} handleSubmit={() => handleSubmit()} title="Invite New User" submitTitle='Send Invite'  {...props}/>
  );
};

export default UserInviteModal;
