import React, { useMemo, useState } from "react";
import { Action, AppState, useStore } from "../context/Store";
import { User } from "../types";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Shield,
  Mail,
  Check,
  Settings,
  Briefcase,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import UserEditModal from "@/components/UserEditModal";
import UserInviteModal from "@/components/UserInviteModal";
import { useGetBusinessMembers } from "@/services/business/hooks";
import { AppDispatch } from "recharts/types/state/store";
import { useHasPermission } from "@/hooks/usePermission";
import Pagination from "@/components/Pagination";

export const Users: React.FC = () => {
  const {
    state,
    dispatch,
  }: { state: AppState; dispatch: React.Dispatch<Action> } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const { data, isLoading } = useGetBusinessMembers(
    state?.organization?.id ?? "",
    itemsPerPage,
    page,
  );

  const totalPages = useMemo(() => data?.total_pages ?? 0, [data?.total_pages]);
  const totalItems = useMemo(() => data?.total_items ?? 0, [data?.total_items]);

  const canAddUser = useHasPermission(
    ["can-invite-business-member"],
    state?.organization?.id ?? "",
  );

  const canViewUser = useHasPermission(
    ["can-view-business-members"],
    state?.organization?.id ?? "",
  );

  const canAssignRoleUser = useHasPermission(
    ["can-assign-role-to-business-member"],
    state?.organization?.id ?? "",
  );

  console.log(isLoading, "isLoading<!----!>");
  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    department: "Engineering",
    country: "NGA",
    status: "Active",
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        department: state.departments[0]?.name || "Unassigned",
        country: "NGA",
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();

  //     if (editingUser) {
  //       // Update existing user
  //       dispatch({
  //         type: 'UPDATE_USER',
  //         payload: { ...editingUser, ...formData } as User
  //       });
  //     } else {
  //       // Add new user
  //       const newUser: User = {
  //         id: `u-${Date.now()}`,
  //         avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName || '')}+${encodeURIComponent(formData.lastName || '')}&background=random`,
  //         firstName: formData.firstName || '',
  //         lastName: formData.lastName || '',
  //         name: `${formData.firstName} ${formData.lastName}`,
  //         email: formData.email || '',
  //         country: formData.country || 'NGA',
  //         department: formData.department || 'General',
  //         status: formData.status || 'Active'
  //       };

  //       dispatch({
  //         type: 'ADD_USER',
  //         payload: newUser
  //       });
  //     }
  //     handleCloseModal();
  //   };

  //   const handleDelete = (id: string) => {
  //     dispatch({ type: 'DELETE_USER', payload: id });
  //   };

  // Filter users based on global search query
  //   const filteredUsers = state.users.filter(user =>
  //     user.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
  //     user.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
  //     user.department.toLowerCase().includes(state.searchQuery.toLowerCase())
  //   );

  const filteredUsers =
    !data?.data || data?.data.length < 1
      ? []
      : data?.data?.map(
          (user) =>
            ({
              id: user.id,
              avatar: "",
              name: `${user.user.first_name} ${user.user.last_name}`,
              department: user.business_member_role.Role.role,
              status: "Active",
              firstName: user.user.first_name,
              lastName: user.user.last_name,
              email: user.email,
              organizationId: user.business_id,
              country: user.user.country,
            }) as User,
        );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      {canAddUser && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Team Members
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage access and departments for your organization.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-brand-200 dark:shadow-none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Invite User
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">
              Total Users
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {data?.total_items ?? 0}
            </p>
          </div>
          <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        {/* <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">
              Departments
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {state.departments.length}
            </p>
          </div>
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">
              Active Now
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {state.users.filter((u) => u.status === "Active").length}
            </p>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
        </div> */}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {!isLoading ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {canViewUser ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                            {user.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div
                              className={`h-2.5 w-2.5 rounded-full mr-2 ${user.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`}
                            ></div>
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {user.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canAssignRoleUser && (
                              <button
                                onClick={() => handleOpenModal(user)}
                                className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {/* <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      <ShieldAlert className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p>Sorry you dont have access to view users</p>
                    </div>
                  )}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>No users found matching "{state.searchQuery}"</p>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <Loader2 className="w-12 h-12 animate-spin text-slate-300 mx-auto mb-3" />
            <p>Loading users...</p>
          </div>
        )}

        {/* Pagination */}
        

        <Pagination
         isLoading={isLoading}
        page={page} 
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        setPage={setPage}
        totalPages={totalPages}
        ></Pagination>
      </div>

      {/* User Modal Form */}
      {isModalOpen && (
        <>
          {editingUser ? (
            <UserEditModal
              handleCloseModal={handleCloseModal}
              formData={formData}
              setFormData={setFormData}
              userId=""
            />
          ) : (
            <UserInviteModal
              handleCloseModal={handleCloseModal}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </>
      )}
    </div>
  );
};
