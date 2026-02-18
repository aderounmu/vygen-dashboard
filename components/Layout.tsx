import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  FileText, 
  Users, 
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
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/Store';

export const Layout: React.FC = () => {
  const { state, dispatch } = useStore();
  const location = useLocation();

  const menuGroups = [
    {
      title: 'GENERAL',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Activity Log', path: '/activity', icon: Activity },
        { name: 'Policies', path: '/policies', icon: ShieldAlert },
        { name: 'Users', path: '/users', icon: Users, badge: '8' },
      ]
    },
    {
      title: 'TOOLS',
      items: [
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Automation', path: '/automation', icon: Zap, badge: 'BETA' },
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { name: 'Security', path: '/security', icon: Shield },
        { name: 'Help', path: '/help', icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 flex flex-col z-20 transition-colors border-r border-slate-100 dark:border-slate-800">
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-2">
            <span className="text-brand-600 dark:text-brand-400">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </span>
            <span className="text-2xl font-bold tracking-tight text-brand-600 dark:text-white">Nexus</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 group-hover:text-slate-500'
                        }`} />
                        {item.name}
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.badge === 'BETA' 
                            ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300' 
                            : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                        }`}>
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
        <div className="p-4">
           <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 mb-3">
              <div className="flex items-center gap-3 mb-3">
                 <div className="bg-brand-500 rounded-lg p-1.5 text-white">
                    <Shield className="w-4 h-4" />
                 </div>
                 <div>
                    <p className="text-xs font-medium text-slate-500">Team</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Security Ops</p>
                 </div>
                 <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
              </div>
           </div>
           <button className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700">
             Upgrade Plan
           </button>
           <p className="text-center text-[10px] text-slate-400 mt-3">© 2024 Nexus Inc.</p>
        </div>
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
                  onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                   <span className="text-xs text-slate-400 font-medium">⌘ + F</span>
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center space-x-2">
              <button 
                onClick={() => dispatch({ type: 'SET_THEME', payload: !state.isDarkMode })}
                className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                {state.isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
            
              <div className="pl-4 flex items-center">
                 <img 
                    src={state.user.avatar} 
                    alt="User" 
                    className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                  />
                  <div className="ml-3 hidden md:block">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{state.user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Business</p>
                  </div>
              </div>
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