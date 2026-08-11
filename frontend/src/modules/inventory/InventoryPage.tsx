import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useInventory } from './hooks/useInventory';
import { InventoryMetricsCards } from './components/InventoryMetricsCards';
import { InventoryFilterBar } from './components/InventoryFilterBar';
import { InventoryTable } from './components/InventoryTable';
import { RecordTransferModal } from './components/RecordTransferModal';

export const InventoryPage: React.FC = () => {
  const {
    movements,
    rawMovements,
    loading,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    isAdjustModalOpen,
    setIsAdjustModalOpen,
    productsList,
    selectedProductId,
    setSelectedProductId,
    adjustFormData,
    setAdjustFormData,
    formError,
    canManageStock,
    openAdjustModal,
    handleAdjustStock,
  } = useInventory();

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Inventory Movement Audit Log</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Immutable audit trail of all warehouse stock inflows (IN) and sales outflows (OUT)</p>
        </div>

        {canManageStock && (
          <button
            onClick={openAdjustModal}
            className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Record Stock Transfer</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <InventoryMetricsCards movements={rawMovements} loading={loading} />

      {/* Filter & Search Bar */}
      <InventoryFilterBar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {/* Movements Audit Data Table */}
      <InventoryTable movements={movements} loading={loading} />

      {/* Direct Stock Transfer Modal */}
      <RecordTransferModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSubmit={handleAdjustStock}
        productsList={productsList}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        adjustFormData={adjustFormData}
        setAdjustFormData={setAdjustFormData}
        formError={formError}
      />
    </div>
  );
};
