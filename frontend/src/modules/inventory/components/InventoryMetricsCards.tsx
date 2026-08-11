import React from 'react';
import { StockMovement } from '../../../types';
import { StatCard } from '../../../components/ui/StatCard';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { ArrowDownLeft, ArrowUpRight, Scale, History } from 'lucide-react';

interface InventoryMetricsCardsProps {
  movements: StockMovement[];
  loading: boolean;
}

export const InventoryMetricsCards: React.FC<InventoryMetricsCardsProps> = ({
  movements,
  loading,
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

  const inMovements = movements.filter((m) => m.movementType === 'IN');
  const outMovements = movements.filter((m) => m.movementType === 'OUT');

  const totalInUnits = inMovements.reduce((sum, m) => sum + Number(m.quantity || 0), 0);
  const totalOutUnits = outMovements.reduce((sum, m) => sum + Number(m.quantity || 0), 0);
  const netVariance = totalInUnits - totalOutUnits;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Stock Additions (+IN)"
        value={`${totalInUnits} Units`}
        subtitle={`${inMovements.length} Restock / Inflow Transactions`}
        icon={ArrowDownLeft}
        iconColor="text-emerald-700 dark:text-emerald-400"
      />

      <StatCard
        title="Stock Outflows (-OUT)"
        value={`${totalOutUnits} Units`}
        subtitle={`${outMovements.length} Sales / Outbound Removals`}
        icon={ArrowUpRight}
        iconColor="text-rose-700 dark:text-rose-400"
      />

      <StatCard
        title="Net Movement Variance"
        value={`${netVariance >= 0 ? '+' : ''}${netVariance} Units`}
        subtitle={netVariance >= 0 ? 'Positive Inventory Balance Growth' : 'Net Inventory Reduction'}
        icon={Scale}
        iconColor="text-[#004D34] dark:text-sky-400"
      />

      <StatCard
        title="Audit Logs Volume"
        value={`${movements.length} Records`}
        subtitle="Immutable warehouse transaction logs"
        icon={History}
        iconColor="text-[#004D34] dark:text-indigo-400"
      />
    </div>
  );
};
