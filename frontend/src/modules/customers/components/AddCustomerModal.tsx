import React from 'react';
import { CustomerStatus, CustomerType } from '../../../types';
import { Modal } from '../../../components/ui/Modal';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
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
  setFormData: (data: any) => void;
  formError: string;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
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
      title="Register New Customer"
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
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Apex Wholesale Ltd"
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Contact Person Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Work Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@company.com"
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Mobile Number *</label>
            <input
              type="text"
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 9876543210"
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Customer Type</label>
            <select
              value={formData.customerType}
              onChange={(e) =>
                setFormData({ ...formData, customerType: e.target.value as CustomerType })
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
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              placeholder="27AAAAA0000A1Z5"
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-mono uppercase"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Full Address *</label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Plot 45, MIDC Industrial Area..."
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Lead Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as CustomerStatus })
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
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
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
            Save Customer
          </button>
        </div>
      </form>
    </Modal>
  );
};
