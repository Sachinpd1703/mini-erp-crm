import React from 'react';
import { Customer, Product, ChallanStatus } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Trash2, AlertCircle } from 'lucide-react';

interface CreateChallanWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  customersList: Customer[];
  productsList: Product[];
  selectedCustomerId: string;
  onSelectCustomer: (id: string) => void;
  orderItems: { productId: string; quantity: number }[];
  onAddLineItem: () => void;
  onRemoveLineItem: (index: number) => void;
  onUpdateLineItem: (index: number, field: 'productId' | 'quantity', value: any) => void;
  calculateGrandTotal: () => number;
  onCreateOrder: (status: ChallanStatus) => void;
  formError: string;
  formSubmitting: boolean;
}

export const CreateChallanWizardModal: React.FC<CreateChallanWizardModalProps> = ({
  isOpen,
  onClose,
  customersList,
  productsList,
  selectedCustomerId,
  onSelectCustomer,
  orderItems,
  onAddLineItem,
  onRemoveLineItem,
  onUpdateLineItem,
  calculateGrandTotal,
  onCreateOrder,
  formError,
  formSubmitting,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Sales Order (Challan Wizard)"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Customer Selector */}
        <div className="space-y-1 text-xs">
          <label className="text-[#002A1C] dark:text-slate-300 font-bold">Select Target Customer *</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => onSelectCustomer(e.target.value)}
            className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
          >
            <option value="">-- Choose Customer --</option>
            {customersList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.businessName} ({c.name} - {c.customerType})
              </option>
            ))}
          </select>
        </div>

        {/* Line Items Builder */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Order Line Items</label>
            <button
              type="button"
              onClick={onAddLineItem}
              className="px-2.5 py-1 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#004D34] dark:text-sky-400 rounded-lg text-[11px] font-bold border border-[#F3CEA6] dark:border-slate-700 transition"
            >
              + Add Item Row
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {orderItems.map((item, index) => {
              const prodMap = new Map(productsList.map((p) => [p.id, p]));
              const selectedProd = prodMap.get(item.productId);
              const isInsufficient = selectedProd && selectedProd.currentStock < item.quantity;

              return (
                <div
                  key={index}
                  className="p-3 bg-[#FFE4C4]/50 dark:bg-slate-800/40 border border-[#F3CEA6] dark:border-slate-700/50 rounded-xl grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-6">
                    <select
                      value={item.productId}
                      onChange={(e) => onUpdateLineItem(index, 'productId', e.target.value)}
                      className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-[#002A1C] dark:text-white font-medium"
                    >
                      <option value="">-- Select Product --</option>
                      {productsList.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {p.currentStock}) - INR {Number(p.unitPrice).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateLineItem(index, 'quantity', parseInt(e.target.value, 10) || 1)
                      }
                      placeholder="Qty"
                      className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-[#002A1C] dark:text-white font-medium text-right"
                    />
                  </div>

                  <div className="col-span-2 text-right font-bold text-[#002A1C] dark:text-white">
                    {selectedProd
                      ? `INR ${(Number(selectedProd.unitPrice) * item.quantity).toFixed(2)}`
                      : 'INR 0.00'}
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => onRemoveLineItem(index)}
                      className="p-1 text-[#6B5542] hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {isInsufficient && (
                    <div className="col-span-12 text-[10px] text-amber-700 dark:text-amber-400 flex items-center space-x-1 pt-1 font-semibold">
                      <AlertCircle className="w-3 h-3" />
                      <span>Warning: Requested qty exceeds available stock ({selectedProd.currentStock})</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grand Total Summary */}
        <div className="p-3 bg-[#FFE4C4] dark:bg-slate-800/80 border border-[#F3CEA6] dark:border-slate-700 rounded-xl flex items-center justify-between">
          <span className="text-xs text-[#6B5542] dark:text-slate-400 font-bold">Estimated Grand Total:</span>
          <span className="text-base font-bold text-[#004D34] dark:text-sky-400">
            INR {calculateGrandTotal().toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#F3CEA6] dark:border-slate-800 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-bold rounded-xl"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={formSubmitting}
            onClick={() => onCreateOrder(ChallanStatus.DRAFT)}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-xl"
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={formSubmitting}
            onClick={() => onCreateOrder(ChallanStatus.CONFIRMED)}
            className="px-4 py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Confirm & Deduct Stock
          </button>
        </div>
      </div>
    </Modal>
  );
};
