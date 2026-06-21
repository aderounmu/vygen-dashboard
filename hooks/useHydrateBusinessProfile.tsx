import { Action, AppState, useStore } from "@/context/Store";
import {
  useGetBusinesses,
  useGetBusinessMemberProfiles,
} from "@/services/business/hooks";
import { useGetUsers } from "@/services/user/hooks";

import React from "react";

const useHydrateBusinessProfile = () => {
  const {
    state,
    dispatch,
  }: { state: AppState; dispatch: React.Dispatch<Action> } = useStore();

  const user = useGetUsers();
  const business = useGetBusinesses();
  const bussinessProfile = useGetBusinessMemberProfiles();

  React.useEffect(() => {
    // if(state.organization || state.organization !== null || state.organization !== undefined ){
    //   return
    // }

    const cached_business_string = localStorage.getItem(`selected_business`);
    let cached_business = null;
    try {
      if (cached_business_string)
        cached_business = JSON.parse(cached_business_string) as {
          id: string;
          email: string;
          reference: string;
          name: string;
        };
      dispatch({
        type: "SET_ORGANIZATION",
        payload: {
          organization: {
            id: cached_business?.id ?? "",
            email: cached_business?.email ?? "",
            reference: cached_business?.reference ?? "",
            name: cached_business?.name ?? "",
          },
        },
      });
    } catch (error: any) {}

    const _business = business.data?.data[0];
    const _user = user.data?.data[0];
    const _businessProfile = bussinessProfile.data?.data[0];
    if (_business && !cached_business) {
      const org = {
        id: _business.id,
        name: _business.name,
        email: _business.email,
        reference: _business.reference,
      };
      dispatch({
        type: "SET_ORGANIZATION",
        payload: {
          organization: org,
        },
      });
      const string_org = JSON.stringify(org);
      localStorage.setItem("selected_business", string_org);
    } else if (_businessProfile && !cached_business) {
      const org = {
        id: _businessProfile?.business?.id ?? "",
        name: _businessProfile?.business?.name ?? "",
        email: _businessProfile?.business?.email ?? "",
        reference: _businessProfile?.business?.reference ?? "",
      };
      dispatch({
        type: "SET_ORGANIZATION",
        payload: {
          organization: org,
        },
      });
      const string_org = JSON.stringify(org);
      localStorage.setItem("selected_business", string_org);
    }

    if (_user) {
      dispatch({
        type: "SET_USER",
        payload: {
          user: {
            id: _user.id,
            firstName: _user.first_name,
            lastName: _user.last_name,
            name: `${_user.first_name} ${_user.last_name}`,
            email: _user.email,
            country: _user.country,
            department: "Security",
            avatar: "https://picsum.photos/seed/admin/32/32",
            status: "Active",
          },
        },
      });
    }
  }, [business.data, bussinessProfile.data, user.data]);

  if (business.isLoading || bussinessProfile.isLoading || user.isLoading) {
    return { isLoading: true };
  }

  return { isLoading: false };
};

export default useHydrateBusinessProfile;
