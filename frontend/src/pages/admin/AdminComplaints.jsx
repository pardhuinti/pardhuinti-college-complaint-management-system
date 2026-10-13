import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Send,
  X,
  Building,
  Wrench,
  Paperclip,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/common/Timeline';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const categories = [
  'All',
  'Classroom',
  'Laboratory',
  'Hostel',
  'Library',
  'Transport',
  'Electricity',
  'Water Supply',
  'Internet',
  'Cleanliness',
  'Other',
];

const statuses = [
  'All',
  'Pending',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
  'Reopened',
];

const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];

const AdminComplaints = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id');

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Admin update form state
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [remark, setRemark] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get('/complaints', {
        params: { search, category, status: statusFilter, priority: priorityFilter },
      });
      const list = res.data.complaints || [];
      setComplaints(list);

      if (initialId && !selectedComplaint) {
        const found = list.find((c) => c._id === initialId || c.complaintId === initialId);
        if (found) {
          openDrawer(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [search, category, statusFilter, priorityFilter]);

  const openDrawer = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewPriority(complaint.priority);
    setAssignedTo(complaint.assignedTo || '');
    setRemark('');
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setUpdating(true);
      const res = await API.patch(
        `/complaints/${selectedComplaint._id || selectedComplaint.complaintId}/status`,
        {
          status: newStatus,
          priority: newPriority,
          assignedTo,
          remark,
        }
      );

      toast.success('Complaint status and administrative remarks updated successfully!');
      setSelectedComplaint(res.data.complaint);
      setRemark('');
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Complaint Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Jira/Linear style administrative ticket desk
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name, ID, title, location..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              Status: {s}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              Priority: {p}
            </option>
          ))}
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-[#151C28] rounded-3xl border border-slate-800 p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading workspace complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Filter className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="font-bold text-sm">No complaints found</p>
            <p className="text-xs mt-1">Try resetting search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-3">Complaint ID</th>
                  <th className="pb-3 px-3">Student Name</th>
                  <th className="pb-3 px-3">Title &amp; Location</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Priority</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {complaints.map((c) => (
                  <tr
                    key={c._id || c.complaintId}
                    className="hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-3.5 px-3 font-bold text-brand-400">{c.complaintId}</td>
                    {/* ADMIN PORTAL: Sees actual student name (e.g. Alex Mercer, Rahul Kumar) */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-100">
                        {c.studentInfo?.fullName || 'Student'}
                      </div>
                      <div className="text-[10px] text-slate-400">{c.studentInfo?.studentId || 'ID'}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200 max-w-xs truncate">
                        {c.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{c.location}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-400">{c.category}</td>
                    <td className="py-3.5 px-3">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => openDrawer(c)}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
                      >
                        Inspect &amp; Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Action Slide-Over Drawer */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-[#151C28] border-l border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-brand-400 text-base">
                      {selectedComplaint.complaintId}
                    </span>
                    <PriorityBadge priority={selectedComplaint.priority} />
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {selectedComplaint.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Student Info Card */}
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    {/* ADMIN PORTAL: Displays actual registered student name */}
                    <h4 className="text-xs font-bold text-white">
                      {selectedComplaint.studentInfo?.fullName} ({selectedComplaint.studentInfo?.studentId})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {selectedComplaint.studentInfo?.department} • Phone:{' '}
                      {selectedComplaint.studentInfo?.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Status Lifecycle */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Lifecycle Timeline Tracker
                  </h4>
                  <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
                    <Timeline currentStatus={selectedComplaint.status} />
                  </div>
                </div>

                {/* Description & Location */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold">Location</span>
                    <span className="font-semibold text-slate-200">
                      {selectedComplaint.location}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Student Description
                    </span>
                    <p className="text-xs text-slate-300 p-4 rounded-2xl bg-slate-900 border border-slate-800 leading-relaxed whitespace-pre-wrap">
                      {selectedComplaint.description}
                    </p>
                  </div>
                </div>

                {/* Attachments */}
                {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Attachments
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedComplaint.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-brand-400 hover:underline"
                        >
                          <Paperclip className="w-4 h-4" /> View File Attachment
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Administrative Controls Form */}
                <form
                  onSubmit={handleAdminUpdate}
                  className="p-5 rounded-2xl bg-brand-500/5 border border-brand-500/20 space-y-4"
                >
                  <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Update Status &amp; Dispatch Remarks (Admin)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Lifecycle Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                        <option value="Reopened">Reopened</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Assigned Service Desk
                      </label>
                      <input
                        type="text"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        placeholder="e.g. IT Support Sam"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Add Official Administrative Remark
                    </label>
                    <textarea
                      rows={3}
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="e.g. Technician dispatched to replace fuse and test line voltage..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {updating ? 'Saving Updates...' : 'Save &amp; Dispatch Updates'}
                    </button>
                  </div>
                </form>

                {/* Remarks Log */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Remarks Log Feed
                  </h4>
                  {selectedComplaint.adminRemarks && selectedComplaint.adminRemarks.length > 0 ? (
                    <div className="space-y-2">
                      {selectedComplaint.adminRemarks.map((rem, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                          <div className="flex items-center justify-between text-brand-400 font-bold mb-1">
                            <span>{rem.addedBy || 'Admin'}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(rem.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-300">{rem.remark}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No admin remarks recorded yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminComplaints;
