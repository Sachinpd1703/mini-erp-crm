import React from 'react';
import { Plus } from 'lucide-react';
import { useChallans } from './hooks/useChallans';
import { ChallanMetricsCards } from './components/ChallanMetricsCards';
import { ChallanFilterBar } from './components/ChallanFilterBar';
import { ChallanTable } from './components/ChallanTable';
import { CreateChallanWizardModal } from './components/CreateChallanWizardModal';

export const ChallansPage: React.FC = () => {
  const {
    challans,
    rawChallans,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isWizardOpen,
    setIsWizardOpen,
    customers,
    products,
    selectedCustomerId,
    setSelectedCustomerId,
    wizardItems,
    formError,
    formSubmitting,
    canManage,
    openWizard,
    handleAddLineItem,
    handleRemoveLineItem,
    handleUpdateLineItem,
    calculateGrandTotal,
    handleCreateOrder,
    handleUpdateStatus,
    handleDownloadPdf,
  } = useChallans();

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Sales Orders & Challans</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Order fulfillment lifecycle, inventory deductions, and billing invoices</p>
        </div>

        {canManage && (
          <button
            onClick={openWizard}
            className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-medium text-xs rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Sales Order</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <ChallanMetricsCards challans={rawChallans} loading={loading} />

      {/* Filter & Search Bar */}
      <ChallanFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Challans Data Table */}
      <ChallanTable
        challans={challans}
        loading={loading}
        canManage={canManage}
        onDownloadPdf={handleDownloadPdf}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Create Order Wizard Modal */}
      <CreateChallanWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        customersList={customers}
        productsList={products}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={setSelectedCustomerId}
        orderItems={wizardItems}
        onAddLineItem={handleAddLineItem}
        onRemoveLineItem={handleRemoveLineItem}
        onUpdateLineItem={handleUpdateLineItem}
        calculateGrandTotal={calculateGrandTotal}
        onCreateOrder={handleCreateOrder}
        formError={formError}
        formSubmitting={formSubmitting}
      />
    </div>
  );
};
