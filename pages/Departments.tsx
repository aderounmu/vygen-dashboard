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
import { Action, AppState, useStore } from '../context/Store';
import { Department, Permission } from '../types';
import { BusinessPermission } from '@/services/business/types';
import DepartmentCreateModal from '@/components/DepartmentCreateModal';
import DepartmentEditModal from '@/components/DepartmentEditModal';
import { useGetBusinessRoles } from '@/services/business/hooks';
import { AppDispatch } from 'recharts/types/state/store';

export const Departments: React.FC = () => {
  const { state, dispatch } :{ state : AppState, dispatch : React.Dispatch<Action>} = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // permissions: [] as Permission[]
    permissions: [] as Array<BusinessPermission>
  });

  const {data , isLoading} = useGetBusinessRoles(state.organization.id)
  // const filteredDepts = state.departments.filter(dept => 
  //   dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const filteredDepts = !data?.data || data?.data.length < 1 ? [] : data?.data?.map((role)=>({
    id: role.id,
    name: role.role,
    description: "",
    permissions: role.permissions,
   
 }))

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
        permissions: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (editingDept) {
  //     dispatch({
  //       type: 'UPDATE_DEPARTMENT',
  //       payload: {
  //         ...editingDept,
  //         name: formData.name,
  //         description: formData.description,
  //         permissions: formData.permissions
  //       }
  //     });
  //   } else {
  //     const newDept: Department = {
  //       id: Math.random().toString(36).substr(2, 9),
  //       name: formData.name,
  //       description: formData.description,
  //       permissions: formData.permissions
  //     };
  //     dispatch({ type: 'ADD_DEPARTMENT', payload: newDept });
  //   }
  //   handleCloseModal();
  // };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department? This will affect users assigned to it.')) {
      dispatch({ type: 'DELETE_DEPARTMENT', payload: id });
    }
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
                          {p.name.replace('_', ' ')}
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
                        // onClick={() => handleOpenModal(dept)}
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
       <>
        {editingDept ? <DepartmentEditModal handleCloseModal={handleCloseModal} formData={formData} setFormData={setFormData}></DepartmentEditModal> :<DepartmentCreateModal handleCloseModal={handleCloseModal} formData={formData} setFormData={setFormData}/>}
       </>
      )}
    </div>
  );
};
