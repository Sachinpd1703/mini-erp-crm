import React, { useState, useEffect } from 'react';
import { Product, MovementType } from '../../types';
import { apiClient } from '../../services/api';
import { clientCache, getCachedData } from '../../services/apiCache';
import { Modal } from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Search, Plus, Package, Layers, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitPrice: 0,
    currentStock: 0,
    minStockAlert: 5,
    location: '',
  });

  const [stockAdjustData, setStockAdjustData] = useState({
    quantity: 1,
    movementType: 'IN' as MovementType,
    reason: '',
  });

  const [formError, setFormError] = useState('');

  const fetchProducts = async () => {
    const params: any = {};
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;

    const cached = clientCache.get<any>('/products', params);
    if (cached) {
      setProducts(cached.data || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData('/products', params);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await apiClient.post('/products', {
        ...formData,
        unitPrice: Number(formData.unitPrice),
        currentStock: Number(formData.currentStock),
        minStockAlert: Number(formData.minStockAlert),
      });

      if (res.data.success) {
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          sku: '',
          category: '',
          unitPrice: 0,
          currentStock: 0,
          minStockAlert: 5,
          location: '',
        });
        clientCache.invalidate('/products');
        clientCache.invalidate('/inventory');
        fetchProducts();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to create product');
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    setFormError('');

    try {
      const res = await apiClient.post(`/products/${stockModalProduct.id}/stock`, {
        quantity: Number(stockAdjustData.quantity),
        movementType: stockAdjustData.movementType,
        reason: stockAdjustData.reason,
      });

      if (res.data.success) {
        setStockModalProduct(null);
        setStockAdjustData({ quantity: 1, movementType: 'IN', reason: '' });
        clientCache.invalidate('/products');
        clientCache.invalidate('/inventory');
        fetchProducts();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to adjust stock');
    }
  };

  const canManageStock = user?.role === 'ADMIN' || user?.role === 'WAREHOUSE';

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Product Catalog & Stock</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Inventory item pricing, warehouse aisle tracking, and stock alerts</p>
        </div>

        {canManageStock && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-medium text-xs rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B5542] dark:text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name, SKU, or category..."
            className="w-full bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-[#002A1C] dark:text-white placeholder-[#6B5542]/70 dark:placeholder-slate-500 focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500 font-medium"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Sensors">Sensors</option>
          <option value="Electrical">Electrical</option>
        </select>
      </div>

      {/* Product Data Table */}
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
                {canManageStock && <th className="py-3 px-4 text-right">Stock Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const isLowStock = prod.currentStock <= prod.minStockAlert;
                  return (
                    <tr key={prod.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#002A1C] dark:text-white">{prod.name}</p>
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
                      {canManageStock && (
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setStockModalProduct(prod)}
                            className="px-2.5 py-1.5 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#004D34] dark:text-sky-400 font-bold border border-[#F3CEA6] dark:border-slate-700 rounded-lg transition inline-flex items-center space-x-1 text-[11px]"
                          >
                            <ArrowUpDown className="w-3 h-3" />
                            <span>Adjust Stock</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Product to Master Catalog"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {formError}
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Product Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digital Pressure Gauge 10-Bar"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Unique SKU Code *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  placeholder="PROD-SEN-009"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Category *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Sensors / Electronics"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Unit Price (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Initial Stock</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Alert Level</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.minStockAlert}
                  onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Warehouse Location / Aisle</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Rack-A4 / Bin 12"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-xl shadow-lg shadow-sky-600/20"
            >
              Save Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Manual Stock Adjustment Modal */}
      <Modal
        isOpen={!!stockModalProduct}
        onClose={() => setStockModalProduct(null)}
        title={`Adjust Stock: ${stockModalProduct?.name || ''}`}
      >
        <form onSubmit={handleAdjustStock} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {formError}
            </div>
          )}

          <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs flex justify-between">
            <span>Current Available Stock:</span>
            <span className="font-bold text-sky-400">{stockModalProduct?.currentStock} Units</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Movement Type</label>
                <select
                  value={stockAdjustData.movementType}
                  onChange={(e) =>
                    setStockAdjustData({ ...stockAdjustData, movementType: e.target.value as MovementType })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value="IN">IN (+ Stock Addition)</option>
                  <option value="OUT">OUT (- Stock Removal)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockAdjustData.quantity}
                  onChange={(e) => setStockAdjustData({ ...stockAdjustData, quantity: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Reason for Adjustment Audit Log *</label>
              <textarea
                required
                rows={2}
                value={stockAdjustData.reason}
                onChange={(e) => setStockAdjustData({ ...stockAdjustData, reason: e.target.value })}
                placeholder="Vendor purchase delivery, customer return, damaged stock removal..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setStockModalProduct(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-xl shadow-lg shadow-sky-600/20"
            >
              Confirm Stock Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
