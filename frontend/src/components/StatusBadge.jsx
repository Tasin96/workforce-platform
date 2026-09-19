import React from 'react';

const STYLES = {
  pending: 'bg-amber-50 text-amber-800 border-amber-300/80 dot-amber-500',
  accepted: 'bg-orange-50 text-[#9A3412] border-orange-300/80 dot-orange-500',
  in_progress: 'bg-rose-50 text-[#881337] border-rose-300/80 dot-rose-600',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dot-emerald-500',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200/60 dot-rose-500',
  open: 'bg-amber-50 text-amber-800 border-amber-200/60 dot-amber-500',
  under_review: 'bg-amber-50 text-amber-900 border-amber-300/60 dot-amber-600',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dot-emerald-500',
  rejected: 'bg-stone-100 text-stone-700 border-stone-200 dot-stone-400',
};

const DOT_COLORS = {
  pending: 'bg-amber-500',
  accepted: 'bg-[#EA580C]',
  in_progress: 'bg-[#881337]',
  completed: 'bg-emerald-500',
  cancelled: 'bg-rose-500',
  open: 'bg-amber-500',
  under_review: 'bg-amber-600',
  resolved: 'bg-emerald-500',
  rejected: 'bg-stone-400',
};

const StatusBadge = ({ status }) => {
  const dotColor = DOT_COLORS[status] || 'bg-slate-400';
  const badgeStyle = STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="capitalize">{status?.replace('_', ' ')}</span>
    </span>
  );
};

export default StatusBadge;

