import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileCheck, ArrowLeft, AlertCircle, CheckCircle, ShieldAlert, BookOpen } from 'lucide-react';

const TermsAndConditions = () => {
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
            <FileCheck className="w-4 h-4 text-emerald-500" /> Official Terms of Service &amp; Portal Regulations
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Terms &amp; Conditions of Portal Use
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            These terms govern the acceptable use of the College Complaint Management System by registered students, faculty coordinators, and administrative personnel.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 bg-white dark:bg-[#151C28] p-6 sm:p-10 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">1</span>
              User Authentication and Account Security
            </h2>
            <p>
              Access to this portal is restricted to active students and authorized administrators of the institution. Each user is responsible for safeguarding their login credentials. Sharing account access, impersonating other students, or attempting unauthorized administrative elevation will result in institutional disciplinary review.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">2</span>
              Genuine Submission Mandate
            </h2>
            <p>
              Students must submit accurate, factual, and verified reports regarding physical infrastructure, classroom electronics, laboratory equipment, hostel facilities, or campus amenities. Frivolous, fabricated, or retaliatory complaints are strictly prohibited under the Student Code of Conduct.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">3</span>
              Evidence and Attachment Standards
            </h2>
            <p>
              Photographs and documents uploaded as supporting evidence must depict genuine facility defects or issues. Uploading offensive, defamatory, unrelated, or copyrighted external materials is a direct violation of institutional policy and will lead to immediate ticket removal and account suspension.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">4</span>
              Administrative Lifecycle &amp; Priority Triage
            </h2>
            <p>
              The Chief Administrator and facilities desk allocate repair priorities (Low, Medium, High, Urgent) based on campus safety, severity, and academic disruption. The administration reserves the right to merge duplicate reports, reclassify issue categories, and assign specialized external maintenance contractors when necessary.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">5</span>
              Resolution Verification and Reopening Procedure
            </h2>
            <p>
              When a complaint is marked as "Resolved" by administration, the reporting student receives a verification notification. The student may:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><b>Accept Resolution:</b> Confirms that the physical repair or service has addressed the reported grievance satisfactorily, closing the ticket.</li>
              <li><b>Reopen Ticket:</b> If the defect persists, the student can submit detailed feedback to reopen the complaint for secondary technical inspection.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">6</span>
              Governance and Institutional Escalation
            </h2>
            <p>
              These terms are governed by the institution's official regulations and collegiate guidelines. Any unresolved disputes or critical grievances may be formally escalated to the Campus Grievance Redressal Committee in accordance with institutional policy.
            </p>
          </section>

        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4">
          <Link to="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white underline">
            View Privacy Policy
          </Link>
          <Link to="/login" className="hover:text-slate-900 dark:hover:text-white underline">
            Return to Login Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
