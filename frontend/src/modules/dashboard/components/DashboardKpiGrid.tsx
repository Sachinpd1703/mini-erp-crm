import React from 'react';
import { StatCard } from '../../../components/ui/StatCard';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { Users, Package, AlertTriangle, FileText } from 'lucide-react';

interface DashboardKpiGridProps {
  loading: boolean;
  totalCustomers: number;
  inventoryOverview: {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalStockUnits: number;
  };
  salesOrdersCount: number;
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({
  loading,
  totalCustomers,
  inventoryOverview,
  salesOrdersCount,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
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
        value={salesOrdersCount}
        subtitle="Recent Sales Challans"
        icon={FileText}
        iconColor="text-[#004D34] dark:text-emerald-400"
      />
    </div>
  );
};
