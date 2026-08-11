import React from 'react';

interface ChallanFilterBarProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  totalOrders: number;
}

export const ChallanFilterBar: React.FC<ChallanFilterBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  totalOrders,
}) => {
  return (
    <div className="flex items-center justify-between">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
      >
        <option value="">All Statuses</option>
        <option value="DRAFT">DRAFT</option>
        <option value="CONFIRMED">CONFIRMED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <span className="text-xs text-[#6B5542] dark:text-slate-400 font-medium">{totalOrders} Orders</span>
    </div>
  );
};
