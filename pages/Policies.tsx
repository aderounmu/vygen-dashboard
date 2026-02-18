import React from 'react';
import { useStore } from '../context/Store';
import { ActionType, Policy } from '../types';
import { Plus, Trash2, ToggleLeft, ToggleRight, Save } from 'lucide-react';

export const Policies: React.FC = () => {
  const { state, dispatch } = useStore();

  const togglePolicy = (policy: Policy) => {
    dispatch({
        type: 'UPDATE_POLICY',
        payload: { ...policy, enabled: !policy.enabled }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DLP Policies</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Configure rules to govern AI usage and data flow.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Policy
        </button>
      </div>

      <div className="grid gap-6">
        {state.policies.map((policy) => (
            <div key={policy.id} className={`bg-white dark:bg-slate-800 rounded-xl border transition-all ${policy.enabled ? 'border-slate-200 dark:border-slate-700 shadow-sm' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}>
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${policy.enabled ? 'bg-brand-50 text-brand-600 dark:bg-slate-700 dark:text-brand-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{policy.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{policy.description}</p>
                            </div>
                        </div>
                        <button onClick={() => togglePolicy(policy)} className="text-brand-600 hover:text-brand-700 dark:text-brand-400 focus:outline-none">
                            {policy.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                        </button>
                    </div>

                    {/* Logic Builder Visualization */}
                    <div className="mt-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
                            <span className="font-mono text-xs text-slate-500 uppercase tracking-wide">IF</span>
                            <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-200 font-medium">
                                Data Type includes <span className="text-brand-600">{policy.conditionDataType}</span>
                            </div>
                            <span className="font-mono text-xs text-slate-500 uppercase tracking-wide">AND</span>
                            <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-200 font-medium">
                                Tool is <span className="text-brand-600">{policy.conditionTool}</span>
                            </div>
                            <span className="font-mono text-xs text-slate-500 uppercase tracking-wide">THEN</span>
                            <div className={`px-3 py-1.5 border rounded-md font-bold flex items-center ${
                                policy.action === ActionType.BLOCK ? 'bg-red-50 border-red-200 text-red-700' :
                                policy.action === ActionType.WARN ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                'bg-blue-50 border-blue-200 text-blue-700'
                            }`}>
                                {policy.action}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end items-center space-x-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button className="text-sm text-slate-500 hover:text-red-500 flex items-center transition-colors">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                        </button>
                        <button className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center transition-colors">
                            <Save className="w-4 h-4 mr-1" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};