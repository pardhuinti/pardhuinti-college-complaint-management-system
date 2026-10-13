import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye, FileText, CheckCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Version 1.0</span>
          </div>
        </div>

        {/* Title Block */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-sky-500" /> Institutional Compliance Document
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy &amp; Student Data Protection
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This policy defines how student personal data, grievance submissions, photographic evidence, and communication logs are collected, processed, and safeguarded within the College Complaint Management System.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 bg-white dark:bg-[#151C28] p-6 sm:p-10 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">1</span>
              Institutional Scope and Jurisdiction
            </h2>
            <p>
              The College Complaint Management System operates solely for the administration of student grievances, campus infrastructure requests, laboratory maintenance, hostel conditions, and academic facilities feedback. The system is maintained exclusively for enrolled students, designated department heads, and campus facility administrators.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">2</span>
              Information Collected
            </h2>
            <p>
              To process and resolve facility tickets accurately, the platform records:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><b>Identity Records:</b> Student Full Name, Institutional Roll Number / Student ID, Department, Academic Year, and Section.</li>
              <li><b>Contact Information:</b> Verified institutional college email address and student contact number.</li>
              <li><b>Complaint Records:</b> Issue category, location descriptions, title, detailed narrative, priority rating, and optional attached image evidence.</li>
              <li><b>Resolution Audits:</b> Administrator status updates, technician assignment logs, resolution timestamps, and student verification remarks.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">3</span>
              Purpose of Data Processing
            </h2>
            <p>
              Collected records are processed strictly for:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="block font-bold text-xs text-slate-900 dark:text-white mb-1">Issue Remediation</span>
                <span className="text-xs text-slate-500">Dispatching maintenance teams, repair technicians, and resolving campus facility bottlenecks.</span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="block font-bold text-xs text-slate-900 dark:text-white mb-1">Audit Accountability</span>
                <span className="text-xs text-slate-500">Maintaining time-stamped status histories to monitor resolution velocity and institutional performance.</span>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">4</span>
              Confidentiality and Access Control
            </h2>
            <p>
              Grievance records are safeguarded under strict role-based access controls (RBAC):
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>Students have access strictly to their individual complaint records and verification statuses.</li>
              <li>Only authorized administrators and authenticated maintenance department managers have clearance to inspect grievance details, assign technician personnel, and update status records.</li>
              <li>No personal information is sold, commercialized, or shared with third-party advertisers or external analytics providers.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">5</span>
              Data Storage and Encryption
            </h2>
            <p>
              All system records are securely persisted on encrypted MongoDB Atlas clusters with TLS 1.3 in-transit encryption and AES-256 at-rest protection. Passwords are cryptographically hashed using salted bcrypt prior to storage. Authentication sessions utilize secure, signed JSON Web Tokens (JWT).
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">6</span>
              Student Rights and Inquiries
            </h2>
            <p>
              Students retain the right to inspect their registered grievances, contest resolutions by reopening tickets, and request correction of inaccurate departmental information. For privacy inquiries or grievance data audits, students may contact the Chief Administrative Officer or campus registrar desk.
            </p>
          </section>

        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4">
          <Link to="/terms-and-conditions" className="hover:text-slate-900 dark:hover:text-white underline">
            View Terms &amp; Conditions
          </Link>
          <Link to="/login" className="hover:text-slate-900 dark:hover:text-white underline">
            Return to Login Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
