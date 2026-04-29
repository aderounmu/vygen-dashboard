import { User } from "@/types";
import { Loader2, Mail, X } from "lucide-react";
import React from "react";
import { Action, AppState, useStore } from "../context/Store";
import { useGetBusinessRoles } from "@/services/business/hooks";

const UserUpsertForm = <T extends Partial<User>>({
  title,
  submitTitle,
  handleSubmit,
  handleCloseModal,
  formData,
  setFormData,
  isLoading = false,
  showCancelButton = true,
  showStatusSection = true,
  showRoleSection = true,
  extraInput,
}: {
  handleCloseModal: () => void;
  submitTitle: string;
  handleSubmit: () => void;
  title: string;
  formData: T;
  setFormData: (user: T) => void;
  isLoading?: boolean;
  showCancelButton?: boolean;
  extraInput?: React.ReactNode;
  showStatusSection?: boolean;
  showRoleSection?: boolean;
}) => {
  const {
    state,
    dispatch,
  }: { state: AppState; dispatch: React.Dispatch<Action> } = useStore();
  const roles = useGetBusinessRoles(state?.organization?.id ?? "");

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={handleCloseModal}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full z-10 border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h3
              className="text-lg leading-6 font-bold text-slate-900 dark:text-white"
              id="modal-title"
            >
              {title}
            </h3>
            <button
              onClick={handleCloseModal}
              className="text-slate-400 hover:text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                  placeholder="John"
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                  placeholder="Doe"
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                  placeholder="john@company.com"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Country
              </label>
              {/* <input
                type="text"
                required
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                placeholder="NGA"
                value={formData.country || ""}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              /> */}
              <select
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              >
                <option value="USA">United States Of America</option>
                <option value="UK">United Kingdom</option>
                <option value="NGA">Nigeria</option>
              </select>
            </div>

           {showRoleSection && <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department (Role)
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-lg dark:bg-slate-700 dark:text-white"
                value={formData.department || "Unassigned"}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                {/* {state.departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))} */}
                {(roles?.data?.data ?? []).map((dept) => (
                  <option key={dept.id} value={dept.role}>
                    {dept.role}
                  </option>
                ))}
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>}

            {showStatusSection && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-brand-600 focus:ring-brand-500"
                      name="status"
                      value="Active"
                      checked={formData.status === "Active"}
                      onChange={() =>
                        setFormData({ ...formData, status: "Active" })
                      }
                    />
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                      Active
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-brand-600 focus:ring-brand-500"
                      name="status"
                      value="Inactive"
                      checked={formData.status === "Inactive"}
                      onChange={() =>
                        setFormData({ ...formData, status: "Inactive" })
                      }
                    />
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                      Inactive
                    </span>
                  </label>
                </div>
              </div>
            )}

            {extraInput}

            <div className="mt-5 sm:mt-6 flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              {showCancelButton && (
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none sm:text-sm transition-colors"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              )}
              <button
                disabled={isLoading}
                type="submit"
                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-brand-600 text-base font-medium text-white hover:bg-brand-700 focus:outline-none sm:text-sm transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  submitTitle
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserUpsertForm;
