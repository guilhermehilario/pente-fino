import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  iconBgColor = 'bg-blue-500/10', 
  iconTextColor = 'text-blue-400' 
}: StatCardProps) {
  return (
    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${iconBgColor} rounded-lg ${iconTextColor} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
      <p className="text-xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}
