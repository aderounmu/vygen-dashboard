import React from "react";
import {
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider, useStore } from "./context/Store";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ActivityLog } from "./pages/ActivityLog";
import { Policies } from "./pages/Policies";
import { Users } from "./pages/Users";
import { Departments } from "./pages/Departments";
import { Prompting } from "./pages/Prompting";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { useGetBusinesses } from "./services/business/hooks";
import { useGetUsers } from "./services/user/hooks";
import { AcceptInvite } from "./pages/AcceptInvite";
import useHydrateBusinessProfile from "./hooks/useHydrateBusinessProfile";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, dispatch } = useStore();
  const location = useLocation();
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  // const { state, dispatch } = useStore();

  // const business = useGetBusinesses();
  // const user = useGetUsers();


  //   const user = us
  // React.useEffect(() => {
  //   const _business = business.data?.data[0];
  //   const _user = user.data?.data[0];
  //   //  if(_business && _user){
  //   //     dispatch({
  //   //        type: 'SET_ORGANIZATION',
  //   //        payload: {
  //   //           organization: {
  //   //             id: _business.id,
  //   //             name: _business.name,
  //   //             email: _business.email,
  //   //             reference: _business.reference
  //   //           }
  //   //        }
  //   //     })
  //   //  }

  //   //  if(_user){

  //   //  }

  //   if (_business && _user) {
  //     dispatch({
  //       type: "LOGIN",
  //       payload: {
  //         user: {
  //           id: _user.id,
  //           firstName: _user.first_name,
  //           lastName: _user.last_name,
  //           name: `${_user.first_name} ${_user.last_name}`,
  //           email: _user.email,
  //           country: _user.country,
  //           department: "Security",
  //           avatar: "https://picsum.photos/seed/admin/32/32",
  //           status: "Active",
  //         },
  //         organization: {
  //           id: _business.id,
  //           name: _business.name,
  //           email: _business.email,
  //           reference: _business.reference,
  //         },
  //       },
  //     });
  //   }
  // }, [business.data, user.data]);

  

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
       <Route
          path="/api/v1/business/business-invite/:bussinessId/:bussinessReference/:inviteReference"
          element={<AcceptInvite/>}
        />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="policies" element={<Policies />} />
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="prompting" element={<Prompting />} />
       

        {/* Fallback routes for demo */}
        <Route
          path="settings"
          element={
            <div className="p-8 text-center text-slate-500">
              Global Configuration (Coming Soon)
            </div>
          }
        />
        <Route
          path="reports"
          element={
            <div className="p-8 text-center text-slate-500">
              Reporting Engine (Coming Soon)
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
