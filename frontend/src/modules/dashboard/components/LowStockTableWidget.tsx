import React from 'react';
import { Product } from '../../../types';
import { AlertTriangle } from 'lucide-react';

interface LowStockTableWidgetProps {
  products: Product[];
}

export const LowStockTableWidget: React.FC<LowStockTableWidgetProps> = ({ products }) => {
  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span>Low Stock Replenishment List</span>
        </h3>
        <span className="text-xs text-[#6B5542] dark:text-slate-400 font-medium">{products.length} Items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[#6B5542] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="pb-2">Product</th>
              <th className="pb-2">SKU</th>
              <th className="pb-2 text-right">Stock</th>
              <th className="pb-2 text-right">Alert Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                  ✅ All product stock levels healthy.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                  <td className="py-2.5 font-bold text-[#002A1C] dark:text-white">{product.name}</td>
                  <td className="py-2.5 text-[#6B5542] dark:text-slate-400 font-mono">{product.sku}</td>
                  <td className="py-2.5 text-right font-bold text-amber-700 dark:text-amber-400">
                    {product.currentStock}
                  </td>
                  <td className="py-2.5 text-right text-[#6B5542] dark:text-slate-400 font-medium">
                    {product.minStockAlert}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
