import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';
import { DashboardKpiGrid } from './components/DashboardKpiGrid';
import { LowStockTableWidget } from './components/LowStockTableWidget';
import { RecentOrdersWidget } from './components/RecentOrdersWidget';
import { TableSkeleton } from '../../components/ui/Skeleton';

export const DashboardPage: React.FC = () => {
  const {
    loading,
    totalCustomers,
    inventoryOverview,
    lowStockProducts,
    recentChallans,
    fetchDashboardData,
  } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Executive Dashboard</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Real-time overview of distribution metrics and sales flow</p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={loading}
          className="px-3.5 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-semibold rounded-xl transition flex items-center space-x-2 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards / Skeleton Loader */}
      <DashboardKpiGrid
        loading={loading}
        totalCustomers={totalCustomers}
        inventoryOverview={inventoryOverview}
        salesOrdersCount={recentChallans.length}
      />

      {/* Low Stock Warning Banner */}
      {!loading && inventoryOverview.lowStockCount > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Action Required: {inventoryOverview.lowStockCount} Products At or Below Alert Threshold!
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                Replenish inventory to avoid sales order fulfillment errors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid Content / Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSkeleton rows={4} cols={4} />
          <TableSkeleton rows={4} cols={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LowStockTableWidget products={lowStockProducts} />
          <RecentOrdersWidget challans={recentChallans} />
        </div>
      )}
    </div>
  );
};
