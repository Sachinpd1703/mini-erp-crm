import React from 'react';
import { User, Role } from '../../../types';
import { Modal } from '../../../components/ui/Modal';

interface EditRoleModalProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newRole: Role;
  setNewRole: (role: Role) => void;
  formError: string;
}

export const EditRoleModal: React.FC<EditRoleModalProps> = ({
  user,
  onClose,
  onSubmit,
  newRole,
  setNewRole,
  formError,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={!!user}
      onClose={onClose}
      title={`Update Access Role: ${user.fullName}`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold">
            {formError}
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#FFE4C4] dark:bg-slate-800/50 border border-[#F3CEA6] dark:border-slate-700 rounded-xl space-y-1">
            <p className="text-[#6B5542] dark:text-slate-400 font-medium">User Account Email:</p>
            <p className="font-bold text-[#002A1C] dark:text-white font-mono">{user.email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[#002A1C] dark:text-slate-300 font-bold">Select New System Role *</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as Role)}
              className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-[#002A1C] dark:text-white font-bold"
            >
              <option value="SALES">SALES (CRM & Sales Orders)</option>
              <option value="WAREHOUSE">WAREHOUSE (Stock & Audit Logs)</option>
              <option value="ACCOUNTS">ACCOUNTS (Invoices & Billing Statements)</option>
              <option value="ADMIN">ADMIN (Full System Control)</option>
            </select>
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
            Update Role
          </button>
        </div>
      </form>
    </Modal>
  );
};
