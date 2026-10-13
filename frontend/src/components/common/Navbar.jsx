import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Sun, Moon, LogOut, User, Menu, ShieldCheck } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';
import API from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const displayName = isAdmin ? 'Admin' : (user?.fullName || 'Student');
  const logoLink = isAdmin ? '/admin/dashboard' : '/student/dashboard';

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await API.get('/notifications');
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error('Notification error:', err);
      }
    };
    if (user) {
      fetchUnread();
    }
  }, [user]);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-slate-900/90 dark:bg-[#151C28]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-6 flex items-center justify-between transition-colors">
        {/* Left Side: Sidebar Toggle & Official Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to={logoLink} className="flex items-center gap-3">
            <img
              src="/assets/complaint-management-logo.svg"
              alt="College Complaint Management System Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              {/* Default Empty Avatar Placeholder - NO AI photos */}
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-white leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                  {isAdmin && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                  {isAdmin ? 'Administrator' : 'Student Portal'}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 dark:bg-[#151C28] rounded-xl border border-slate-800 shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate(isAdmin ? '/admin/dashboard' : '/student/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-brand-400" /> Account Profile
                </button>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};

export default Navbar;
