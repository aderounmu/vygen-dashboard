import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/Store';
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useLogin } from '@/services/auth/hook';
import { toast } from 'sonner';
import PasswordInput from '@/components/PasswordInput';
import Logo from "@/assets/vyken_security.png";

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { dispatch } = useStore();
  const navigate = useNavigate();
  


  const login = localStorage.getItem("sessionId");
  //Find a way to get user Info and organization info etc to store
  if(login){
    dispatch({
      type: 'SET_AUTHENTICATION',
      payload: null
    })
    navigate('/');
  }

  const loginService = useLogin({
     successFn : (data) => {
          toast.success("Login Successful")
          const user = data.data[0].user
          dispatch({
          type: 'LOGIN',
          payload: {
            user: {
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
              country: user.country,
              department: 'Security',
              avatar: 'https://picsum.photos/seed/admin/32/32',
              status: 'Active'
            },
            organization: {
              id: '',
              name: '',
              email: ''
            }
          }
          });
          navigate('/');
     },
     failureFn: (error) => {
        const message = ""
        toast.error(`Login Failed`)
     }
  })


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');

  //   // Simulate API call
  //   setTimeout(() => {
  //     if (email && password) {
  //       dispatch({
  //         type: 'LOGIN',
  //         payload: {
  //           user: {
  //             id: 'u-admin',
  //             firstName: 'Alex',
  //             lastName: 'Sentinel',
  //             name: 'Alex Sentinel',
  //             email: email,
  //             country: 'NGA',
  //             role: UserRole.ADMIN,
  //             department: 'Security',
  //             avatar: 'https://picsum.photos/seed/admin/32/32',
  //             status: 'Active'
  //           },
  //           organization: {
  //             id: 'org-1',
  //             name: 'Vyken Security',
  //             email: 'contact@vyken.security'
  //           }
  //         }
  //       });
  //       navigate('/');
  //     } else {
  //       setError('Please enter both email and password');
  //     }
  //     setIsLoading(false);
  //   }, 1000);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    await loginService.mutateAsync({
        email: email,
        password: password,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          {/* <div className="bg-brand-600 p-3 rounded-2xl shadow-lg shadow-brand-500/20 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Vyken Security</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">AI Governance & Protection</p> */}
          <img src={Logo} alt="Vykensecurity Logo" className="h-12 w-auto" />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none p-8 border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Welcome back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                {/* <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /> */}
                <PasswordInput
                setPassword={setPassword}
                password={password}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loginService.isPending}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              {loginService.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 font-bold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
