import React from 'react';
import { UserPlus } from 'lucide-react';
import { useCustomers } from './hooks/useCustomers';
import { CustomerFilterBar } from './components/CustomerFilterBar';
import { CustomerTable } from './components/CustomerTable';
import { AddCustomerModal } from './components/AddCustomerModal';
import { CustomerDetailDrawer } from './components/CustomerDetailDrawer';

export const CustomersPage: React.FC = () => {
  const {
    customers,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedCustomer,
    setSelectedCustomer,
    newNote,
    setNewNote,
    formData,
    setFormData,
    formError,
    canEdit,
    handleCreateCustomer,
    handleAddNote,
    openCustomerDetail,
  } = useCustomers();

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Customer CRM</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Manage client profiles, lead conversion status, and follow-up logs</p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-medium text-xs rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Customer</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <CustomerFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {/* Customer Data Table */}
      <CustomerTable
        customers={customers}
        loading={loading}
        onViewDetail={openCustomerDetail}
      />

      {/* Detail Drawer */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        canEdit={canEdit}
        newNote={newNote}
        onNoteChange={setNewNote}
        onAddNote={handleAddNote}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCustomer}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
      />
    </div>
  );
};
