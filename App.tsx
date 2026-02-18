import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/Store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ActivityLog } from './pages/ActivityLog';
import { Policies } from './pages/Policies';
import { Users } from './pages/Users';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="policies" element={<Policies />} />
            <Route path="users" element={<Users />} />
            
            {/* Fallback routes for demo */}
            <Route path="settings" element={<div className="p-8 text-center text-slate-500">Global Configuration (Coming Soon)</div>} />
            <Route path="reports" element={<div className="p-8 text-center text-slate-500">Reporting Engine (Coming Soon)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;