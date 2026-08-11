import React from 'react';
import { Modal } from '../../../components/ui/Modal';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    currentStock: number;
    minStockAlert: number;
    location: string;
  };
  setFormData: (data: any) => void;
  formError: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  formError,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Product to Master Catalog"
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digital Pressure Gauge 10-Bar"
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Unique SKU Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="PROD-SEN-009"
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Sensors / Electronics"
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Unit Price (INR) *</label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Initial Stock</label>
              <input
                type="number"
                required
                min="0"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value, 10) })}
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Alert Level</label>
              <input
                type="number"
                required
                min="1"
                value={formData.minStockAlert}
                onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value, 10) })}
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Warehouse Location / Aisle</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
            Save Product
          </button>
        </div>
      </form>
    </Modal>
  );
};
