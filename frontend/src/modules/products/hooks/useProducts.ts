import { useState, useEffect } from 'react';
import { Product, MovementType } from '../../../types';
import { apiClient } from '../../../services/api';
import { clientCache, getCachedData } from '../../../services/apiCache';
import { useAuth } from '../../auth/AuthContext';

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const openEditModal = (product: Product) => {
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
    if (!editingProduct) return;
    setFormError('');
    try {
      const res = await apiClient.put(`/products/${editingProduct.id}`, {
        ...editFormData,
        unitPrice: Number(editFormData.unitPrice),
        minStockAlert: Number(editFormData.minStockAlert),
      });

      if (res.data.success) {
        setEditingProduct(null);
        clientCache.invalidate('/products');
        clientCache.invalidate('/inventory');
        fetchProducts();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to update product');
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

  return {
    products,
    loading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    stockModalProduct,
    setStockModalProduct,
    editingProduct,
    setEditingProduct,
    formData,
    setFormData,
    editFormData,
    setEditFormData,
    stockAdjustData,
    setStockAdjustData,
    formError,
    canManageStock,
    handleCreateProduct,
    openEditModal,
    handleUpdateProduct,
    handleAdjustStock,
  };
}
