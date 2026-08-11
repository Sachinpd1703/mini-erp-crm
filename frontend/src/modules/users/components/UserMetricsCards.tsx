import React from 'react';
import { User } from '../../../types';
import { StatCard } from '../../../components/ui/StatCard';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { Users, ShieldCheck, Briefcase, Warehouse, CreditCard } from 'lucide-react';

interface UserMetricsCardsProps {
  users: User[];
  loading: boolean;
}

export const UserMetricsCards: React.FC<UserMetricsCardsProps> = ({ users, loading }) => {
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

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const salesCount = users.filter((u) => u.role === 'SALES').length;
  const warehouseCount = users.filter((u) => u.role === 'WAREHOUSE').length;
  const accountsCount = users.filter((u) => u.role === 'ACCOUNTS').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Staff Accounts"
        value={`${users.length} Active Users`}
        subtitle="Authorized ERP system users"
        icon={Users}
        iconColor="text-[#004D34] dark:text-sky-400"
      />

      <StatCard
        title="System Administrators"
        value={`${adminCount} Admins`}
        subtitle="Full administrative access"
        icon={ShieldCheck}
        iconColor="text-amber-700 dark:text-amber-400"
      />

      <StatCard
        title="Sales Representatives"
        value={`${salesCount} Sales Reps`}
        subtitle="Customer & challan management"
        icon={Briefcase}
        iconColor="text-emerald-700 dark:text-emerald-400"
      />

      <StatCard
        title="Warehouse Managers"
        value={`${warehouseCount} Stock Staff`}
        subtitle="Inventory & stock transfers"
        icon={Warehouse}
        iconColor="text-indigo-700 dark:text-indigo-400"
      />
    </div>
  );
};
