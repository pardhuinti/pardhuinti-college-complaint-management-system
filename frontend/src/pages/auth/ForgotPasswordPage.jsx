import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Footer from '../../components/common/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post('/auth/forgot-password', { email });
      toast.success('Password reset email dispatched!');
      setSent(true);
    } catch (err) {
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md bg-[#151C28] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl relative z-10 space-y-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-white">Reset Account Password</h1>
            <p className="text-xs text-slate-400">
              Enter your registered college email address to receive recovery verification instructions.
            </p>
          </div>

          {sent ? (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-emerald-400">Instructions Dispatched</p>
              <p className="text-xs text-slate-300">
                Check inbox for <b>{email}</b> to complete your password reset.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Institutional College Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
              >
                {loading ? 'Transmitting Request...' : 'Send Password Reset Link'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800">
            Remembered your credentials?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              Return to Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
