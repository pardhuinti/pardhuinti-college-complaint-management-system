import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Lock, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const StudentProfile = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mandatory Role-Based Display Name Rule
  const displayName = isAdmin ? 'Pardhu' : 'Student';
  const portalBadge = isAdmin ? 'Administrator Desk' : 'Student Portal';

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword) {
      return toast.error('Please enter your current password');
    }
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      setLoading(true);
      const res = await API.put('/auth/change-password', {
        currentPassword: oldPassword,
        newPassword,
      });

      toast.success(res.data?.message || 'Password updated successfully in MongoDB!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(err.response?.data?.message || 'Failed to update password. Verify current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Account Profile &amp; System Settings</h1>
        <p className="text-xs text-slate-400">
          View institutional credentials and manage account security password
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Identity Card - DEFAULT EMPTY AVATAR PLACEHOLDER (NO AI Photos) */}
        <div className="md:col-span-1 p-6 rounded-3xl bg-[#151C28] border border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 shadow-inner">
            <User className="w-12 h-12" />
          </div>
          <div>
            {/* Display Name: "Pardhu" for Admin, "Student" for Student Portal */}
            <h3 className="font-bold text-white text-lg">{displayName}</h3>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase">
              {portalBadge}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Account ID:</span>
              <span className="font-bold text-white">{user?.studentId || 'ADM-001'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Account Status:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Security Auth:</span>
              <span className="font-bold text-brand-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> MongoDB Atlas
              </span>
            </div>
          </div>
        </div>

        {/* Account Details & Password Change */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-[#151C28] border border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" /> Account &amp; Access Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="block text-slate-500 text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-semibold text-white">{user?.email}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="block text-slate-500 text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-semibold text-white">
                  {user?.phoneNumber || '+1 800 555 0199'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="block text-slate-500 text-[10px] uppercase font-bold">Department</span>
                <span className="font-semibold text-white">
                  {user?.department || (isAdmin ? 'Administration & Infrastructure' : 'Computer Science & Engineering')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="block text-slate-500 text-[10px] uppercase font-bold">Role Privilege</span>
                <span className="font-semibold text-emerald-400 capitalize">
                  {user?.role || 'user'} Account
                </span>
              </div>
            </div>
          </div>

          {/* Password Change Form */}
          <form
            onSubmit={handlePasswordChange}
            className="p-6 rounded-3xl bg-[#151C28] border border-slate-800 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-400" /> Security Settings - Change Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Current Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm New</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
