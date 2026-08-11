import React from 'react';
import { Search, Filter } from 'lucide-react';

interface InventoryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B5542] dark:text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by product name, SKU, audit reason, or author..."
          className="w-full bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-[#002A1C] dark:text-white placeholder-[#6B5542]/70 dark:placeholder-slate-500 focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500 font-medium"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-[#6B5542] dark:text-slate-500 flex-shrink-0" />
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="w-full bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
        >
          <option value="">All Movement Types</option>
          <option value="IN">IN (+ Stock Additions / Inflow)</option>
          <option value="OUT">OUT (- Stock Removals / Outflow)</option>
        </select>
      </div>
    </div>
  );
};
