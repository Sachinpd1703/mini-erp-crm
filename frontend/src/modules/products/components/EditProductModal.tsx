import React from 'react';
import { Product } from '../../../types';
import { Modal } from '../../../components/ui/Modal';

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editFormData: {
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    minStockAlert: number;
    location: string;
  };
  setEditFormData: (data: any) => void;
  formError: string;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  onClose,
  onSubmit,
  editFormData,
  setEditFormData,
  formError,
}) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={!!product}
      onClose={onClose}
      title={`Edit Product: ${product.name}`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold">
            {formError}
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Product Title *</label>
            <input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Unique SKU Code *</label>
              <input
                type="text"
                required
                value={editFormData.sku}
                onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value.toUpperCase() })}
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Category *</label>
              <input
                type="text"
                required
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Unit Price (INR) *</label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                value={editFormData.unitPrice}
                onChange={(e) => setEditFormData({ ...editFormData, unitPrice: parseFloat(e.target.value) })}
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Low Stock Alert Threshold</label>
              <input
                type="number"
                required
                min="1"
                value={editFormData.minStockAlert}
                onChange={(e) => setEditFormData({ ...editFormData, minStockAlert: parseInt(e.target.value, 10) })}
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Warehouse Location / Aisle</label>
            <input
              type="text"
              value={editFormData.location}
              onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
              placeholder="Rack-A4 / Bin 12"
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#F3CEA6] dark:border-slate-800 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Update Product
          </button>
        </div>
      </form>
    </Modal>
  );
};
