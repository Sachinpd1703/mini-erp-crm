import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../types';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { AlertTriangle } from 'lucide-react';
import { ProductActionsMenu } from './ProductActionsMenu';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  canManageStock: boolean;
  onOpenStockModal: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  canManageStock,
  onOpenStockModal,
  onEditProduct,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <TableSkeleton rows={5} cols={7} />;
  }

  const handleRowClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Product Name / SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-4 text-right">Current Stock</th>
              <th className="py-3 px-4 text-right">Min Alert</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                  No matching products found.
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const isLowStock = prod.currentStock <= prod.minStockAlert;
                return (
                  <tr
                    key={prod.id}
                    onClick={() => handleRowClick(prod.id)}
                    className="hover:bg-[#FFFBF7] dark:hover:bg-slate-800/50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#002A1C] dark:text-white group-hover:text-[#004D34] dark:group-hover:text-sky-400 transition">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-mono font-medium">SKU: {prod.sku}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#002A1C] dark:text-slate-300 font-semibold">{prod.category}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#002A1C] dark:text-white">
                      INR {Number(prod.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold">
                      <span
                        className={
                          isLowStock ? 'text-amber-700 dark:text-amber-400 flex items-center justify-end space-x-1' : 'text-emerald-700 dark:text-emerald-400'
                        }
                      >
                        {isLowStock && <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{prod.currentStock} Units</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#6B5542] dark:text-slate-400 font-medium">{prod.minStockAlert}</td>
                    <td className="py-3.5 px-4 text-[#6B5542] dark:text-slate-400 font-mono text-[11px] font-medium">
                      {prod.location || 'Aisle Main'}
                    </td>
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ProductActionsMenu
                        product={prod}
                        canManageStock={canManageStock}
                        onViewProduct={() => handleRowClick(prod.id)}
                        onAdjustStock={onOpenStockModal}
                        onEditProduct={onEditProduct}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
