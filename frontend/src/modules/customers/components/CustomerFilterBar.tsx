import React from 'react';
import { Search } from 'lucide-react';

interface CustomerFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B5542] dark:text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, company, email..."
          className="w-full bg-[#ffffff] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-[#002A1C] dark:text-white placeholder-[#6B5542]/70 dark:placeholder-slate-500 focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500 font-medium"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="bg-[#ffffff] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
      >
        <option value="">All Statuses</option>
        <option value="LEAD">LEAD</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>

      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="bg-[#ffffff] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
      >
        <option value="">All Customer Types</option>
        <option value="RETAIL">RETAIL</option>
        <option value="WHOLESALE">WHOLESALE</option>
        <option value="DISTRIBUTOR">DISTRIBUTOR</option>
      </select>
    </div>
  );
};
