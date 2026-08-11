import React, { useState, useEffect } from 'react';
import { StockMovement } from '../../types';
import { apiClient } from '../../services/api';
import { clientCache, getCachedData } from '../../services/apiCache';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchMovements = async () => {
    const params: any = {};
    if (typeFilter) params.type = typeFilter;

    const cached = clientCache.get<any>('/inventory/movements', params);
    if (cached) {
      setMovements(cached.data || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData('/inventory/movements', params);
      if (res.data.success) {
        setMovements(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory movements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [typeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Inventory Movement Audit Log</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Immutable audit trail of all warehouse stock inflows (IN) and sales outflows (OUT)</p>
        </div>

        {/* Filter dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#6B5542] dark:text-slate-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
          >
            <option value="">All Movement Types</option>
            <option value="IN">IN (+ Stock Additions)</option>
            <option value="OUT">OUT (- Stock Removals / Fulfillment)</option>
          </select>
        </div>
      </div>

      {/* Movements Audit Data Table / Skeleton */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Movement</th>
                  <th className="py-3 px-4">Target Product / SKU</th>
                  <th className="py-3 px-4 text-right">Qty Changed</th>
                  <th className="py-3 px-4">Reason / Source</th>
                  <th className="py-3 px-4 text-right">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  movements.map((move) => {
                    const isIn = move.movementType === 'IN';
                    return (
                      <tr key={move.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
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
                          <p className="font-bold text-[#002A1C] dark:text-white">{move.product?.name || 'Product'}</p>
                          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-mono font-medium">SKU: {move.product?.sku}</p>
                        </td>
                        <td
                          className={`py-3.5 px-4 text-right font-bold text-sm ${
                            isIn ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {isIn ? `+${move.quantity}` : `-${move.quantity}`}
                        </td>
                        <td className="py-3.5 px-4 text-[#002A1C] dark:text-slate-300 max-w-xs truncate font-medium">{move.reason}</td>
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
      )}
    </div>
  );
};
