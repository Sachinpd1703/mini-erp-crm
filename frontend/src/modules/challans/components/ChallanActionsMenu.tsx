import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreVertical, Eye, Download, CheckCircle, XCircle } from 'lucide-react';
import { SalesChallan } from '../../../types';

interface ChallanActionsMenuProps {
  challan: SalesChallan;
  onViewChallan: (challan: SalesChallan) => void;
  onDownloadPdf: (challanId: string, challanNumber?: string) => void;
  onUpdateStatus: (challanId: string, status: 'CONFIRMED' | 'CANCELLED') => void;
  canManage: boolean;
}

export const ChallanActionsMenu: React.FC<ChallanActionsMenuProps> = ({
  challan,
  onViewChallan,
  onDownloadPdf,
  onUpdateStatus,
  canManage,
}) => {
  const isDraft = challan.status === 'DRAFT';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        className="inline-flex items-center justify-center rounded-xl border border-[#F3CEA6] dark:border-slate-700 bg-[#FFFBF7] dark:bg-slate-800 p-2 text-[#002A1C] dark:text-slate-300 transition hover:bg-[#FDD8A8] dark:hover:bg-slate-700 hover:border-[#004D34] dark:hover:border-sky-500 shadow-sm"
        aria-label={`Open actions menu for order ${challan.challanNumber}`}
      >
        <MoreVertical size={16} />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        portal
        className="z-[70] mt-1.5 w-52 rounded-2xl border border-[#F3CEA6] dark:border-slate-700 bg-[#FFFBF7] dark:bg-slate-900 p-1.5 shadow-xl outline-none space-y-1"
      >
        {/* Action 1: View Sales Order */}
        <MenuItem>
          {({ focus }) => (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewChallan(challan);
              }}
              className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                focus
                  ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-sky-400'
                  : 'text-[#002A1C] dark:text-slate-200'
              }`}
            >
              <Eye size={15} className="text-[#004D34] dark:text-sky-400" />
              <span>View Order Invoice</span>
            </button>
          )}
        </MenuItem>

        {/* Action 2: Download PDF Invoice */}
        <MenuItem>
          {({ focus }) => (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadPdf(challan.id, challan.challanNumber);
              }}
              className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                focus
                  ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-emerald-400'
                  : 'text-[#002A1C] dark:text-slate-200'
              }`}
            >
              <Download size={15} className="text-[#004D34] dark:text-emerald-400" />
              <span>Download PDF Invoice</span>
            </button>
          )}
        </MenuItem>

        {/* Action 3: Confirm & Deduct Stock */}
        {canManage && isDraft && (
          <MenuItem>
            {({ focus }) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(challan.id, 'CONFIRMED');
                }}
                className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                  focus
                    ? 'bg-[#FFE4C4] dark:bg-slate-800 text-emerald-700 dark:text-emerald-400'
                    : 'text-[#002A1C] dark:text-slate-200'
                }`}
              >
                <CheckCircle size={15} className="text-emerald-700 dark:text-emerald-400" />
                <span>Confirm Order & Stock</span>
              </button>
            )}
          </MenuItem>
        )}

        {/* Action 4: Cancel Order */}
        {canManage && isDraft && (
          <MenuItem>
            {({ focus }) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(challan.id, 'CANCELLED');
                }}
                className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                  focus
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                    : 'text-[#002A1C] dark:text-slate-200'
                }`}
              >
                <XCircle size={15} className="text-rose-700 dark:text-rose-400" />
                <span>Cancel Order</span>
              </button>
            )}
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
};
