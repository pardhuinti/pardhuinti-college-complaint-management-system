import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ShieldAlert, UserCheck, Wrench, CheckCheck } from 'lucide-react';

const stages = [
  { id: 'Pending', label: 'Submitted', icon: Clock },
  { id: 'Under Review', label: 'Under Review', icon: ShieldAlert },
  { id: 'Assigned', label: 'Assigned', icon: UserCheck },
  { id: 'In Progress', label: 'In Progress', icon: Wrench },
  { id: 'Resolved', label: 'Resolved', icon: CheckCircle2 },
  { id: 'Closed', label: 'Closed', icon: CheckCheck },
];

const getStageIndex = (status) => {
  if (status === 'Reopened') return 1; // back to review stage
  return stages.findIndex((s) => s.id === status);
};

const Timeline = ({ currentStatus }) => {
  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Background Base Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

        {/* Solid Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentIndex / (stages.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        {/* Stage Nodes */}
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${
                  isCurrent
                    ? 'bg-blue-600 border-blue-500 text-white shadow-sm ring-2 ring-blue-500/30'
                    : isCompleted
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={`mt-2 text-[11px] text-center transition-colors max-w-[75px] font-medium ${
                  isCurrent
                    ? 'text-blue-500 font-bold'
                    : isCompleted
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
