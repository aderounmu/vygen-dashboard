import PasswordInput from "@/components/PasswordInput";
import UserUpsertForm from "@/components/UserUpsertForm";
import { useCreateBusinessMember } from "@/services/invites/hooks";
import { User } from "@/types";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface InviteUser extends Partial<User> {
  password: string;
}

export const AcceptInvite = () => {
  let { bussinessId, bussinessReference, inviteReference } = useParams();
  const router = useNavigate();

  const [formData, setFormData] = useState<InviteUser>({
    firstName: "",
    lastName: "",
    email: "",
    department: "Engineering",
    country: "NGA",
    status: "Active",
    password: "",
  });

  const createbusinessMember = useCreateBusinessMember({
    successFn: (data) => {
      toast.success("User Invitation completed");
      router("/login");
    },
    failureFn: (error) => {
      const message = "";
      toast.error(`Error Accepting invitation`);
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    console.log({
      businessId: bussinessId ?? "",
      payload: {
        first_name: formData?.firstName ?? "",
        last_name: formData?.lastName ?? "",
        country: formData?.country ?? "",
        password: formData.password ?? "",
        business_reference: bussinessReference ?? "",
        business_email: formData?.email ?? "",
        email: formData?.email ?? "",
        invite_reference: inviteReference ?? "",
      },
    });
    createbusinessMember.mutate({
      businessId: bussinessId ?? "",
      payload: {
        first_name: formData?.firstName ?? "",
        last_name: formData?.lastName ?? "",
        country: formData?.country ?? "",
        password: formData.password ?? "",
        business_reference: bussinessReference ?? "",
        business_email: formData?.email ?? "",
        email: formData?.email ?? "",
        invite_reference: inviteReference ?? "",
      },
    });
  };

  return (
    <UserUpsertForm<InviteUser>
      formData={formData}
      mode="create"
      setFormData={setFormData}
      isLoading={createbusinessMember.isPending}
      handleSubmit={() => handleSubmit()}
      title="Accept Invitation"
      submitTitle="Create Account"
      showCancelButton={false}
      handleCloseModal={() => handleCloseModal}
      showStatusSection={false}
      showRoleSection={false}
      extraInput={
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <PasswordInput
              setPassword={(e: string) =>
                setFormData({ ...formData, password: e })
              }
              password={formData.password}
            />
          </div>
        </>
      }
    />
  );
};
