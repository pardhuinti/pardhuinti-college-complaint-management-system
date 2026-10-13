import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        <p className="font-semibold text-sm text-slate-200">Complaint Not Found</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-blue-400 text-xs underline">
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
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </button>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Verification Prompt Banner */}
      {complaint.status === 'Resolved' && (
        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Administration Marked This Complaint As Resolved
              </h3>
              <p className="text-xs text-slate-400">
                Please verify if the maintenance meets your expectation or if the issue persists.
              </p>
            </div>
          </div>
          <button
            onClick={() => setResolutionModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm shrink-0 transition-colors"
          >
            Confirm Resolution Action
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-[#151C28] rounded-xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-blue-400 mb-1">
            <span>{complaint.complaintId}</span>
            <span>•</span>
            <span className="text-slate-400">{complaint.category}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {complaint.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Location</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {complaint.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <User className="w-4 h-4 text-sky-400 shrink-0" />
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

        {/* Status Lifecycle Stepper */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Complaint Lifecycle Tracker
          </h3>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
            <Timeline currentStatus={complaint.status} />
          </div>
        </div>

        {/* Detailed Narrative */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Reported Issue Description
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </p>
        </div>

        {/* Attachments Section */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" /> Photographic Evidence &amp; Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {complaint.attachments.map((att, i) => (
                <a
                  key={i}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-700 flex items-center gap-3 transition-colors text-xs text-slate-300"
                >
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-900 dark:text-slate-200">
                    {att.filename || 'Attachment File'}
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold">View</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Admin Remarks Log */}
        {complaint.adminRemarks && complaint.adminRemarks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Administration Remarks &amp; Updates
            </h3>
            <div className="space-y-2">
              {complaint.adminRemarks.map((rem, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-blue-400">{rem.addedBy || 'Administration'}</span>
                    <span>{new Date(rem.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{rem.remark}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Resolution Feedback */}
        {complaint.resolutionFeedback && complaint.resolutionFeedback.submittedAt && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Student Verification Feedback
            </h3>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-semibold ${complaint.resolutionFeedback.accepted ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {complaint.resolutionFeedback.accepted ? 'Resolution Accepted' : 'Resolution Rejected (Reopened)'}
                </span>
                <span className="text-slate-400">
                  {new Date(complaint.resolutionFeedback.submittedAt).toLocaleString()}
                </span>
              </div>
              {complaint.resolutionFeedback.comment && (
                <p className="text-slate-700 dark:text-slate-300 mt-1">"{complaint.resolutionFeedback.comment}"</p>
              )}
            </div>
          </div>
        )}
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
