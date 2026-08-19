import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Sparkles,
  User,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import API from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await API.get('/complaints');
        setComplaints(res.data.complaints || []);
      } catch (err) {
        console.error('Fetch student complaints error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const underReviewCount = complaints.filter((c) => c.status === 'Under Review').length;
  const inProgressCount = complaints.filter((c) =>
    ['Assigned', 'In Progress'].includes(c.status)
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const closedCount = complaints.filter((c) => c.status === 'Closed').length;
  const reopenedCount = complaints.filter((c) => c.status === 'Reopened').length;

  const resolvedToVerify = complaints.filter((c) => c.status === 'Resolved');

  const filteredComplaints = complaints.filter((c) => {
    if (activeTab === 'Pending') return c.status === 'Pending' || c.status === 'Under Review';
    if (activeTab === 'In Progress')
      return ['Assigned', 'In Progress', 'Reopened'].includes(c.status);
    if (activeTab === 'Resolved') return c.status === 'Resolved' || c.status === 'Closed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner - MUST SAY "Welcome, Student" */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-brand-500/10 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-3xl rounded-l-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Default empty avatar placeholder */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
              <User className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Student Portal
              </div>
              {/* MANDATORY: Primary greeting MUST be "Welcome, Student" */}
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                Welcome, Student
              </h1>
              <p className="text-xs text-brand-100 mt-0.5 max-w-xl">
                Submit facilities tickets, track maintenance progress, and verify issue resolution in real-time.
              </p>
            </div>
          </div>

          <Link
            to="/student/new-complaint"
            className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-slate-100 flex items-center justify-center gap-2 transition-all self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-brand-600" /> Raise New Complaint
          </Link>
        </div>
      </motion.div>

      {/* Resolution Verification Banner if Student has Resolved Complaints */}
      {resolvedToVerify.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-white">
                Action Required: {resolvedToVerify.length} Resolved Ticket(s)
              </h3>
              <p className="text-xs text-slate-400">
                Administration has marked your ticket as resolved. Please verify if the repair satisfies your request.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/complaints/${resolvedToVerify[0]._id || resolvedToVerify[0].complaintId}`)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shrink-0 shadow-lg shadow-emerald-500/20"
          >
            Verify Resolution
          </button>
        </motion.div>
      )}

      {/* Metrics Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
          <h3 className="text-xl font-black text-white mt-1">{totalCount}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
          <h3 className="text-xl font-black text-amber-500 mt-1">{pendingCount}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review</p>
          <h3 className="text-xl font-black text-blue-400 mt-1">{underReviewCount}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</p>
          <h3 className="text-xl font-black text-purple-400 mt-1">{inProgressCount}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
          <h3 className="text-xl font-black text-emerald-400 mt-1">{resolvedCount}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Closed</p>
          <h3 className="text-xl font-black text-slate-400 mt-1">{closedCount}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reopened</p>
          <h3 className="text-xl font-black text-rose-400 mt-1">{reopenedCount}</h3>
        </div>
      </div>

      {/* Complaints List & Filter */}
      <div className="bg-[#151C28] rounded-3xl border border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">My Raised Complaints</h2>
            <p className="text-xs text-slate-400">Select any ticket to inspect real-time progress history</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading complaints...</div>
        ) : filteredComplaints.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="font-bold text-sm">No complaints found</p>
            <p className="text-xs mt-1">You haven't submitted any complaints under this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((c) => (
              <motion.div
                key={c._id || c.complaintId}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/complaints/${c._id || c.complaintId}`)}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-brand-500/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 font-bold text-xs shrink-0">
                    {c.complaintId}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 hover:text-brand-400 transition-colors">
                      {c.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span>Category: <b>{c.category}</b></span>
                      <span>•</span>
                      <span>Location: <b>{c.location}</b></span>
                      <span>•</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
