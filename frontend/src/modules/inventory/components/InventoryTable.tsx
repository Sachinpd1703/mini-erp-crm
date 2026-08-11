import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockMovement } from '../../../types';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';

interface InventoryTableProps {
  movements: StockMovement[];
  loading: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  movements,
  loading,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  const handleRowClick = (productId?: string) => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Movement</th>
              <th className="py-3 px-4">Target Product / SKU</th>
              <th className="py-3 px-4 text-right">Qty Changed</th>
              <th className="py-3 px-4">Reason / Source Description</th>
              <th className="py-3 px-4 text-right">Authorized By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                  No matching stock movements recorded yet.
                </td>
              </tr>
            ) : (
              movements.map((move) => {
                const isIn = move.movementType === 'IN';
                return (
                  <tr
                    key={move.id}
                    onClick={() => handleRowClick(move.productId)}
                    className="hover:bg-[#FFFBF7] dark:hover:bg-slate-800/50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-[#6B5542] dark:text-slate-400 font-mono text-[11px] font-medium">
                      {new Date(move.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                          isIn
                            ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-800 dark:text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {isIn ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        <span>{move.movementType}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <p className="font-bold text-[#002A1C] dark:text-white group-hover:text-[#004D34] dark:group-hover:text-sky-400 transition">
                          {move.product?.name || 'Product'}
                        </p>
                        <ExternalLink className="w-3 h-3 text-[#6B5542] dark:text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-mono font-medium">
                        SKU: {move.product?.sku}
                      </p>
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-bold text-sm ${
                        isIn ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {isIn ? `+${move.quantity}` : `-${move.quantity}`}
                    </td>
                    <td className="py-3.5 px-4 text-[#002A1C] dark:text-slate-300 max-w-xs truncate font-medium">
                      {move.reason}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#6B5542] dark:text-slate-400">
                      <p className="font-bold text-[#002A1C] dark:text-slate-200">{move.author?.fullName || 'System'}</p>
                      <p className="text-[10px] text-[#004D34] dark:text-sky-400 uppercase font-bold">{move.author?.role}</p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
