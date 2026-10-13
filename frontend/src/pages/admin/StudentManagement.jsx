import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  ShieldAlert,
  CheckCircle2,
  UserX,
  UserCheck,
  Mail,
  Phone,
  Building,
  User,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/common/StatusBadge';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Student Detail Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentComplaints, setStudentComplaints] = useState([]);
  const [loadingStudentDetail, setLoadingStudentDetail] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/students', {
        params: { search, department, status: statusFilter },
      });
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Fetch student roster error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, department, statusFilter]);

  const openStudentDetail = async (student) => {
    setSelectedStudent(student);
    try {
      setLoadingStudentDetail(true);
      const res = await API.get('/complaints', {
        params: { search: student.studentId || student.email },
      });
      setStudentComplaints(res.data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudentDetail(false);
    }
  };

  const toggleStudentStatus = async (studentId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    try {
      await API.patch(`/admin/students/${studentId}/status`, { status: nextStatus });
      toast.success(`Student account status updated to ${nextStatus}`);
      fetchStudents();
      if (selectedStudent && selectedStudent._id === studentId) {
        setSelectedStudent((prev) => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      toast.error('Failed to update student account status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">Student Roster &amp; Account Management</h1>
        <p className="text-xs text-slate-400">
          View registered student records, inspect complaint history, and manage institutional account access
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#151C28] border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student ID, full name, email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
        >
          <option value="All">Department: All</option>
          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
          <option value="Electronics & Communication">Electronics & Communication</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Information Technology">Information Technology</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-brand-500"
        >
          <option value="All">Status: All</option>
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>

      {/* Roster Table */}
      <div className="bg-[#151C28] rounded-3xl border border-slate-800 p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading registered student records...</div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="font-bold text-sm">No student records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-3">Student Info</th>
                  <th className="pb-3 px-3">Student ID</th>
                  <th className="pb-3 px-3">Department &amp; Year</th>
                  <th className="pb-3 px-3">Phone</th>
                  <th className="pb-3 px-3">Registration Date</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                    onClick={() => openStudentDetail(student)}
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {/* Empty Default Avatar Placeholder */}
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          {/* ADMIN PORTAL: Can see actual registered student name */}
                          <div className="font-bold text-slate-100">
                            {student.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-brand-400">
                      {student.studentId || 'N/A'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <div>{student.department}</div>
                      <div className="text-[10px] text-slate-400">
                        {student.academicYear} - Sec {student.section}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">{student.phoneNumber || 'N/A'}</td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          student.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {student.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3" /> Deactivated
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openStudentDetail(student)}
                          className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 font-semibold"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => toggleStudentStatus(student._id, student.status)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                            student.status === 'active'
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {student.status === 'active' ? (
                            <>
                              <UserX className="w-3.5 h-3.5" /> Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" /> Activate
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Details Slide-Over Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-[#151C28] border-l border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    {/* ADMIN PORTAL: Shows student's full name */}
                    <h3 className="font-bold text-white text-base">{selectedStudent.fullName}</h3>
                    <p className="text-xs text-brand-400">Student ID: {selectedStudent.studentId || 'N/A'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Information Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold">Email</span>
                    <span className="font-semibold text-white">{selectedStudent.email}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold">Phone</span>
                    <span className="font-semibold text-white">{selectedStudent.phoneNumber || 'N/A'}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold">Department</span>
                    <span className="font-semibold text-white">{selectedStudent.department}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold">Academic Year</span>
                    <span className="font-semibold text-white">
                      {selectedStudent.academicYear} - Sec {selectedStudent.section}
                    </span>
                  </div>
                </div>

                {/* Account Status Control Bar */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-white">Account Status</span>
                    <span className="text-[11px] text-slate-400 capitalize">{selectedStudent.status} access</span>
                  </div>
                  <button
                    onClick={() => toggleStudentStatus(selectedStudent._id, selectedStudent.status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedStudent.status === 'active'
                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30'
                    }`}
                  >
                    {selectedStudent.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                  </button>
                </div>

                {/* Student's Complaint History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-400" /> Student Complaint History
                  </h4>

                  {loadingStudentDetail ? (
                    <p className="text-xs text-slate-400 py-4 text-center">Loading complaint records...</p>
                  ) : studentComplaints.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center italic">No complaints registered by this student.</p>
                  ) : (
                    <div className="space-y-2">
                      {studentComplaints.map((c) => (
                        <div key={c._id || c.complaintId} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-white">{c.complaintId} - {c.title}</div>
                            <div className="text-[10px] text-slate-400">{c.category} • {c.location}</div>
                          </div>
                          <StatusBadge status={c.status} />
                        </div>
                      ))}
                    </div>
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

export default StudentManagement;
