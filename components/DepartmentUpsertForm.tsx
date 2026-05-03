import { BusinessPermission } from '@/services/business/types'
import { useGetPermissions } from '@/services/permissions/hooks'
import { Department } from '@/types'
import { Check, Info, Loader2, Shield, X } from 'lucide-react'
import React from 'react'

const DepartmentUpsertForm = ({
    title,
    submitTitle, 
    handleSubmit,
    handleCloseModal,
    formData,
    setFormData,
    isLoading = false,
    mode = "create"
}:{
    handleCloseModal : () => void,
    submitTitle: string, 
    handleSubmit: () => void
    title: string,
    mode: "create" | "edit",

    formData: Partial<Department>,
    setFormData:  React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    permissions: Array<BusinessPermission>;
}>>,
    isLoading?: boolean
}) => {

  const permissions = useGetPermissions()
  const togglePermission = (permission: BusinessPermission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Define access controls for this unit.</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}  className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department Name</label>
                  <input 
                    required
                    disabled ={mode === "edit"}
                    
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="e.g., Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <input 
                    required
                    disabled ={mode === "edit"}
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="Brief purpose of this department"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Permissions</label>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {(formData.permissions ?? []).length} Selected
                  </span>
                </div>
                
               {permissions.isLoading || !permissions?.data?.data || permissions?.data?.data.length < 1 ? <div className="flex justify-center item-center w-full h-full px-3 py-5">

                <Loader2 className="w-5 h-5 animate-spin" /> 
               </div>: <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-scroll">
                  {permissions?.data.data[0].map((permission, index) => {
                    const isSelected = (formData.permissions ?? []).filter((per) => permission.slug === per.slug).length >= 1;
                    return (
                      <button
                        key={`${permission.name}__${index}__permission`}
                        type="button"
                        onClick={() => togglePermission(permission)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                          isSelected 
                            ? 'bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800' 
                            : 'bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${
                            isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                          }`}>
                            <Shield className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-xs font-semibold ${
                            isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {permission.name.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                      </button>
                    );
                  })}
                </div>}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Permissions define what users in this department can see and do across the platform. 
                  Changes will apply immediately to all assigned users.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all shadow-sm shadow-brand-200 dark:shadow-none"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : submitTitle}
                </button>
              </div>
            </form>
          </div>
        </div>
  )
}

export default DepartmentUpsertForm