import React from 'react';
import { SalesChallan } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { FileText } from 'lucide-react';

interface RecentOrdersWidgetProps {
  challans: SalesChallan[];
}

export const RecentOrdersWidget: React.FC<RecentOrdersWidgetProps> = ({ challans }) => {
  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
          <span>Recent Sales Challans</span>
        </h3>
        <span className="text-xs text-[#6B5542] dark:text-slate-400 font-medium">{challans.length} Orders</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[#6B5542] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="pb-2">Challan #</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2 text-right">Amount</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
            {challans.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                  No sales challans recorded yet.
                </td>
              </tr>
            ) : (
              challans.map((challan) => (
                <tr key={challan.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                  <td className="py-2.5 font-mono text-[#004D34] dark:text-sky-400 font-bold">
                    {challan.challanNumber}
                  </td>
                  <td className="py-2.5 text-[#002A1C] dark:text-slate-200 font-semibold">
                    {challan.customer?.businessName || challan.customer?.name}
                  </td>
                  <td className="py-2.5 text-right font-bold text-[#002A1C] dark:text-white">
                    INR {Number(challan.totalAmount).toFixed(2)}
                  </td>
                  <td className="py-2.5 text-right">
                    <Badge
                      label={challan.status}
                      variant={
                        challan.status === 'CONFIRMED'
                          ? 'success'
                          : challan.status === 'DRAFT'
                          ? 'warning'
                          : 'danger'
                      }
                    />
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
