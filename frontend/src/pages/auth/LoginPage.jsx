import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Building,
} from 'lucide-react';
import Footer from '../../components/common/Footer';

const LoginPage = () => {
  const [roleTab, setRoleTab] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(email, password, roleTab === 'admin' ? 'admin' : 'student');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md bg-[#151C28] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl relative z-10 space-y-6">
          {/* Institutional Branding */}
          <div className="text-center space-y-2">
            <img
              src="/assets/complaint-management-logo.svg"
              alt="College Complaint Management System Logo"
              className="h-14 mx-auto object-contain"
            />
            <h1 className="text-base font-bold text-white tracking-tight">
              Campus Grievance &amp; Facilities Portal
            </h1>
            <p className="text-xs text-slate-400">
              Submit campus maintenance requests, track repair status, and verify institutional resolutions.
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setRoleTab('student')}
              className={`py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                roleTab === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Student Access
            </button>

            <button
              type="button"
              onClick={() => setRoleTab('admin')}
              className={`py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                roleTab === 'admin'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Administration
            </button>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {roleTab === 'admin' ? 'Administrator Institutional Email' : 'Student College Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors mt-2 ${
                roleTab === 'admin'
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {loading ? 'Authenticating...' : `Sign In as ${roleTab === 'admin' ? 'Administrator' : 'Student'}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800">
            Enrolled student without an account?{' '}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
              Register Student Account
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
