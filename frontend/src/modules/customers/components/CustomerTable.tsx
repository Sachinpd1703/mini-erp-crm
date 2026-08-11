import React from 'react';
import { Customer } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { Mail, Phone, ChevronRight } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onViewDetail: (id: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  onViewDetail,
}) => {
  if (loading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  return (
    <div className="bg-[#fef7ee] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Business / Name</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Next Follow-Up</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                  No matching customer records found.
                </td>
              </tr>
            ) : (
              customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#002A1C] dark:text-white">{cust.businessName}</p>
                    <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">{cust.name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#002A1C] dark:text-slate-300">
                    <div className="flex items-center space-x-1.5 text-[11px] font-medium">
                      <Mail className="w-3 h-3 text-[#6B5542] dark:text-slate-500" />
                      <span>{cust.email}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-[#6B5542] dark:text-slate-400">
                      <Phone className="w-3 h-3 text-[#6B5542] dark:text-slate-500" />
                      <span>{cust.mobile}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono font-bold uppercase bg-[#FFFBF7] dark:bg-slate-800 px-2 py-1 rounded border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300">
                      {cust.customerType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      label={cust.status}
                      variant={
                        cust.status === 'ACTIVE'
                          ? 'success'
                          : cust.status === 'LEAD'
                          ? 'warning'
                          : 'neutral'
                      }
                    />
                  </td>
                  <td className="py-3.5 px-4 text-[#6B5542] dark:text-slate-400 text-[11px] font-medium">
                    {cust.followUpDate
                      ? new Date(cust.followUpDate).toLocaleDateString()
                      : 'Not scheduled'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onViewDetail(cust.id)}
                      className="px-3 py-1.5 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#004D34] dark:text-sky-400 font-bold border border-[#F3CEA6] dark:border-slate-700 rounded-lg transition inline-flex items-center space-x-1 text-xs"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
