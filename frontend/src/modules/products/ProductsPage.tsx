import React from 'react';
import { Plus } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import { ProductFilterBar } from './components/ProductFilterBar';
import { ProductTable } from './components/ProductTable';
import { AddProductModal } from './components/AddProductModal';
import { EditProductModal } from './components/EditProductModal';
import { AdjustStockModal } from './components/AdjustStockModal';

export const ProductsPage: React.FC = () => {
  const {
    products,
    loading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    stockModalProduct,
    setStockModalProduct,
    editingProduct,
    setEditingProduct,
    formData,
    setFormData,
    editFormData,
    setEditFormData,
    stockAdjustData,
    setStockAdjustData,
    formError,
    canManageStock,
    handleCreateProduct,
    openEditModal,
    handleUpdateProduct,
    handleAdjustStock,
  } = useProducts();

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Product Catalog & Stock</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Inventory item pricing, warehouse aisle tracking, and stock alerts</p>
        </div>

        {canManageStock && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-medium text-xs rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <ProductFilterBar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      {/* Product Catalog Data Table */}
      <ProductTable
        products={products}
        loading={loading}
        canManageStock={canManageStock}
        onOpenStockModal={setStockModalProduct}
        onEditProduct={openEditModal}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateProduct}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleUpdateProduct}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        formError={formError}
      />

      {/* Adjust Stock Modal */}
      <AdjustStockModal
        product={stockModalProduct}
        onClose={() => setStockModalProduct(null)}
        onSubmit={handleAdjustStock}
        stockAdjustData={stockAdjustData}
        setStockAdjustData={setStockAdjustData}
        formError={formError}
      />
    </div>
  );
};
