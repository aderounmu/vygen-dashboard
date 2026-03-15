import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/Store';
import { Shield, User as UserIcon, Building, Mail, Lock, Globe, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: User Data
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: 'NGA',
    password: ''
  });

  // Step 2: Organization Data
  const [orgData, setOrgData] = useState({
    name: '',
    email: ''
  });

  const { dispatch } = useStore();
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      dispatch({
        type: 'REGISTER',
        payload: {
          user: {
            id: `u-${Date.now()}`,
            firstName: userData.first_name,
            lastName: userData.last_name,
            name: `${userData.first_name} ${userData.last_name}`,
            email: userData.email,
            country: userData.country,
            department: 'Executive',
            avatar: `https://picsum.photos/seed/${userData.email}/32/32`,
            status: 'Active'
          },
          organization: {
            id: `org-${Date.now()}`,
            name: orgData.name,
            email: orgData.email
          }
        }
      });
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 p-2 rounded-xl shadow-lg shadow-brand-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create Account</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
              <div className={`w-8 h-0.5 rounded-full ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`} />
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            {step === 1 ? 'Tell us about yourself' : 'Tell us about your organization'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none p-8 border border-slate-100 dark:border-slate-700">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="John"
                    value={userData.first_name}
                    onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="Doe"
                    value={userData.last_name}
                    onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                  />
                </div>
              </div>

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
                    placeholder="john@example.com"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Country</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="NGA"
                    value={userData.country}
                    onChange={(e) => setUserData({...userData, country: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="••••••••"
                    value={userData.password}
                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Organization Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="Acme Corp"
                    value={orgData.name}
                    onChange={(e) => setOrgData({...orgData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Business Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="business@acme.com"
                    value={orgData.email}
                    onChange={(e) => setOrgData({...orgData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
