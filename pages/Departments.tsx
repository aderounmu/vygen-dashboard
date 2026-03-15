import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Shield, 
  Check,
  X,
  Info,
  Users
} from 'lucide-react';
import { useStore } from '../context/Store';
import { Department, Permission } from '../types';

export const Departments: React.FC = () => {
  const { state, dispatch } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as Permission[]
  });

  const filteredDepts = state.departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        description: dept.description,
        permissions: [...dept.permissions]
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: '',
        description: '',
        permissions: [Permission.VIEW_DASHBOARD]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      dispatch({
        type: 'UPDATE_DEPARTMENT',
        payload: {
          ...editingDept,
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        }
      });
    } else {
      const newDept: Department = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      };
      dispatch({ type: 'ADD_DEPARTMENT', payload: newDept });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department? This will affect users assigned to it.')) {
      dispatch({ type: 'DELETE_DEPARTMENT', payload: id });
    }
  };

  const togglePermission = (permission: Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Departments & Permissions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage organizational units and their access levels.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all shadow-sm shadow-brand-200 dark:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Create Department
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Departments</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{state.departments.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Permissions</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{Object.keys(Permission).length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Users Assigned</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{state.users.length}</p>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-bottom border-slate-100 dark:border-slate-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search departments..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredDepts.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                        {dept.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{dept.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
                      {dept.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {dept.permissions.slice(0, 3).map(p => (
                        <span key={p} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded-md">
                          {p.replace('_', ' ')}
                        </span>
                      ))}
                      {dept.permissions.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded-md">
                          +{dept.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(dept)}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(dept.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingDept ? 'Edit Department' : 'Create New Department'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Define access controls for this unit.</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department Name</label>
                  <input 
                    required
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
                    {formData.permissions.length} Selected
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(Permission).map((permission) => {
                    const isSelected = formData.permissions.includes(permission);
                    return (
                      <button
                        key={permission}
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
                            {permission.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                      </button>
                    );
                  })}
                </div>
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
                  {editingDept ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
