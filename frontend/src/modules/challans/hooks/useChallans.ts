import { useState, useEffect } from 'react';
import { SalesChallan, Customer, Product, ChallanStatus } from '../../../types';
import { apiClient } from '../../../services/api';
import { clientCache, getCachedData } from '../../../services/apiCache';
import { useAuth } from '../../auth/AuthContext';

export function useChallans() {
  const { user } = useAuth();
  const [challans, setChallans] = useState<SalesChallan[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Creation Wizard Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Selected Order Form Data
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: '', quantity: 1 },
  ]);
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchChallans = async () => {
    const params: any = {};
    if (statusFilter) params.status = statusFilter;

    const cached = clientCache.get<any>('/challans', params);
    if (cached) {
      setChallans(cached.data || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData('/challans', params);
      if (res.data.success) {
        setChallans(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch challans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, [statusFilter]);

  const openCreateWizard = async () => {
    setIsCreateModalOpen(true);
    setFormError('');
    try {
      const [custRes, prodRes] = await Promise.all([
        apiClient.get('/customers?limit=100'),
        apiClient.get('/products?limit=100'),
      ]);
      if (custRes.data.success) setCustomersList(custRes.data.data);
      if (prodRes.data.success) setProductsList(prodRes.data.data);
    } catch (err) {
      console.error('Failed to load customers/products for wizard:', err);
    }
  };

  const addLineItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  const removeLineItem = (index: number) => {
    if (orderItems.length === 1) return;
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: 'productId' | 'quantity', value: any) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  };

  const calculateGrandTotal = () => {
    let total = 0;
    const prodMap = new Map(productsList.map((p) => [p.id, p]));
    orderItems.forEach((item) => {
      const p = prodMap.get(item.productId);
      if (p) {
        total += Number(p.unitPrice) * item.quantity;
      }
    });
    return total;
  };

  const handleCreateOrder = async (requestedStatus: ChallanStatus) => {
    if (!selectedCustomerId) {
      setFormError('Please select a customer');
      return;
    }

    if (orderItems.some((i) => !i.productId || i.quantity < 1)) {
      setFormError('Please select valid products and quantities for all lines');
      return;
    }

    setFormError('');
    setFormSubmitting(true);

    try {
      const res = await apiClient.post('/challans', {
        customerId: selectedCustomerId,
        items: orderItems,
        status: requestedStatus,
      });

      if (res.data.success) {
        setIsCreateModalOpen(false);
        setSelectedCustomerId('');
        setOrderItems([{ productId: '', quantity: 1 }]);
        clientCache.invalidate('/challans');
        clientCache.invalidate('/products');
        clientCache.invalidate('/inventory');
        fetchChallans();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to create sales challan');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleStatusChange = async (challanId: string, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    try {
      const res = await apiClient.patch(`/challans/${challanId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        clientCache.invalidate('/challans');
        clientCache.invalidate('/products');
        clientCache.invalidate('/inventory');
        fetchChallans();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Status transition failed');
    }
  };

  const handleDownloadPdf = async (challanId: string, challanNumber?: string) => {
    try {
      const response = await apiClient.get(`/challans/${challanId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${challanNumber || challanId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const token = localStorage.getItem('mini_erp_token');
      window.open(`http://localhost:5000/api/v1/challans/${challanId}/pdf?token=${token}`, '_blank');
    }
  };

  const canCreate = user?.role === 'ADMIN' || user?.role === 'SALES';

  return {
    challans,
    loading,
    statusFilter,
    setStatusFilter,
    isCreateModalOpen,
    setIsCreateModalOpen,
    customersList,
    productsList,
    selectedCustomerId,
    setSelectedCustomerId,
    orderItems,
    formError,
    formSubmitting,
    canCreate,
    openCreateWizard,
    addLineItem,
    removeLineItem,
    updateLineItem,
    calculateGrandTotal,
    handleCreateOrder,
    handleStatusChange,
    handleDownloadPdf,
  };
}
