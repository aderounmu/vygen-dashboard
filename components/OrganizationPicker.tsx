import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useGetBusinessMemberProfiles } from "@/services/business/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Action, AppState, useStore } from "@/context/Store";

interface Organization {
  id: string;
  name: string;
  image?: string;

  email: string;

  reference: string;
}

interface User {
  name: string;
  avatar: string;
}

interface OrganizationSwitcherProps {
  user?: User;
  organizations?: Organization[];
  currentOrganization?: Organization;
  onChange?: (org: Organization) => void;
}

export const OrganizationSwitcher = ({
  user,
  currentOrganization,
  onChange,
}: OrganizationSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useNavigate();

  const {
    state,
    dispatch,
  }: { state: AppState; dispatch: React.Dispatch<Action> } = useStore();

  const bussinessProfiles = useGetBusinessMemberProfiles();

  const handleSelect = async (org: Organization) => {
    const caching_org = {
      id: org.id,
      name: org.name,
      email: org.email,
      reference: org.reference,
    };
    dispatch({
      type: "SET_ORGANIZATION",
      payload: {
        organization: caching_org,
      },
    });
    const string_org = JSON.stringify(caching_org);
    localStorage.setItem("selected_business", string_org);
    onChange?.(org);
    setOpen(false);
    await queryClient.invalidateQueries();
    router("/");
  };

  return (
    <div className="relative pt-4">
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer flex items-center gap-x-2 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700"
      >
        {user && (
          <>
            <img
              src={user.avatar}
              alt="User"
              className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
            />

            <div className="hidden md:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentOrganization?.name || "Select Organization"}
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
          </>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
          {bussinessProfiles.isLoading && (
            <div className="p-3 text-sm text-slate-500">Loading Data</div>
          )}

          {bussinessProfiles?.data?.data.length === 0 && (
            <div className="p-3 text-sm text-slate-500">No organizations</div>
          )}

          {bussinessProfiles?.data?.data
            .map((item) => ({
              id: item.business_id,
              name: item.business?.name ?? "",
              image: item.business?.image ?? "",
              email: item.business?.email ?? "",
              reference: item.business?.reference ?? "",
            }))
            .map((org) => {
              const isActive = org.id === currentOrganization?.id;
              return (
                <div
                  key={org.id}
                  onClick={() => handleSelect(org)}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <div className="h-8 w-8 text-black rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold">
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>

                  <span className="text-sm text-slate-800 dark:text-slate-200">
                    {org.name}
                  </span>

                  {isActive && (
                    <Check className="ml-auto w-4 h-4 text-green-500" />
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
