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
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

        {/* Animated Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-brand-600 to-emerald-500 -translate-y-1/2 z-0"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentIndex / (stages.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {/* Stage Nodes */}
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.25 : 1,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md ${
                  isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-500/30'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              <span
                className={`mt-2 text-xs font-medium text-center transition-colors max-w-[80px] ${
                  isCurrent
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : isCompleted
                    ? 'text-slate-900 dark:text-slate-200'
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
