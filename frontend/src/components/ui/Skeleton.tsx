import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#F3CEA6]/50 dark:bg-slate-800 rounded-lg ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[#F3CEA6] dark:border-slate-800 flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, rIndex) => (
          <div key={rIndex} className="flex items-center justify-between space-x-4">
            {Array.from({ length: cols }).map((_, cIndex) => (
              <Skeleton
                key={cIndex}
                className={`h-4 ${
                  cIndex === 0 ? 'w-1/4' : cIndex === cols - 1 ? 'w-16' : 'w-1/6'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
