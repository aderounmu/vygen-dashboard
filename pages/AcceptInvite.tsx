import PasswordInput from "@/components/PasswordInput";
import UserAcceptForm from "@/components/UserAcceptForm";
import { Action, AppState, useStore } from "../context/Store";
import { useCreateBusinessMember } from "@/services/invites/hooks";
import { User } from "@/types";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useHydrateBusinessProfile from "@/hooks/useHydrateBusinessProfile";
import { Loader2 } from "lucide-react";

interface InviteUser extends Partial<User> {
  password: string;

  isNewAccount?: boolean;
}

export const AcceptInvite = () => {
  let { bussinessId, bussinessReference, inviteReference } = useParams();
  const {
    state,
    dispatch,
  }: { state: AppState; dispatch: React.Dispatch<Action> } = useStore();
  const router = useNavigate();

  const { isLoading } = useHydrateBusinessProfile();

  const isUserLogin =
    localStorage.getItem("sessionId") && state.user !== null ? true : false;

  console.log(state.user, "current user from store");

  const [formData, setFormData] = useState<InviteUser>({
    firstName: state.user?.firstName || "",
    lastName: state.user?.lastName || "",
    email: state.user?.email || "",
    department: "Engineering",
    country: state.user?.country || "" ,
    status: "Active",
    password: "",
    isNewAccount: true,
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

  React.useEffect(() => {
  if (state.user) {
    setFormData((prev) => ({
      ...prev,
      firstName: state.user?.firstName || prev.firstName,
      lastName: state.user?.lastName || prev.lastName,
      email: state.user?.email || prev.email,
      country: state.user?.country || prev.country,
    }));
  }
}, [state.user]);


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

   if (isLoading) {
    return (
      <div className="flex flex-col justify-center item-center w-full h-screen px-3 py-5">
        <div className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <div className="text-center text3xl mt-6">
          Hold on getting things started for you
        </div>
      </div>
    );
  }

  return (
    <UserAcceptForm<InviteUser>
      formData={formData}
      mode="edit"
      setFormData={setFormData}
      isLoading={createbusinessMember.isPending}
      handleSubmit={() => handleSubmit()}
      title="Accept Invitation"
      submitTitle={isUserLogin ? "Accept invite": "Create Account"}
      showCancelButton={false}
      handleCloseModal={() => handleCloseModal}
      showStatusSection={false}
      showRoleSection={false}
      isUserLogin={isUserLogin}
      extraInput={
        <>
          {!isUserLogin && (
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
          )}
        </>
      }
    />
  );
};
