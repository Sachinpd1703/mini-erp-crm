import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreVertical, ArrowUpDown, Edit3, Eye, PackageCheck } from 'lucide-react';
import { Product } from '../../../types';

interface ProductActionsMenuProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  canManageStock: boolean;
}

export const ProductActionsMenu: React.FC<ProductActionsMenuProps> = ({
  product,
  onViewProduct,
  onAdjustStock,
  onEditProduct,
  canManageStock,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        className="inline-flex items-center justify-center rounded-xl border border-[#F3CEA6] dark:border-slate-700 bg-[#FFFBF7] dark:bg-slate-800 p-2 text-[#002A1C] dark:text-slate-300 transition hover:bg-[#FDD8A8] dark:hover:bg-slate-700 hover:border-[#004D34] dark:hover:border-sky-500 shadow-sm"
        aria-label={`Open actions menu for ${product.name}`}
      >
        <MoreVertical size={16} />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        portal
        className="z-[70] mt-1.5 w-52 rounded-2xl border border-[#F3CEA6] dark:border-slate-700 bg-[#FFFBF7] dark:bg-slate-900 p-1.5 shadow-xl outline-none space-y-1"
      >
        {/* Action 1: View Product Details */}
        <MenuItem>
          {({ focus }) => (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewProduct(product);
              }}
              className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                focus
                  ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-sky-400'
                  : 'text-[#002A1C] dark:text-slate-200'
              }`}
            >
              <Eye size={15} className="text-[#004D34] dark:text-sky-400" />
              <span>View Product & Logs</span>
            </button>
          )}
        </MenuItem>

        {/* Action 2: Quick Adjust Stock */}
        {canManageStock && (
          <MenuItem>
            {({ focus }) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdjustStock(product);
                }}
                className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                  focus
                    ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-emerald-400'
                    : 'text-[#002A1C] dark:text-slate-200'
                }`}
              >
                <ArrowUpDown size={15} className="text-emerald-700 dark:text-emerald-400" />
                <span>Adjust Stock (IN / OUT)</span>
              </button>
            )}
          </MenuItem>
        )}

        {/* Action 3: Edit Product Info */}
        {canManageStock && (
          <MenuItem>
            {({ focus }) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct(product);
                }}
                className={`flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                  focus
                    ? 'bg-[#FFE4C4] dark:bg-slate-800 text-[#004D34] dark:text-amber-400'
                    : 'text-[#002A1C] dark:text-slate-200'
                }`}
              >
                <Edit3 size={15} className="text-amber-700 dark:text-amber-400" />
                <span>Edit Product Info</span>
              </button>
            )}
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
};
