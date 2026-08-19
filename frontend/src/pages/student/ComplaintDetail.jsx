import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  User,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/common/Timeline';
import ResolutionModal from '../../components/common/ResolutionModal';
import API from '../../api/axios';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/complaints/${id}`);
      setComplaint(res.data.complaint);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        Loading complaint activity file...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="font-bold text-sm">Complaint Not Found</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-brand-400 text-xs underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Verification Prompt Banner */}
      {complaint.status === 'Resolved' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Administration Marked This Complaint As Resolved
              </h3>
              <p className="text-xs text-slate-400">
                Please verify if the repair/service has satisfied your request or if the issue persists.
              </p>
            </div>
          </div>
          <button
            onClick={() => setResolutionModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 shrink-0"
          >
            Confirm Resolution Action
          </button>
        </motion.div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-[#151C28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-brand-400 mb-1">
            <span>{complaint.complaintId}</span>
            <span>•</span>
            <span className="text-slate-400">{complaint.category}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
            {complaint.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Location</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {complaint.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <User className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Assigned Service Desk</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {complaint.assignedTo || 'Unassigned'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Submitted Date</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {new Date(complaint.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Component */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Complaint Lifecycle Tracker
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
            <Timeline currentStatus={complaint.status} />
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Issue Description
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 whitespace-pre-wrap">
            {complaint.description}
          </p>
        </div>

        {/* Attachments */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Attached Proof / Documents
            </h3>
            <div className="flex flex-wrap gap-4">
              {complaint.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 flex items-center gap-3 transition-colors"
                >
                  {att.url.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
                    <img src={att.url} alt="Attachment" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <Paperclip className="w-6 h-6 text-brand-400" />
                  )}
                  <div>
                    <span className="block text-xs font-semibold text-slate-900 dark:text-slate-200">
                      {att.filename || 'View File'}
                    </span>
                    <span className="text-[10px] text-brand-400">Click to open</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Admin Remarks Feed */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Administration Remarks & Action Log
          </h3>
          {(!complaint.adminRemarks || complaint.adminRemarks.length === 0) ? (
            <div className="p-4 text-center text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              No official admin remarks logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {complaint.adminRemarks.map((rem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-brand-400">
                    <span>{rem.addedBy}</span>
                    <span className="text-slate-400 font-normal">
                      {new Date(rem.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    {rem.remark}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resolution Modal */}
      <ResolutionModal
        isOpen={resolutionModalOpen}
        onClose={() => setResolutionModalOpen(false)}
        complaint={complaint}
        onSuccess={fetchDetail}
      />
    </div>
  );
};

export default ComplaintDetail;
