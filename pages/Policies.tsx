import React, { useState } from "react";
import { Action, AppState, useStore } from "../context/Store";
import { ActionType, Policy, AIPlatform } from "../types";
import {
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Save,
  Globe,
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
  ListFilter,
  AlertTriangle,
  CheckCircle,
  Ban,
  Loader2,
} from "lucide-react";
import {
  useCreateAiToolConfiguration,
  useCreateDataClassificationConfiguration,
  useGetAiToolConfigurations,
  useGetDataClassificationConfigurations,
} from "@/services/ai-configurations/hooks";
import { AppDispatch } from "recharts/types/state/store";
import { toast } from "sonner";

export const Policies: React.FC = () => {
  const {
    state,
    dispatch,
  }: { state: AppState; dispatch: React.Dispatch<Action> } = useStore();
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  console.log(state, "<!_-----!?");

  const ListOfAvailablePolicies: {key: string; name: string; description: string}[] =  [
    { key: "ssn", name: "SSN Protection", description: "Protect Social Security Numbers from being shared with AI platforms." },
    { key: "email", name: "Email Protection", description: "Prevent email addresses from being exposed to AI platforms." },
    { key: "nin", name: "NIN Protection", description: "Safeguard National Identification Numbers from AI access." },
    { key: "custom", name: "Custom Pattern", description: "Define a custom regex pattern to protect specific data types."},
    {key: "source_code", name: "Source Code Protection", description: "Block source code snippets from being shared with AI platforms." },
    {key: "jwt", name: "JWT Protection", description: "Prevent JSON Web Tokens (JWT) from being exposed to AI platforms." },
    {key: "aws_keys", name: "AWS Keys Protection", description: "Safeguard AWS Access Keys and Secret Keys from AI access." },
    { key: "pci", name: "PCI Data Protection", description: "Block Payment Card Industry (PCI) data from AI platforms." },
    {key : "api_secrets", name: "API Secret Protection", description: "Prevent API secrets and tokens from being shared with AI platforms." },
  ];

  const platforms = useGetAiToolConfigurations(state?.organization?.id ?? "");

  const addPlatform = useCreateAiToolConfiguration({
    successFn: () => {
      toast.success(`Platform Added successfullly`);
      setShowPlatformModal(false);
    },
    failureFn(error, variables, context) {
      toast.error(`Error occured Added Platform`);
    },
  });

  const addConfig = useCreateDataClassificationConfiguration({
    successFn: () => {
      toast.success(`Config Added successfullly`);
      setNewPolicy({
        name: "",
        description: "",
        data_type: "",
        action: ActionType.BLOCK,
        priority: 1,
        is_enabled: true,
        domains: "",
      });
      setShowPolicyModal(false);
    },
    failureFn(error, variables, context) {
      toast.error(`Config occured Added Platform`);
    },
  });

  const configs = useGetDataClassificationConfigurations(
    state?.organization?.id ?? "",
  );

  const [newPlatform, setNewPlatform] = useState<Partial<AIPlatform>>({
    tool_name: "",
    domain: "",
    is_allowed: true,
  });

  const [newPolicy, setNewPolicy] = useState<Partial<Policy>>({
    name: "",
    description: "",
    data_type: "",
    action: ActionType.BLOCK,
    priority: 1,
    is_enabled: true,
    domains: "",
  });

  const togglePolicy = (policy: Policy) => {
    dispatch({
      type: "UPDATE_POLICY",
      payload: { ...policy, is_enabled: !policy.is_enabled },
    });
  };

  const deletePolicy = (id: string) => {
    dispatch({ type: "DELETE_POLICY", payload: id });
  };

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicy.name || !newPolicy.data_type) return;

    // const policy: Policy = {
    //   id: `p-${Date.now()}`,
    //   name: newPolicy.name,
    //   description: newPolicy.description || "",
    //   data_type: newPolicy.data_type,
    //   action: newPolicy.action as ActionType,
    //   priority: Number(newPolicy.priority) || 1,
    //   is_enabled: newPolicy.is_enabled ?? true,
    // };

    // dispatch({ type: "ADD_POLICY", payload: policy });
    const payload = {
      //name: newPolicy.name,
      // description: newPolicy.description || "",
      data_type: newPolicy.data_type,
      action: newPolicy.action as ActionType,
      priority: Number(newPolicy.priority) || 1,
      is_enabled: newPolicy.is_enabled ?? true,
    } as any;

    if (payload.data_type === "email") {
      const domains = newPolicy.domains
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d !== "");
      payload.metadata = { domains };
    }
    addConfig.mutate({
      businessId: state?.organization?.id,
      payload,
    });

    // setNewPolicy({
    //   name: "",
    //   description: "",
    //   data_type: "",
    //   action: ActionType.BLOCK,
    //   priority: 1,
    //   is_enabled: true,
    // });
  };

  const togglePlatform = (platform: AIPlatform) => {
    dispatch({
      type: "UPDATE_PLATFORM",
      payload: { ...platform, is_allowed: !platform.is_allowed },
    });
  };

  const handleAddPlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform.tool_name || !newPlatform.domain) return;

    // const platform: AIPlatform = {
    //   id: `ap-${Date.now()}`,
    //   tool_name: newPlatform.tool_name,
    //   domain: newPlatform.domain,
    //   is_allowed: newPlatform.is_allowed ?? true,
    // };
    console.log(state?.organization?.id);
    addPlatform.mutate({
      businessId: state?.organization?.id,
      payload: {
        tool_name: newPlatform.tool_name,
        domain: newPlatform.domain,
        is_allowed: newPlatform.is_allowed ?? true,
      },
    });

    // dispatch({ type: 'ADD_PLATFORM', payload: platform });

    // setNewPlatform({ tool_name: '', domain: '', is_allowed: true });
  };

  const deletePlatform = (id: string) => {
    dispatch({ type: "DELETE_PLATFORM", payload: id });
  };

  const getActionIcon = (action: ActionType) => {
    switch (action) {
      case ActionType.BLOCK:
        return <Ban className="w-4 h-4 text-red-600" />;
      case ActionType.WARN:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case ActionType.PASS:
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return null;
    }
  };

  const getActionStyles = (action: ActionType) => {
    switch (action) {
      case ActionType.BLOCK:
        return "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
      case ActionType.WARN:
        return "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400";
      case ActionType.PASS:
        return "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Governance & Policies
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage AI platform access and data protection rules.
          </p>
        </div>
      </div>

      {/* AI Platforms Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              AI Platforms
            </h2>
          </div>
          <button
            onClick={() => setShowPlatformModal(true)}
            className="inline-flex items-center px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add AI Platform
          </button>
        </div>

        {platforms.isLoading ? (
          <div className="flex justify-center py-5 mx-auto">
            {" "}
            <Loader2 className="w-5 h-5 animate-spin" />{" "}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(platforms?.data?.data ?? []).map((platform) => (
              <div
                key={platform.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${platform.is_allowed ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"}`}
                    >
                      {platform.is_allowed ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <ShieldAlert className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {platform.tool_name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {platform.domain}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => togglePlatform(platform)}
                      className={`p-1 rounded-md transition-colors ${platform.is_allowed ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"}`}
                      title={platform.is_allowed ? "Allowed" : "Blocked"}
                    >
                      {platform.is_allowed ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                    <button
                      onClick={() => deletePlatform(platform.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DLP Policies Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              DLP Policies
            </h2>
          </div>
          <button
            onClick={() => setShowPolicyModal(true)}
            className="inline-flex items-center px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Policy
          </button>
        </div>

        {configs.isLoading ? (
          <div className="flex justify-center py-5 mx-auto">
            {" "}
            <Loader2 className="w-5 h-5 animate-spin" />{" "}
          </div>
        ) : (
          <div className="grid gap-4">
            {(configs?.data?.data ?? []).map((policy) => (
              // {(configs?.data?.data ?? []).map((policy) => (
              <div
                key={policy.id}
                className={`bg-white dark:bg-slate-800 rounded-xl border transition-all ${policy.is_enabled ? "border-slate-200 dark:border-slate-700 shadow-sm" : "border-slate-100 dark:border-slate-800 opacity-60"}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${policy.is_enabled ? "bg-brand-50 text-brand-600 dark:bg-slate-700 dark:text-brand-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}
                      >
                        <ListFilter className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                            {policy.data_type} policy
                          </h3>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded uppercase tracking-wider">
                            Priority {policy.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Policy that {policy.action}s {policy.data_type}
                        </p>
                      </div>
                    </div>
                    {/* <button onClick={() => togglePolicy(policy)} className="text-brand-600 hover:text-brand-700 dark:text-brand-400 focus:outline-none">
                                {policy.is_enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                            </button> */}
                    <button
                      onClick={() => null}
                      className="text-brand-600 hover:text-brand-700 dark:text-brand-400 focus:outline-none"
                    >
                      {policy.is_enabled ? (
                        <ToggleRight className="w-8 h-8" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Logic Builder Visualization */}
                  <div className="mt-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                        IF
                      </span>
                      <div className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 font-medium text-xs">
                        Data contains{" "}
                        <span className="text-brand-600 font-bold">
                          {policy.data_type}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                        THEN
                      </span>
                      <div
                        className={`px-2 py-1 border rounded font-bold flex items-center gap-1.5 text-xs uppercase tracking-tight ${getActionStyles(policy.action as ActionType)}`}
                      >
                        {getActionIcon(policy.action as ActionType)}
                        {policy.action}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end items-center space-x-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => deletePolicy(policy.id)}
                      className="text-xs text-slate-500 hover:text-red-500 flex items-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </button>
                    <button className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center transition-colors">
                      <Save className="w-3.5 h-3.5 mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Platform Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Add AI Platform
              </h2>
              <button
                onClick={() => setShowPlatformModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddPlatform} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ChatGPT"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  value={newPlatform.tool_name}
                  onChange={(e) =>
                    setNewPlatform({
                      ...newPlatform,
                      tool_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. chat.openai.com"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  value={newPlatform.domain}
                  onChange={(e) =>
                    setNewPlatform({ ...newPlatform, domain: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Allow Access
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enable users to access this platform
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNewPlatform({
                      ...newPlatform,
                      is_allowed: !newPlatform.is_allowed,
                    })
                  }
                  className="text-brand-600"
                >
                  {newPlatform.is_allowed ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPlatformModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
                >
                  {addPlatform.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Add Platform"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                New DLP Policy
              </h2>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddPolicy} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Policy Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSN Protection"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  value={newPolicy.name}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Briefly describe the purpose of this policy"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none h-20"
                  value={newPolicy.description}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Data Type
                  </label>
                  {/* <input
                    type="text"
                    required
                    placeholder="e.g. SSN"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    value={newPolicy.data_type}
                    onChange={(e) =>
                      setNewPolicy({ ...newPolicy, data_type: e.target.value })
                    }
                  /> */}
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    id="data_type"
                    value={newPolicy.data_type}
                    onChange={(e) =>
                      setNewPolicy({ ...newPolicy, data_type: e.target.value })
                    }
                  >
                    {/* <option value="ssn">SSN</option>
                    <option value="email">Email</option>
                    <option value="nin">NIN</option> */}{
                      ListOfAvailablePolicies.map((policy) => (
                        <option key={policy.key} value={policy.key}>
                          {policy.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    value={newPolicy.priority}
                    onChange={(e) =>
                      setNewPolicy({
                        ...newPolicy,
                        priority: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Action
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  value={newPolicy.action}
                  onChange={(e) =>
                    setNewPolicy({
                      ...newPolicy,
                      action: e.target.value as ActionType,
                    })
                  }
                >
                  <option value={ActionType.BLOCK}>Block</option>
                  <option value={ActionType.WARN}>Warn</option>
                  <option value={ActionType.PASS}>Pass</option>
                </select>
              </div>
              {newPolicy.data_type === "email" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Domains, comma separated
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. txrnxp.com, vykensecurity.com"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    // value={newPolicy.metadata?.domains?.join(", ") || ""}
                    value={newPolicy.domains}
                    onChange={(e) => {
                      const domains = e.target.value;
                      setNewPolicy({
                        ...newPolicy,
                        domains,
                      });
                    }}
                  />
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Status
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enable or disable this policy
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNewPolicy({
                      ...newPolicy,
                      is_enabled: !newPolicy.is_enabled,
                    })
                  }
                  className="text-brand-600"
                >
                  {newPolicy.is_enabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
                >
                  {addConfig.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Create Policy"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
