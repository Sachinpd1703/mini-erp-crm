import React from 'react';
import { Product, MovementType } from '../../../types';
import { Modal } from '../../../components/ui/Modal';

interface RecordTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  productsList: Product[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  adjustFormData: {
    quantity: number;
    movementType: MovementType;
    reason: string;
  };
  setAdjustFormData: (data: any) => void;
  formError: string;
}

export const RecordTransferModal: React.FC<RecordTransferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productsList,
  selectedProductId,
  onSelectProduct,
  adjustFormData,
  setAdjustFormData,
  formError,
}) => {
  const selectedProd = productsList.find((p) => p.id === selectedProductId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Stock Transfer / Movement"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold">
            {formError}
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Select Target Product *</label>
            <select
              value={selectedProductId}
              onChange={(e) => onSelectProduct(e.target.value)}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            >
              <option value="">-- Choose Product Item --</option>
              {productsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku}) - Current Stock: {p.currentStock}
                </option>
              ))}
            </select>
          </div>

          {selectedProd && (
            <div className="p-3 bg-[#FFE4C4] dark:bg-slate-800/50 border border-[#F3CEA6] dark:border-slate-700/50 rounded-xl flex justify-between">
              <span className="text-[#6B5542] dark:text-slate-400 font-medium">Available Stock On Hand:</span>
              <span className="font-bold text-[#004D34] dark:text-sky-400">{selectedProd.currentStock} Units</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Movement Type</label>
              <select
                value={adjustFormData.movementType}
                onChange={(e) =>
                  setAdjustFormData({ ...adjustFormData, movementType: e.target.value as MovementType })
                }
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-bold"
              >
                <option value="IN">IN (+ Stock Addition / Delivery)</option>
                <option value="OUT">OUT (- Stock Removal / Outflow)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#002A1C] dark:text-slate-300 font-bold">Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={adjustFormData.quantity}
                onChange={(e) => setAdjustFormData({ ...adjustFormData, quantity: parseInt(e.target.value, 10) })}
                className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Reason for Transfer Audit Log *</label>
            <textarea
              required
              rows={2}
              value={adjustFormData.reason}
              onChange={(e) => setAdjustFormData({ ...adjustFormData, reason: e.target.value })}
              placeholder="Vendor purchase delivery, customer return, stock adjustment note..."
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
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
            className="px-4 py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Record Transfer Log
          </button>
        </div>
      </form>
    </Modal>
  );
};
