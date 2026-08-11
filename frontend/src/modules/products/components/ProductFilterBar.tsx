import React from 'react';
import { Search } from 'lucide-react';

interface ProductFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B5542] dark:text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search product name, SKU, or category..."
          className="w-full bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-[#002A1C] dark:text-white placeholder-[#6B5542]/70 dark:placeholder-slate-500 focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500 font-medium"
        />
      </div>

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value)}
        className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Sensors">Sensors</option>
        <option value="Electrical">Electrical</option>
      </select>
    </div>
  );
};
