import React from 'react';
import { SalesChallan } from '../../../types';
import { StatCard } from '../../../components/ui/StatCard';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { DollarSign, Receipt, FileText, XCircle } from 'lucide-react';

interface ChallanMetricsCardsProps {
  challans: SalesChallan[];
  loading: boolean;
}

export const ChallanMetricsCards: React.FC<ChallanMetricsCardsProps> = ({
  challans,
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

  const confirmedChallans = challans.filter((c) => c.status === 'CONFIRMED');
  const draftChallans = challans.filter((c) => c.status === 'DRAFT');
  const cancelledChallans = challans.filter((c) => c.status === 'CANCELLED');

  const totalBilledRevenue = confirmedChallans.reduce((sum, c) => sum + Number(c.totalAmount || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Billed Revenue"
        value={`INR ${totalBilledRevenue.toFixed(2)}`}
        subtitle={`From ${confirmedChallans.length} Confirmed Sales Orders`}
        icon={DollarSign}
        iconColor="text-emerald-700 dark:text-emerald-400"
      />

      <StatCard
        title="Total Sales Orders"
        value={`${challans.length} Orders`}
        subtitle="Lifetime sales order count"
        icon={Receipt}
        iconColor="text-[#004D34] dark:text-sky-400"
      />

      <StatCard
        title="Pending Draft Orders"
        value={`${draftChallans.length} Pending`}
        subtitle="Awaiting confirmation & stock deduction"
        icon={FileText}
        iconColor="text-amber-700 dark:text-amber-400"
      />

      <StatCard
        title="Cancelled Orders"
        value={`${cancelledChallans.length} Cancelled`}
        subtitle="Orders marked cancelled"
        icon={XCircle}
        iconColor="text-rose-700 dark:text-rose-400"
      />
    </div>
  );
};
