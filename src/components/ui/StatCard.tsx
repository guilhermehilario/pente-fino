import React from 'react';
import { cards, texts } from '../../globalStyle';

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
    <div className={cards.statCard}>
      <div className="flex justify-between items-start mb-4">
        <div className={`${cards.statCardIconWrapper} ${iconBgColor} ${iconTextColor}`}>
          {icon}
        </div>
      </div>
      <p className={texts.label}>{title}</p>
      <p className={texts.valueLarge}>{value}</p>
    </div>
  );
}
