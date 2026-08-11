import React from 'react';
import { Search, Filter } from 'lucide-react';

interface UserFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B5542] dark:text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search staff members by full name or email..."
          className="w-full bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-[#002A1C] dark:text-white placeholder-[#6B5542]/70 dark:placeholder-slate-500 focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500 font-medium"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-[#6B5542] dark:text-slate-500 flex-shrink-0" />
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="w-full bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
        >
          <option value="">All System Roles</option>
          <option value="ADMIN">ADMIN (Full Control)</option>
          <option value="SALES">SALES (CRM & Orders)</option>
          <option value="WAREHOUSE">WAREHOUSE (Stock & Audit)</option>
          <option value="ACCOUNTS">ACCOUNTS (Billing & Financials)</option>
        </select>
      </div>
    </div>
  );
};
