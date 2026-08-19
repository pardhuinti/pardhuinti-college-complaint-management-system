import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const ResolutionModal = ({ isOpen, onClose, complaint, onSuccess }) => {
  const [choice, setChoice] = useState('accept'); // 'accept' or 'reject'
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const isAccepted = choice === 'accept';
      await API.patch(`/complaints/${complaint._id || complaint.complaintId}/resolution`, {
        accepted: isAccepted,
        comment,
        rating,
      });

      toast.success(
        isAccepted
          ? 'Thank you! Complaint resolution accepted and marked as Closed.'
          : 'Complaint has been Reopened. The administration team has been alerted.'
      );

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#151C28] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 p-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Verify Complaint Resolution</h3>
                <p className="text-xs text-slate-400">ID: {complaint.complaintId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Options selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChoice('accept')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  choice === 'accept'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 mb-2 text-emerald-400" />
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Accept Resolution
                  </span>
                  <span className="text-[10px] text-slate-400">Issue resolved satisfactorily</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setChoice('reject')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  choice === 'reject'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <AlertTriangle className="w-6 h-6 mb-2 text-rose-400" />
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Issue Still Exists
                  </span>
                  <span className="text-[10px] text-slate-400">Reopen for admin review</span>
                </div>
              </button>
            </div>

            {/* Rating if accepted */}
            {choice === 'accept' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Rate Service Resolution
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Remarks / Comments */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {choice === 'accept' ? 'Optional Feedback' : 'Please detail why the issue persists *'}
              </label>
              <textarea
                required={choice === 'reject'}
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  choice === 'accept'
                    ? 'Describe your satisfaction or praise...'
                    : 'Explain what is still broken or incomplete...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                  choice === 'accept'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                }`}
              >
                {loading ? 'Submitting...' : choice === 'accept' ? 'Confirm & Close' : 'Reopen Complaint'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResolutionModal;
