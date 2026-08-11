import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreVertical, UserCheck, Edit3, MessageSquare, ShoppingBag } from 'lucide-react';
import { Customer } from '../../../types';

interface CustomerActionsMenuProps {
  customer: Customer;
  onViewProfile: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onAddNote: (customer: Customer) => void;
  onCreateSalesOrder?: (customer: Customer) => void;
  canEdit: boolean;
}

export const CustomerActionsMenu: React.FC<CustomerActionsMenuProps> = ({
  customer,
  onViewProfile,
  onEditCustomer,
  onAddNote,
  onCreateSalesOrder,
  canEdit,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        className="inline-flex items-center justify-center rounded-xl border border-[#F3CEA6] dark:border-slate-700 bg-[#FFFBF7] dark:bg-slate-800 p-2 text-[#002A1C] dark:text-slate-300 transition hover:bg-[#FDD8A8] dark:hover:bg-slate-700 hover:border-[#004D34] dark:hover:border-sky-500 shadow-sm"
        aria-label={`Open actions menu for ${customer.businessName}`}
      >
        <MoreVertical size={16} />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        portal
        className="z-[70] mt-1.5 w-52 rounded-2xl border border-[#F3CEA6] dark:border-slate-700 bg-[#FFFBF7] dark:bg-slate-900 p-1.5 shadow-xl outline-none space-y-1"
      >
        {/* Action 1: View Profile */}
        <MenuItem>
          {({ focus }) => (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(customer);
              }}
              className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                focus
                  ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-sky-400'
                  : 'text-[#002A1C] dark:text-slate-200'
              }`}
            >
              <UserCheck size={15} className="text-[#004D34] dark:text-sky-400" />
              <span>View Profile & Logs</span>
            </button>
          )}
        </MenuItem>

        {/* Action 2: Edit Customer Profile */}
        {canEdit && (
          <MenuItem>
            {({ focus }) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCustomer(customer);
                }}
                className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                  focus
                    ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-amber-400'
                    : 'text-[#002A1C] dark:text-slate-200'
                }`}
              >
                <Edit3 size={15} className="text-amber-700 dark:text-amber-400" />
                <span>Edit Profile Info</span>
              </button>
            )}
          </MenuItem>
        )}

        {/* Action 3: Log Follow-up Note */}
        {canEdit && (
          <MenuItem>
            {({ focus }) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNote(customer);
                }}
                className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                  focus
                    ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-emerald-400'
                    : 'text-[#002A1C] dark:text-slate-200'
                }`}
              >
                <MessageSquare size={15} className="text-emerald-700 dark:text-emerald-400" />
                <span>Log Interaction Note</span>
              </button>
            )}
          </MenuItem>
        )}

        {/* Action 4: Create Sales Order */}
        {canEdit && onCreateSalesOrder && (
          <div className="pt-1 border-t border-[#F3CEA6] dark:border-slate-800">
            <MenuItem>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateSalesOrder(customer);
                  }}
                  className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                    focus
                      ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-sky-400'
                      : 'text-[#004D34] dark:text-sky-400'
                  }`}
                >
                  <ShoppingBag size={15} />
                  <span>Create Sales Order</span>
                </button>
              )}
            </MenuItem>
          </div>
        )}
      </MenuItems>
    </Menu>
  );
};
