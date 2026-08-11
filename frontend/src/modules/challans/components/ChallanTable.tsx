import React from 'react';
import { SalesChallan } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { Download, CheckCircle } from 'lucide-react';

interface ChallanTableProps {
  challans: SalesChallan[];
  loading: boolean;
  canCreate: boolean;
  onStatusChange: (id: string, newStatus: 'CONFIRMED' | 'CANCELLED') => void;
  onDownloadPdf: (id: string, challanNumber?: string) => void;
}

export const ChallanTable: React.FC<ChallanTableProps> = ({
  challans,
  loading,
  canCreate,
  onStatusChange,
  onDownloadPdf,
}) => {
  if (loading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Challan #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4 text-right">Items / Qty</th>
              <th className="py-3 px-4 text-right">Grand Total</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
            {challans.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                  No sales challans match current criteria.
                </td>
              </tr>
            ) : (
              challans.map((ch) => (
                <tr key={ch.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#004D34] dark:text-sky-400">
                    {ch.challanNumber}
                    <p className="text-[10px] text-[#6B5542] dark:text-slate-500 font-sans font-medium">
                      {new Date(ch.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#002A1C] dark:text-white">
                      {ch.customer?.businessName || ch.customer?.name}
                    </p>
                    <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Attn: {ch.customer?.name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#002A1C] dark:text-slate-300">
                    <span className="font-bold text-[#002A1C] dark:text-white">{ch.totalQuantity} Units</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#002A1C] dark:text-white">
                    INR {Number(ch.totalAmount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      label={ch.status}
                      variant={
                        ch.status === 'CONFIRMED'
                          ? 'success'
                          : ch.status === 'DRAFT'
                          ? 'warning'
                          : 'danger'
                      }
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {ch.status === 'DRAFT' && canCreate && (
                      <>
                        <button
                          onClick={() => onStatusChange(ch.id, 'CONFIRMED')}
                          title="Confirm & Deduct Stock"
                          className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 rounded-lg transition text-[11px] font-bold inline-flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Confirm Order</span>
                        </button>

                        <button
                          onClick={() => onStatusChange(ch.id, 'CANCELLED')}
                          title="Cancel Draft"
                          className="px-2 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-700 dark:text-red-400 border border-red-500/20 rounded-lg transition text-[11px] font-bold"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => onDownloadPdf(ch.id, ch.challanNumber)}
                      className="px-2.5 py-1 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#004D34] dark:text-sky-400 font-bold border border-[#F3CEA6] dark:border-slate-700 rounded-lg transition text-[11px] inline-flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Invoice PDF</span>
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
