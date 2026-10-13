import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Users,
  Settings,
  X,
  HelpCircle,
  ShieldCheck,
  User,
  LogOut,
  Bell,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const displayName = isAdmin ? 'Admin' : (user?.fullName || 'Student');
  const roleSubtitle = isAdmin ? 'Administrator' : 'Student Portal';

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/new-complaint', label: 'Raise Complaint', icon: PlusCircle },
    { to: '/student/complaints', label: 'My Complaints', icon: FileText },
    { to: '/student/profile', label: 'Profile & Settings', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Complaint Workspace', icon: FileText },
    { to: '/admin/students', label: 'Student Roster', icon: Users },
    { to: '/student/profile', label: 'System Settings', icon: Settings },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 dark:bg-[#151C28] border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <NavLink to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center gap-2">
            <img
              src="/assets/complaint-management-logo.svg"
              alt="Official System Logo"
              className="h-9 w-auto object-contain"
            />
          </NavLink>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card - Default Empty Avatar (NO AI Images) */}
        <div className="m-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">
              {displayName}
            </h4>
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
              {isAdmin && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
              {roleSubtitle}
            </p>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleSignOut}
            className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
