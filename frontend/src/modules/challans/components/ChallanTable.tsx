import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SalesChallan } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { ChallanActionsMenu } from './ChallanActionsMenu';

interface ChallanTableProps {
  challans: SalesChallan[];
  loading: boolean;
  canManage: boolean;
  onDownloadPdf: (challanId: string, challanNumber?: string) => void;
  onUpdateStatus: (challanId: string, status: 'CONFIRMED' | 'CANCELLED') => void;
}

export const ChallanTable: React.FC<ChallanTableProps> = ({
  challans,
  loading,
  canManage,
  onDownloadPdf,
  onUpdateStatus,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  const handleRowClick = (challanId: string) => {
    navigate(`/challans/${challanId}`);
  };

  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Challan Number</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4 text-center">Items / Quantity</th>
              <th className="py-3 px-4 text-right">Grand Total</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
            {challans.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                  No sales challans recorded.
                </td>
              </tr>
            ) : (
              challans.map((ch) => (
                <tr
                  key={ch.id}
                  onClick={() => handleRowClick(ch.id)}
                  className="hover:bg-[#FFFBF7] dark:hover:bg-slate-800/50 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#004D34] dark:text-sky-400 font-mono group-hover:underline">
                      {ch.challanNumber}
                    </p>
                    <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">
                      {new Date(ch.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#002A1C] dark:text-white">
                      {ch.customer?.businessName || 'N/A'}
                    </p>
                    <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">
                      Contact: {ch.customer?.name}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-center text-[#6B5542] dark:text-slate-300 font-semibold">
                    {ch._count?.items || ch.items?.length || 0} Items ({ch.totalQuantity || 0} Pcs)
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-[#002A1C] dark:text-white text-sm">
                    INR {Number(ch.totalAmount || 0).toFixed(2)}
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
                  <td
                    className="py-3.5 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChallanActionsMenu
                      challan={ch}
                      canManage={canManage}
                      onViewChallan={() => handleRowClick(ch.id)}
                      onDownloadPdf={onDownloadPdf}
                      onUpdateStatus={onUpdateStatus}
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
