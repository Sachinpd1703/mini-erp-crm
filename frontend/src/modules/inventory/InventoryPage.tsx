import React from 'react';
import { ArrowUpDown, Download } from 'lucide-react';
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
    handleExportExcel,
  } = useInventory();

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Inventory Movement Audit Log</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Immutable audit trail of all warehouse stock inflows (IN) and sales outflows (OUT)</p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Excel Export Button */}
          <button
            onClick={handleExportExcel}
            disabled={loading || movements.length === 0}
            className="px-3.5 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-sm disabled:opacity-50"
            title="Export Audit Trail to Excel Spreadsheet"
          >
            <Download className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
            <span>Export to Excel</span>
          </button>

          {/* Record Stock Transfer Button */}
          {canManageStock && (
            <button
              onClick={openAdjustModal}
              className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Record Stock Transfer</span>
            </button>
          )}
        </div>
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
