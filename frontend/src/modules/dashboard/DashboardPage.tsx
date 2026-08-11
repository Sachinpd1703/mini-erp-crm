import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { Users, Package, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/api';
import { Product, SalesChallan } from '../../types';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [inventoryOverview, setInventoryOverview] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalStockUnits: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentChallans, setRecentChallans] = useState<SalesChallan[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [custRes, invRes, lowStockRes, challanRes] = await Promise.all([
        apiClient.get('/customers?limit=1'),
        apiClient.get('/inventory/overview'),
        apiClient.get('/products?lowStockOnly=true&limit=5'),
        apiClient.get('/challans?limit=5'),
      ]);

      if (custRes.data.success) setTotalCustomers(custRes.data.meta?.total || 0);
      if (invRes.data.success) setInventoryOverview(invRes.data.data);
      if (lowStockRes.data.success) setLowStockProducts(lowStockRes.data.data);
      if (challanRes.data.success) setRecentChallans(challanRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Executive Dashboard</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Real-time overview of distribution metrics and sales flow</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-3.5 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-semibold rounded-xl transition flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards / Skeleton Loader */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            subtitle="Registered business clients"
            icon={Users}
            iconColor="text-[#004D34] dark:text-sky-400"
          />
          <StatCard
            title="Product Catalog"
            value={inventoryOverview.totalProducts}
            subtitle={`${inventoryOverview.totalStockUnits} Total units on hand`}
            icon={Package}
            iconColor="text-[#004D34] dark:text-indigo-400"
          />
          <StatCard
            title="Low Stock Alerts"
            value={inventoryOverview.lowStockCount}
            subtitle={`${inventoryOverview.outOfStockCount} Products zero stock`}
            icon={AlertTriangle}
            iconColor="text-amber-700 dark:text-amber-400"
          />
          <StatCard
            title="Sales Orders"
            value={recentChallans.length}
            subtitle="Recent Sales Challans"
            icon={FileText}
            iconColor="text-[#004D34] dark:text-emerald-400"
          />
        </div>
      )}

      {/* Low Stock Warning Banner if applicable */}
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
          {/* Low Stock Alert Table */}
          <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Low Stock Replenishment List</span>
              </h3>
              <span className="text-xs text-[#6B5542] dark:text-slate-400 font-medium">{lowStockProducts.length} Items</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#6B5542] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="pb-2">Product</th>
                    <th className="pb-2">SKU</th>
                    <th className="pb-2 text-right">Stock</th>
                    <th className="pb-2 text-right">Alert Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
                  {lowStockProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                        ✅ All product stock levels healthy.
                      </td>
                    </tr>
                  ) : (
                    lowStockProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                        <td className="py-2.5 font-bold text-[#002A1C] dark:text-white">{product.name}</td>
                        <td className="py-2.5 text-[#6B5542] dark:text-slate-400 font-mono">{product.sku}</td>
                        <td className="py-2.5 text-right font-bold text-amber-700 dark:text-amber-400">
                          {product.currentStock}
                        </td>
                        <td className="py-2.5 text-right text-[#6B5542] dark:text-slate-400 font-medium">
                          {product.minStockAlert}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Sales Challans Table */}
          <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
                <span>Recent Sales Challans</span>
              </h3>
              <span className="text-xs text-[#6B5542] dark:text-slate-400 font-medium">{recentChallans.length} Orders</span>
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
                  {recentChallans.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                        No sales challans recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentChallans.map((challan) => (
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
        </div>
      )}
    </div>
  );
};
