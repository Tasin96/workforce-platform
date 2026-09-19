import React from 'react';

const LoadingSpinner = ({ label = 'Loading data…' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="relative w-10 h-10">
      <div className="w-10 h-10 border-4 border-amber-100 rounded-full" />
      <div className="absolute top-0 left-0 w-10 h-10 border-4 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
    </div>
    <p className="text-xs font-semibold text-amber-800/80 tracking-wide uppercase font-mono">{label}</p>
  </div>
);

export default LoadingSpinner;

