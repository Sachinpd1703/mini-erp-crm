import { useState, useEffect } from 'react';
import { StockMovement, Product, MovementType } from '../../../types';
import { apiClient } from '../../../services/api';
import { clientCache, getCachedData } from '../../../services/apiCache';
import { useAuth } from '../../auth/AuthContext';

export function useInventory() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Adjust Stock Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [adjustFormData, setAdjustFormData] = useState({
    quantity: 1,
    movementType: 'IN' as MovementType,
    reason: '',
  });
  const [formError, setFormError] = useState('');

  const fetchMovements = async () => {
    const params: any = {};
    if (typeFilter) params.type = typeFilter;

    const cached = clientCache.get<any>('/inventory/movements', params);
    if (cached) {
      setMovements(cached.data || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData('/inventory/movements', params);
      if (res.data.success) {
        setMovements(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory movements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [typeFilter]);

  const openAdjustModal = async () => {
    setIsAdjustModalOpen(true);
    setFormError('');
    try {
      const res = await apiClient.get('/products?limit=100');
      if (res.data.success) {
        setProductsList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products for stock adjustment:', err);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setFormError('Please select a product');
      return;
    }

    setFormError('');
    try {
      const res = await apiClient.post(`/products/${selectedProductId}/stock`, {
        quantity: Number(adjustFormData.quantity),
        movementType: adjustFormData.movementType,
        reason: adjustFormData.reason,
      });

      if (res.data.success) {
        setIsAdjustModalOpen(false);
        setSelectedProductId('');
        setAdjustFormData({ quantity: 1, movementType: 'IN', reason: '' });
        clientCache.invalidate('/inventory');
        clientCache.invalidate('/products');
        fetchMovements();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to record stock movement');
    }
  };

  // Filter movements by search term
  const filteredMovements = movements.filter((m) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const prodName = m.product?.name?.toLowerCase() || '';
    const sku = m.product?.sku?.toLowerCase() || '';
    const reason = m.reason?.toLowerCase() || '';
    const author = m.author?.fullName?.toLowerCase() || '';
    return prodName.includes(term) || sku.includes(term) || reason.includes(term) || author.includes(term);
  });

  const canManageStock = user?.role === 'ADMIN' || user?.role === 'WAREHOUSE';

  return {
    movements: filteredMovements,
    rawMovements: movements,
    loading,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    isAdjustModalOpen,
    setIsAdjustModalOpen,
    productsList,
    selectedProductId,
    setSelectedProductId,
    adjustFormData,
    setAdjustFormData,
    formError,
    canManageStock,
    openAdjustModal,
    handleAdjustStock,
  };
}
