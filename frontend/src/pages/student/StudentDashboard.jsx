import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  User,
  ShieldAlert,
  RotateCcw,
  GraduationCap,
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
      {/* Welcome Banner - Solid Institutional Slate/Navy */}
      <div className="p-6 rounded-xl bg-[#151C28] border border-slate-800 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
              <User className="w-6 h-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-blue-400 text-xs font-semibold mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Student Portal Desk
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Welcome, Student
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                Submit campus facilities tickets, monitor maintenance progress, and verify issue resolutions.
              </p>
            </div>
          </div>

          <Link
            to="/student/new-complaint"
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-white" /> Raise New Complaint
          </Link>
        </div>
      </div>

      {/* Resolution Verification Banner if Student has Resolved Complaints */}
      {resolvedToVerify.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-xs font-semibold text-white">
                Action Required: {resolvedToVerify.length} Resolved Ticket(s)
              </h3>
              <p className="text-xs text-slate-400">
                Administration has marked your ticket as resolved. Please verify if the maintenance meets your expectation.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/complaints/${resolvedToVerify[0]._id || resolvedToVerify[0].complaintId}`)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shrink-0 transition-colors"
          >
            Verify Resolution
          </button>
        </div>
      )}

      {/* Metrics Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</p>
          <h3 className="text-xl font-bold text-white mt-1">{totalCount}</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
          <h3 className="text-xl font-bold text-amber-500 mt-1">{pendingCount}</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Review</p>
          <h3 className="text-xl font-bold text-blue-400 mt-1">{underReviewCount}</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
          <h3 className="text-xl font-bold text-sky-400 mt-1">{inProgressCount}</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Resolved</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">{resolvedCount}</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Closed</p>
          <h3 className="text-xl font-bold text-slate-400 mt-1">{closedCount}</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Reopened</p>
          <h3 className="text-xl font-bold text-rose-400 mt-1">{reopenedCount}</h3>
        </div>
      </div>

      {/* Complaints List & Filter */}
      <div className="bg-[#151C28] rounded-xl border border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-white">My Registered Complaints</h2>
            <p className="text-xs text-slate-400">Select any ticket to inspect real-time progress history</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 self-start sm:self-auto">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
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
            <p className="font-semibold text-sm text-slate-300">No complaints found</p>
            <p className="text-xs mt-1">You have no complaints matching the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((c) => (
              <div
                key={c._id || c.complaintId}
                onClick={() => navigate(`/complaints/${c._id || c.complaintId}`)}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-md bg-blue-500/10 text-blue-400 font-bold text-xs shrink-0">
                    {c.complaintId}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                      {c.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span>Category: <b className="text-slate-300">{c.category}</b></span>
                      <span>•</span>
                      <span>Location: <b className="text-slate-300">{c.location}</b></span>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
