import React from 'react';
import { Customer, CustomerStatus, CustomerType } from '../../../types';
import { Modal } from '../../../components/ui/Modal';

interface EditCustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editFormData: {
    name: string;
    mobile: string;
    email: string;
    businessName: string;
    gstNumber: string;
    customerType: CustomerType;
    address: string;
    status: CustomerStatus;
    followUpDate: string;
  };
  setEditFormData: (data: any) => void;
  formError: string;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  customer,
  onClose,
  onSubmit,
  editFormData,
  setEditFormData,
  formError,
}) => {
  if (!customer) return null;

  return (
    <Modal
      isOpen={!!customer}
      onClose={onClose}
      title={`Edit Customer: ${customer.businessName}`}
      maxWidth="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Business / Trade Name *</label>
            <input
              type="text"
              required
              value={editFormData.businessName}
              onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Contact Person Name *</label>
            <input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Work Email *</label>
            <input
              type="email"
              required
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Mobile Number *</label>
            <input
              type="text"
              required
              value={editFormData.mobile}
              onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Customer Type</label>
            <select
              value={editFormData.customerType}
              onChange={(e) =>
                setEditFormData({ ...editFormData, customerType: e.target.value as CustomerType })
              }
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            >
              <option value="RETAIL">RETAIL</option>
              <option value="WHOLESALE">WHOLESALE</option>
              <option value="DISTRIBUTOR">DISTRIBUTOR</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">GST Number (Optional)</label>
            <input
              type="text"
              value={editFormData.gstNumber}
              onChange={(e) => setEditFormData({ ...editFormData, gstNumber: e.target.value })}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-mono uppercase"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Full Address *</label>
            <textarea
              required
              rows={2}
              value={editFormData.address}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Lead Status</label>
            <select
              value={editFormData.status}
              onChange={(e) =>
                setEditFormData({ ...editFormData, status: e.target.value as CustomerStatus })
              }
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            >
              <option value="LEAD">LEAD</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Follow-Up Date</label>
            <input
              type="date"
              value={editFormData.followUpDate}
              onChange={(e) => setEditFormData({ ...editFormData, followUpDate: e.target.value })}
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
            className="px-4 py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Update Profile
          </button>
        </div>
      </form>
    </Modal>
  );
};
