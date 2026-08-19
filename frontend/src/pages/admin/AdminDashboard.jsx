import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  ShieldCheck,
  ArrowRight,
  User,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, complaintsRes, studentsRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/complaints'),
          API.get('/admin/students'),
        ]);
        setStats(statsRes.data);
        setRecentComplaints((complaintsRes.data.complaints || []).slice(0, 5));
        setRecentStudents((studentsRes.data.students || []).slice(0, 5));
      } catch (err) {
        console.error('Fetch admin stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        Loading administrative analytics dashboard...
      </div>
    );
  }

  const kpis = stats?.stats || {};
  const categoryData = stats?.categoryAnalytics || [];
  const monthlyTrends = stats?.monthlyTrends || [];

  return (
    <div className="space-y-6">
      {/* Header Banner - MANDATORY Name Pardhu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-4">
          {/* Default Empty Avatar Placeholder */}
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
            <User className="w-7 h-7" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Chief Administrator Desk
            </div>
            {/* MANDATORY: Admin Name MUST BE Pardhu */}
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Pardhu
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              System Administrator • Analytics, student rosters, and complaint lifecycle resolution
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/complaints')}
          className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-slate-100 flex items-center justify-center gap-2 transition-all self-start sm:self-auto shrink-0"
        >
          Open Ticket Workspace <ArrowRight className="w-4 h-4 text-purple-600" />
        </button>
      </div>

      {/* KPI Cards (Real Data from MongoDB Atlas) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students</p>
          <h3 className="text-xl font-black text-white mt-1">{kpis.totalStudents || 0}</h3>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">Registered</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tickets</p>
          <h3 className="text-xl font-black text-brand-400 mt-1">{kpis.totalComplaints || 0}</h3>
          <span className="text-[10px] text-slate-400 mt-1 inline-block">All Time</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
          <h3 className="text-xl font-black text-amber-500 mt-1">{kpis.pending || 0}</h3>
          <span className="text-[10px] text-amber-400 mt-1 inline-block">Awaiting Review</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</p>
          <h3 className="text-xl font-black text-purple-400 mt-1">{kpis.inProgress || 0}</h3>
          <span className="text-[10px] text-purple-400 mt-1 inline-block">Active Repair</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
          <h3 className="text-xl font-black text-emerald-400 mt-1">{kpis.resolved || 0}</h3>
          <span className="text-[10px] text-emerald-400 mt-1 inline-block">Awaiting Close</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Closed</p>
          <h3 className="text-xl font-black text-slate-400 mt-1">{kpis.closed || 0}</h3>
          <span className="text-[10px] text-slate-500 mt-1 inline-block">Closed</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reopened</p>
          <h3 className="text-xl font-black text-rose-400 mt-1">{kpis.reopened || 0}</h3>
          <span className="text-[10px] text-rose-400 mt-1 inline-block">Reopened</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#151C28] border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" /> Intake &amp; Resolution Velocity
              </h3>
              <p className="text-[11px] text-slate-400">Monthly intake vs resolved ticket volume</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorComplaints)"
                  name="Total Intake"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="p-6 rounded-3xl bg-[#151C28] border border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" /> Category Distribution
            </h3>
            <p className="text-[11px] text-slate-400">Distribution by campus facility</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {categoryData.length === 0 ? (
              <p className="text-xs text-slate-400">No category data registered</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-6 rounded-3xl bg-[#151C28] border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Complaint Log</h3>
            <p className="text-xs text-slate-400">Latest tickets requiring administrative action</p>
          </div>
          <button
            onClick={() => navigate('/admin/complaints')}
            className="text-xs font-bold text-brand-400 hover:underline"
          >
            View All in Workspace
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Ticket ID</th>
                <th className="pb-3 px-2">Student Name</th>
                <th className="pb-3 px-2">Title</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Priority</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentComplaints.map((c) => (
                <tr key={c._id || c.complaintId} className="hover:bg-slate-900/40">
                  <td className="py-3 px-2 font-bold text-brand-400">{c.complaintId}</td>
                  {/* ADMIN PORTAL: Can see actual student name (e.g. Alex Mercer) */}
                  <td className="py-3 px-2 text-slate-200">
                    {c.studentInfo?.fullName || 'Student'}
                  </td>
                  <td className="py-3 px-2 font-medium text-slate-100 max-w-xs truncate">
                    {c.title}
                  </td>
                  <td className="py-3 px-2 text-slate-400">{c.category}</td>
                  <td className="py-3 px-2">
                    <span className="font-semibold text-slate-300">{c.priority}</span>
                  </td>
                  <td className="py-3 px-2">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => navigate(`/admin/complaints?id=${c._id || c.complaintId}`)}
                      className="px-3 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 font-semibold"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
