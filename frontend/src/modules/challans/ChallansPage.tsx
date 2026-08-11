import React from 'react';
import { Plus } from 'lucide-react';
import { useChallans } from './hooks/useChallans';
import { ChallanFilterBar } from './components/ChallanFilterBar';
import { ChallanTable } from './components/ChallanTable';
import { CreateChallanWizardModal } from './components/CreateChallanWizardModal';

export const ChallansPage: React.FC = () => {
  const {
    challans,
    loading,
    statusFilter,
    setStatusFilter,
    isCreateModalOpen,
    setIsCreateModalOpen,
    customersList,
    productsList,
    selectedCustomerId,
    setSelectedCustomerId,
    orderItems,
    formError,
    formSubmitting,
    canCreate,
    openCreateWizard,
    addLineItem,
    removeLineItem,
    updateLineItem,
    calculateGrandTotal,
    handleCreateOrder,
    handleStatusChange,
    handleDownloadPdf,
  } = useChallans();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Sales Challans & Order Fulfillment</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Generate sales orders, trigger atomic stock deductions, and download invoices</p>
        </div>

        {canCreate && (
          <button
            onClick={openCreateWizard}
            className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-medium text-xs rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Sales Challan</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <ChallanFilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalOrders={challans.length}
      />

      {/* Challans Table */}
      <ChallanTable
        challans={challans}
        loading={loading}
        canCreate={canCreate}
        onStatusChange={handleStatusChange}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Create Sales Order Wizard Modal */}
      <CreateChallanWizardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        customersList={customersList}
        productsList={productsList}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={setSelectedCustomerId}
        orderItems={orderItems}
        onAddLineItem={addLineItem}
        onRemoveLineItem={removeLineItem}
        onUpdateLineItem={updateLineItem}
        calculateGrandTotal={calculateGrandTotal}
        onCreateOrder={handleCreateOrder}
        formError={formError}
        formSubmitting={formSubmitting}
      />
    </div>
  );
};
