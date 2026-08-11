import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product, StockMovement, MovementType } from '../../types';
import { apiClient } from '../../services/api';
import { clientCache, getCachedData } from '../../services/apiCache';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { EditProductModal } from './components/EditProductModal';
import { AdjustStockModal } from './components/AdjustStockModal';
import { useAuth } from '../auth/AuthContext';
import {
  ArrowLeft,
  Package,
  Layers,
  MapPin,
  AlertTriangle,
  DollarSign,
  ArrowUpDown,
  Edit3,
  History,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);

  // Form States
  const [editFormData, setEditFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitPrice: 0,
    minStockAlert: 5,
    location: '',
  });

  const [stockAdjustData, setStockAdjustData] = useState({
    quantity: 1,
    movementType: 'IN' as MovementType,
    reason: '',
  });

  const [formError, setFormError] = useState('');

  const fetchProductDetail = async () => {
    if (!id) return;
    const cacheKey = `/products/${id}`;

    const cached = clientCache.get<any>(cacheKey);
    if (cached) {
      setProduct(cached.data || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData(cacheKey);
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const openEditModal = () => {
    if (!product) return;
    setEditingProduct(product);
    setFormError('');
    setEditFormData({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      unitPrice: Number(product.unitPrice) || 0,
      minStockAlert: Number(product.minStockAlert) || 5,
      location: product.location || '',
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setFormError('');
    try {
      const res = await apiClient.put(`/products/${product.id}`, {
        ...editFormData,
        unitPrice: Number(editFormData.unitPrice),
        minStockAlert: Number(editFormData.minStockAlert),
      });

      if (res.data.success) {
        setEditingProduct(null);
        clientCache.invalidate(`/products/${product.id}`);
        clientCache.invalidate('/products');
        clientCache.invalidate('/inventory');
        fetchProductDetail();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to update product');
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setFormError('');

    try {
      const res = await apiClient.post(`/products/${product.id}/stock`, {
        quantity: Number(stockAdjustData.quantity),
        movementType: stockAdjustData.movementType,
        reason: stockAdjustData.reason,
      });

      if (res.data.success) {
        setStockModalProduct(null);
        setStockAdjustData({ quantity: 1, movementType: 'IN', reason: '' });
        clientCache.invalidate(`/products/${product.id}`);
        clientCache.invalidate('/products');
        clientCache.invalidate('/inventory');
        fetchProductDetail();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to adjust stock');
    }
  };

  const canManageStock = user?.role === 'ADMIN' || user?.role === 'WAREHOUSE';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#FFE4C4] dark:bg-slate-800 animate-pulse" />
          <div className="w-48 h-6 rounded bg-[#FFE4C4] dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-base text-[#6B5542] dark:text-slate-400 font-medium">Product details not found.</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#004D34] text-white rounded-xl text-xs font-bold shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const isLowStock = product.currentStock <= product.minStockAlert;
  const isOutOfStock = product.currentStock === 0;
  const inventoryValue = Number(product.unitPrice) * product.currentStock;
  const movements: StockMovement[] = product.stockMovements || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/products')}
            className="p-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-300 rounded-xl border border-[#F3CEA6] dark:border-slate-700 transition shadow-sm"
            title="Back to Product Catalog"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">
                {product.name}
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase bg-[#FFE4C4] dark:bg-slate-800 px-2 py-0.5 rounded border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300">
                SKU: {product.sku}
              </span>
              <Badge
                label={isOutOfStock ? 'OUT OF STOCK' : isLowStock ? 'LOW STOCK' : 'HEALTHY'}
                variant={isOutOfStock ? 'danger' : isLowStock ? 'warning' : 'success'}
              />
            </div>
            <p className="text-xs text-[#6B5542] dark:text-slate-400">
              Category: <span className="font-semibold text-[#002A1C] dark:text-slate-200">{product.category}</span> • Location: <span className="font-mono">{product.location || 'Aisle Main'}</span>
            </p>
          </div>
        </div>

        {canManageStock && (
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={openEditModal}
              className="px-3.5 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm"
            >
              <Edit3 size={14} className="text-amber-700 dark:text-amber-400" />
              <span>Edit Product</span>
            </button>

            <button
              onClick={() => setStockModalProduct(product)}
              className="px-4 py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
            >
              <ArrowUpDown size={14} />
              <span>Adjust Stock</span>
            </button>
          </div>
        )}
      </div>

      {/* TOP SECTION: Product Master Specifications Card */}
      <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
            <Package className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
            <span>Master Product Specifications & Warehouse Location</span>
          </h3>
          <span className="text-xs font-mono font-bold text-[#004D34] dark:text-sky-400">
            Unit Price: INR {Number(product.unitPrice).toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <Package className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Product Title</span>
            </span>
            <p className="font-bold text-[#002A1C] dark:text-white text-sm">{product.name}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>SKU & Category</span>
            </span>
            <p className="font-mono font-bold text-[#002A1C] dark:text-slate-200">{product.sku}</p>
            <p className="text-[#6B5542] dark:text-slate-400 font-medium">{product.category}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Warehouse Location</span>
            </span>
            <p className="font-mono font-bold text-[#002A1C] dark:text-slate-200">{product.location || 'Aisle Main'}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Stock Threshold Alert</span>
            </span>
            <p className="font-bold text-[#002A1C] dark:text-slate-200">{product.minStockAlert} Minimum Units</p>
          </div>
        </div>
      </div>

      {/* SECOND SECTION: Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Current Stock Level</span>
            <Package className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            {product.currentStock} Units
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Available in physical warehouse</p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Total Inventory Value</span>
            <DollarSign className="w-4 h-4 text-[#004D34] dark:text-emerald-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            INR {inventoryValue.toFixed(2)}
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Asset value at current unit price</p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Minimum Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            {product.minStockAlert} Units
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Automated alert threshold</p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Stock Movement Audit</span>
            <History className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            {movements.length} Logged Entries
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Total transfer history logs</p>
        </div>
      </div>

      {/* Main Grid Content: Stock Movements Audit Ledger */}
      <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
            <History className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
            <span>Stock Movements Audit Ledger</span>
          </h3>
          <span className="text-xs text-[#6B5542] dark:text-slate-400 font-medium">
            {movements.length} Total Audit Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3 text-center">Movement Type</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3">Audit Reason / Description</th>
                <th className="py-2.5 px-3 text-right">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                    No stock movement audit records logged yet.
                  </td>
                </tr>
              ) : (
                movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 text-[#6B5542] dark:text-slate-400 font-mono text-[11px]">
                      {new Date(mov.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          mov.movementType === 'IN'
                            ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {mov.movementType === 'IN' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{mov.movementType === 'IN' ? '+ IN (Addition)' : '- OUT (Removal)'}</span>
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-bold text-sm ${
                        mov.movementType === 'IN'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {mov.movementType === 'IN' ? `+${mov.quantity}` : `-${mov.quantity}`}
                    </td>
                    <td className="py-3 px-3 text-[#002A1C] dark:text-slate-200 font-medium">
                      {mov.reason}
                    </td>
                    <td className="py-3 px-3 text-right text-[#6B5542] dark:text-slate-400 font-medium">
                      {mov.author?.fullName || 'System User'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleUpdateProduct}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        formError={formError}
      />

      {/* Adjust Stock Modal */}
      <AdjustStockModal
        product={stockModalProduct}
        onClose={() => setStockModalProduct(null)}
        onSubmit={handleAdjustStock}
        stockAdjustData={stockAdjustData}
        setStockAdjustData={setStockAdjustData}
        formError={formError}
      />
    </div>
  );
};
