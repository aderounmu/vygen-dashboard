import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import {
  LayoutDashboard,
  ShieldAlert,
  FileText,
  Users,
  Building2,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Activity,
  Gift,
  PlusCircle,
  HelpCircle,
  Shield,
  Zap,
  ChevronRight,
  ChevronDown,
  LogOut,
  Terminal,
  Loader2,
} from "lucide-react";
import { Action, AppState, useStore } from "../context/Store";
import { clearAuthStorage } from "@/services/auth/storage";
import { useGetBusinessMember } from "@/services/business/hooks";
import { useHasPermission } from "@/hooks/usePermission";
import useHydrateBusinessProfile from "@/hooks/useHydrateBusinessProfile";
import { OrganizationSwitcher } from "./OrganizationPicker";
import { useQueryClient } from "@tanstack/react-query";

export const Layout: React.FC = () => {
  const {
    state,
    dispatch,
  }: { state: AppState; dispatch: React.Dispatch<Action> } = useStore();
  const location = useLocation();

  const bussiness_member = useGetBusinessMember(state?.organization?.id ?? "");
  const canSeeUsers = useHasPermission(
    [
      "can-invite-business-member",
      "can-view-business-members",
      "can-assign-role-to-business-member",
    ],
    state?.organization?.id ?? "",
  );

  const canSeePrompts = useHasPermission(
    ["can-view-prompt-events"],
    state?.organization?.id ?? "",
  );

  const canSeeRoles = useHasPermission(
    [
      "can-view-business-roles",
      "can-view-business-member-roles",
      "can-assign-business-member-role",
      "can-unassign-permission-from-role",
      "can-assign-permission-to-role",
      "can-create-business-roles",
    ],
    state?.organization?.id ?? "",
  );

  const canSeePolicy = useHasPermission(
    [
      "can-create-dlp-ai-tool-config",
      "can-view-dlp-ai-tool-config",
      "can-create-dlp-data-classification",
      "can-view-dlp-data-classifications",
    ],
    state?.organization?.id ?? "",
  );

  const queryClient = useQueryClient();

  const menuGroups = [
    {
      title: "GENERAL",
      items: [
        { name: "Dashboard", path: "/", icon: LayoutDashboard, show: true },
        {
          name: "Activity Log",
          path: "/activity",
          icon: Activity,
          show: canSeePrompts,
        },
        {
          name: "Policies",
          path: "/policies",
          icon: ShieldAlert,
          show: canSeePolicy,
        },
        {
          name: "Prompting",
          path: "/prompting",
          icon: Terminal,
          badge: "NEW",
          show: true,
        },
        {
          name: "Users",
          path: "/users",
          icon: Users,
          // badge: "8",
          show: canSeeUsers,
        },
        {
          name: "Departments",
          path: "/departments",
          icon: Building2,
          show: canSeeRoles,
        },
      ],
    },
    {
      title: "TOOLS",
      items: [
        { name: "Reports", path: "/reports", icon: FileText, show: true },
        { name: "Settings", path: "/settings", icon: Settings, show: true },
        {
          name: "Automation",
          path: "/automation",
          icon: Zap,
          badge: "BETA",
          show: true,
        },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { name: "Security", path: "/security", icon: Shield, show: true },
        { name: "Help", path: "/help", icon: HelpCircle, show: true },
      ],
    },
  ];

  const { isLoading } = useHydrateBusinessProfile();

  if (bussiness_member.isLoading || isLoading) {
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
    <div className="flex h-screen bg-[#F8F9FA] dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 flex flex-col z-20 transition-colors border-r border-slate-100 dark:border-slate-800">
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-2">
            {/* <span className="text-brand-600 dark:text-brand-400">
               <Shield className="w-8 h-8" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">vyken</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Security</span>
            </div> */}
            <Logo alt="Vykensecurity Logo" className="h-12 w-auto" />
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  if (!item.show) {
                    return;
                  }
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            isActive
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-400 group-hover:text-slate-500"
                          }`}
                        />
                        {item.name}
                      </div>
                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.badge === "BETA"
                              ? "bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300"
                              : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Card */}
        {/* <div className="p-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-brand-500 rounded-lg p-1.5 text-white">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Team</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Security Ops
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
            </div>
          </div>
          <button className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700">
            Upgrade Plan
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-3">
            © 2024 Vyken Security Inc.
          </p>
        </div> */}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8F9FA] dark:bg-slate-900">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-[#F8F9FA] dark:bg-slate-900">
          <div className="flex-1 flex items-center max-w-xl">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="block w-full pl-10 pr-12 py-3 border-none rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-100 shadow-sm sm:text-sm transition-all"
                value={state.searchQuery}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-xs text-slate-400 font-medium">
                  ⌘ + F
                </span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex items-center space-x-2">
            <button
              onClick={() =>
                dispatch({ type: "SET_THEME", payload: !state.isDarkMode })
              }
              className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              {state.isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all">
              <Gift className="h-5 w-5" />
            </button>

            <div className="relative">
              <button className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all relative">
                <Bell className="h-5 w-5" />
                {state.notifications.length > 0 && (
                  <span className="absolute top-2 right-2.5 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            </div>

            <button className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all">
              <PlusCircle className="h-5 w-5" />
            </button>

            <button
              onClick={() => {
                clearAuthStorage();
                dispatch({ type: "LOGOUT" });
                queryClient.clear();

              }}
              className="p-2.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* <div className="pt-4">
              <div className="pl-4 flex gap-x-1 items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 mb-3">
                {state.user && (
                  <>
                    <img
                      src={state.user.avatar}
                      alt="User"
                      className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                    />
                    <div className="ml-3 hidden md:block">
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                        {state.user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {state.organization?.name || "Business"}
                      </p>
                    </div>
                    <button>
                      <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                    </button>
                  </>
                )}
              </div>
            </div> */}
            <OrganizationSwitcher
              user={{
                name: state.user?.name ?? "",
                avatar: state.user?.avatar ?? "",
              }}
              currentOrganization={{
                id: state.organization?.id ?? "",
                name: state.organization?.name ?? "",
                image: state.organization?.logo ?? "",
                reference: state.organization?.reference ?? "",
                email: state.organization?.email ?? "",
              }}
            />
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
