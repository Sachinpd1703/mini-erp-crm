import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#002A1C] dark:text-sky-400',
}) => {
  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between transition-colors duration-200">
      <div className="space-y-1">
        <p className="text-xs font-bold text-[#6B5542] dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-[#002A1C] dark:text-white tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-[#6B5542] dark:text-slate-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`p-3.5 bg-[#FFFBF7] dark:bg-slate-800/80 border border-[#F3CEA6] dark:border-slate-700/50 rounded-xl shadow-inner ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
