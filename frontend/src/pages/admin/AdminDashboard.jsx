import React, { useEffect, useState } from 'react';
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

// Professional institutional palette: clean blues, slates, teals, and ambers (NO purple)
const COLORS = ['#2563eb', '#0284c7', '#0d9488', '#f59e0b', '#10b981', '#475569', '#ef4444'];

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
      {/* Header Banner - Solid Institutional Navy/Slate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-[#151C28] border border-slate-800 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
            <User className="w-6 h-6" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Chief Administrator Desk
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Pardhu
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              System Administrator • Facilities operations, complaint records, and student rosters
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/complaints')}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors self-start sm:self-auto shrink-0"
        >
          Open Ticket Workspace <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* KPI Cards (Real Data from MongoDB Atlas) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Students</p>
          <h3 className="text-xl font-bold text-white mt-1">{kpis.totalStudents || 0}</h3>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 inline-block">Registered</span>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Tickets</p>
          <h3 className="text-xl font-bold text-blue-400 mt-1">{kpis.totalComplaints || 0}</h3>
          <span className="text-[10px] text-slate-400 mt-1 inline-block">All Time</span>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
          <h3 className="text-xl font-bold text-amber-500 mt-1">{kpis.pending || 0}</h3>
          <span className="text-[10px] text-amber-400 mt-1 inline-block">Awaiting Review</span>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
          <h3 className="text-xl font-bold text-sky-400 mt-1">{kpis.inProgress || 0}</h3>
          <span className="text-[10px] text-sky-400 mt-1 inline-block">Active Repair</span>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Resolved</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">{kpis.resolved || 0}</h3>
          <span className="text-[10px] text-emerald-400 mt-1 inline-block">Verified</span>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Closed</p>
          <h3 className="text-xl font-bold text-slate-400 mt-1">{kpis.closed || 0}</h3>
          <span className="text-[10px] text-slate-500 mt-1 inline-block">Archived</span>
        </div>

        <div className="p-4 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Reopened</p>
          <h3 className="text-xl font-bold text-rose-400 mt-1">{kpis.reopened || 0}</h3>
          <span className="text-[10px] text-rose-400 mt-1 inline-block">Follow-up Required</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Intake &amp; Resolution Volume
              </h3>
              <p className="text-[11px] text-slate-400">Monthly intake vs resolved ticket trends</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={0.15}
                  fill="#2563eb"
                  name="Total Intake"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={0.15}
                  fill="#10b981"
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="p-6 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-sky-400" /> Category Distribution
            </h3>
            <p className="text-[11px] text-slate-400">Distribution across campus facilities</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {categoryData.length === 0 ? (
              <p className="text-xs text-slate-400">No category records registered</p>
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
                      borderRadius: '8px',
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
      <div className="p-6 rounded-xl bg-[#151C28] border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Complaint Log</h3>
            <p className="text-xs text-slate-400">Latest tickets requiring administrative action</p>
          </div>
          <button
            onClick={() => navigate('/admin/complaints')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
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
                  <td className="py-3 px-2 font-bold text-blue-400">{c.complaintId}</td>
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
                      className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
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
