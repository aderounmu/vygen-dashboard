import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useStore } from './context/Store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ActivityLog } from './pages/ActivityLog';
import { Policies } from './pages/Policies';
import { Users } from './pages/Users';
import { Departments } from './pages/Departments';
import { Prompting } from './pages/Prompting';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useStore();
  const location = useLocation();
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="policies" element={<Policies />} />
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="prompting" element={<Prompting />} />
        
        {/* Fallback routes for demo */}
        <Route path="settings" element={<div className="p-8 text-center text-slate-500">Global Configuration (Coming Soon)</div>} />
        <Route path="reports" element={<div className="p-8 text-center text-slate-500">Reporting Engine (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
