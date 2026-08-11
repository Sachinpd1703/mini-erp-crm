import React from 'react';
import { Customer } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { MessageSquare } from 'lucide-react';

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  onClose: () => void;
  canEdit: boolean;
  newNote: string;
  onNoteChange: (value: string) => void;
  onAddNote: (e: React.FormEvent) => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  onClose,
  canEdit,
  newNote,
  onNoteChange,
  onAddNote,
}) => {
  if (!customer) return null;

  return (
    <Modal
      isOpen={!!customer}
      onClose={onClose}
      title={`Customer Profile: ${customer.businessName}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Overview Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-[#FFE4C4] dark:bg-slate-800/50 border border-[#F3CEA6] dark:border-slate-700/50 rounded-xl text-xs">
          <div>
            <span className="text-[#6B5542] dark:text-slate-400 font-medium">Contact Person:</span>
            <p className="font-bold text-[#002A1C] dark:text-white">{customer.name}</p>
          </div>
          <div>
            <span className="text-[#6B5542] dark:text-slate-400 font-medium">GSTIN:</span>
            <p className="font-mono font-semibold text-[#002A1C] dark:text-slate-200">{customer.gstNumber || 'N/A'}</p>
          </div>
          <div>
            <span className="text-[#6B5542] dark:text-slate-400 font-medium">Email:</span>
            <p className="text-[#002A1C] dark:text-slate-200 font-semibold">{customer.email}</p>
          </div>
          <div>
            <span className="text-[#6B5542] dark:text-slate-400 font-medium">Mobile:</span>
            <p className="text-[#002A1C] dark:text-slate-200 font-semibold">{customer.mobile}</p>
          </div>
          <div className="col-span-2">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium">Address:</span>
            <p className="text-[#002A1C] dark:text-slate-200 font-semibold">{customer.address}</p>
          </div>
        </div>

        {/* Log Follow-up Note Form */}
        {canEdit && (
          <form onSubmit={onAddNote} className="space-y-2">
            <label className="text-xs font-bold text-[#002A1C] dark:text-slate-300 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Append Interaction / Follow-up Note</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newNote}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Enter interaction note, call log, or agreed terms..."
                className="flex-1 bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-white placeholder-[#6B5542]/60 dark:placeholder-slate-500 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-md"
              >
                Log Note
              </button>
            </div>
          </form>
        )}

        {/* Note Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#002A1C] dark:text-slate-300 uppercase tracking-wider">
            Interaction Timeline ({customer.notes?.length || 0})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {customer.notes?.length === 0 ? (
              <p className="text-xs text-[#6B5542] dark:text-slate-500 font-medium">No interaction notes recorded yet.</p>
            ) : (
              customer.notes?.map((n) => (
                <div
                  key={n.id}
                  className="p-3 bg-[#FFE4C4]/60 dark:bg-slate-800/40 border border-[#F3CEA6] dark:border-slate-800 rounded-xl text-xs space-y-1"
                >
                  <p className="text-[#002A1C] dark:text-slate-200 font-medium">{n.note}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#6B5542] dark:text-slate-500 font-medium">
                    <span>Logged by: {n.author?.fullName || 'Sales Rep'}</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
