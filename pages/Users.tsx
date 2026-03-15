import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { User } from '../types';
import { Plus, Search, Edit2, Trash2, X, Shield, Mail, Check, Briefcase } from 'lucide-react';

export const Users: React.FC = () => {
  const { state, dispatch } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    country: 'NGA',
    status: 'Active'
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: state.departments[0]?.name || 'Unassigned',
        country: 'NGA',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      dispatch({
        type: 'UPDATE_USER',
        payload: { ...editingUser, ...formData } as User
      });
    } else {
      // Add new user
      const newUser: User = {
        id: `u-${Date.now()}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName || '')}+${encodeURIComponent(formData.lastName || '')}&background=random`,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email || '',
        country: formData.country || 'NGA',
        department: formData.department || 'General',
        status: formData.status || 'Active'
      };
      
      dispatch({
        type: 'ADD_USER',
        payload: newUser
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_USER', payload: id });
  };

  // Filter users based on global search query
  const filteredUsers = state.users.filter(user => 
    user.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage access and departments for your organization.</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Total Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{state.users.length}</p>
            </div>
            <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600">
                <Shield className="w-5 h-5" />
            </div>
         </div>
         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Departments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{state.departments.length}</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                <Briefcase className="w-5 h-5" />
            </div>
         </div>
         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Active Now</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{state.users.filter(u => u.status === 'Active').length}</p>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
                <Shield className="w-5 h-5" />
            </div>
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
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
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600" />
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
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
                                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                    <span className="text-sm text-slate-600 dark:text-slate-300">{user.status}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenModal(user)}
                                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        
        {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-slate-500">
                <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>No users found matching "{state.searchQuery}"</p>
            </div>
        )}
      </div>

      {/* User Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                    onClick={handleCloseModal}
                ></div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full z-10 border border-slate-200 dark:border-slate-700">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="text-lg leading-6 font-bold text-slate-900 dark:text-white" id="modal-title">
                            {editingUser ? 'Edit User' : 'Invite New User'}
                        </h3>
                        <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                                    placeholder="John"
                                    value={formData.firstName || ''}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                                    placeholder="Doe"
                                    value={formData.lastName || ''}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                                    placeholder="john@company.com"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                            <input 
                                type="text" 
                                required
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                                placeholder="NGA"
                                value={formData.country || ''}
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department (Role)</label>
                            <select 
                                className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-lg dark:bg-slate-700 dark:text-white"
                                value={formData.department || 'Unassigned'}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                            >
                                {state.departments.map(dept => (
                                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                                ))}
                                <option value="Unassigned">Unassigned</option>
                            </select>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                             <div className="flex gap-4">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        className="form-radio text-brand-600 focus:ring-brand-500" 
                                        name="status" 
                                        value="Active"
                                        checked={formData.status === 'Active'}
                                        onChange={() => setFormData({...formData, status: 'Active'})}
                                    />
                                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Active</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        className="form-radio text-brand-600 focus:ring-brand-500" 
                                        name="status" 
                                        value="Inactive"
                                        checked={formData.status === 'Inactive'}
                                        onChange={() => setFormData({...formData, status: 'Inactive'})}
                                    />
                                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Inactive</span>
                                </label>
                             </div>
                        </div>

                        <div className="mt-5 sm:mt-6 flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none sm:text-sm transition-colors"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-brand-600 text-base font-medium text-white hover:bg-brand-700 focus:outline-none sm:text-sm transition-colors"
                            >
                                {editingUser ? 'Save Changes' : 'Send Invite'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
