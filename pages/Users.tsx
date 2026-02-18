import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { User, UserRole } from '../types';
import { Plus, Search, MoreHorizontal, Edit2, Trash2, X, Shield, Mail, Briefcase, Check, Settings, Briefcase as BriefcaseIcon } from 'lucide-react';

export const Users: React.FC = () => {
  const { state, dispatch } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Department Management State
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [tempDeptName, setTempDeptName] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.USER,
    department: 'Engineering',
    status: 'Active'
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: UserRole.USER,
        department: state.departments[0] || 'Unassigned',
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
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || '')}&background=random`,
        name: formData.name || 'Unknown',
        email: formData.email || '',
        role: formData.role || UserRole.USER,
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
    if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_USER', payload: id });
    }
  };

  // Department Management Handlers
  const handleAddDept = () => {
    if (newDeptName.trim()) {
        dispatch({ type: 'ADD_DEPARTMENT', payload: newDeptName.trim() });
        setNewDeptName('');
    }
  };

  const handleUpdateDept = (oldName: string) => {
    if (tempDeptName.trim() && tempDeptName !== oldName) {
        dispatch({ type: 'UPDATE_DEPARTMENT', payload: { oldName, newName: tempDeptName.trim() } });
    }
    setEditingDept(null);
    setTempDeptName('');
  };

  const handleDeleteDept = (deptName: string) => {
    if (window.confirm(`Delete department "${deptName}"? Users in this department will be moved to "Unassigned".`)) {
        dispatch({ type: 'DELETE_DEPARTMENT', payload: deptName });
    }
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
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage access and roles for your organization.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setIsDeptModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl transition-colors shadow-sm"
            >
                <Settings className="w-4 h-4 mr-2" />
                Manage Departments
            </button>
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
                <p className="text-xs font-medium text-slate-500 uppercase">Admins</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{state.users.filter(u => u.role === UserRole.ADMIN).length}</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                <Shield className="w-5 h-5" />
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
                        <th className="px-6 py-4">Role</th>
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
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    user.role === UserRole.ADMIN 
                                        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' 
                                        : user.role === UserRole.SECURITY
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                {user.department}
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

      {/* Department Management Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDeptModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="text-lg leading-6 font-bold text-slate-900 dark:text-white">
                            Manage Departments
                        </h3>
                        <button onClick={() => setIsDeptModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-3">
                            {state.departments.map(dept => (
                                <div key={dept} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                    {editingDept === dept ? (
                                        <div className="flex-1 flex items-center gap-2">
                                            <input 
                                                autoFocus
                                                type="text" 
                                                className="block w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white"
                                                value={tempDeptName}
                                                onChange={(e) => setTempDeptName(e.target.value)}
                                            />
                                            <button onClick={() => handleUpdateDept(dept)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingDept(null)} className="p-1 text-red-500 hover:bg-red-100 rounded">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center">
                                                <BriefcaseIcon className="w-4 h-4 text-slate-400 mr-3" />
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{dept}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => { setEditingDept(dept); setTempDeptName(dept); }} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDeleteDept(dept)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex gap-2">
                             <input 
                                type="text"
                                placeholder="New Department Name"
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                                value={newDeptName}
                                onChange={(e) => setNewDeptName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddDept()}
                             />
                             <button 
                                onClick={handleAddDept}
                                disabled={!newDeptName.trim()}
                                className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                 Add
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* User Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="text-lg leading-6 font-bold text-slate-900 dark:text-white" id="modal-title">
                            {editingUser ? 'Edit User' : 'Invite New User'}
                        </h3>
                        <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-4 w-4 text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:text-white sm:text-sm"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                <select 
                                    className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-lg dark:bg-slate-700 dark:text-white"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                                >
                                    {Object.values(UserRole).map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                                <select 
                                    className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-lg dark:bg-slate-700 dark:text-white"
                                    value={formData.department}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                >
                                    {state.departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                    <option value="Unassigned">Unassigned</option>
                                </select>
                            </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                             <div className="flex gap-4">
                                <label className="inline-flex items-center">
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
                                <label className="inline-flex items-center">
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
                                className="w-full inline-flex justify-center rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none sm:text-sm"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-brand-600 text-base font-medium text-white hover:bg-brand-700 focus:outline-none sm:text-sm"
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