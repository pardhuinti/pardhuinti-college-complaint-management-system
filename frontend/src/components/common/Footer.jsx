import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 pt-6 pb-6 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        {/* Left: Official College System Info */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            College Complaint &amp; Grievance Management System
          </span>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-500">Official Campus Portal</span>
        </div>

        {/* Right: Real Legal and Compliance Links */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <Link
            to="/privacy-policy"
            className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 font-medium"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Privacy Policy
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link
            to="/terms-and-conditions"
            className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Terms &amp; Conditions
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-400 dark:text-slate-500">
            © 2026 Campus Administration. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
