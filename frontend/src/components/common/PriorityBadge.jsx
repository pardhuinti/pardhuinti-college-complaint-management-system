import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

const priorityConfig = {
  Low: { bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: ArrowDown },
  Medium: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: ArrowUp },
  High: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: AlertTriangle },
  Urgent: { bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse', icon: AlertCircle },
};

const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.Medium;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {priority}
    </span>
  );
};

export default PriorityBadge;
