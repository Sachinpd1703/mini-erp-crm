import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SalesChallan, Customer, Product, ChallanStatus } from '../../../types';
import { apiClient } from '../../../services/api';
import { clientCache, getCachedData } from '../../../services/apiCache';
import { useAuth } from '../../auth/AuthContext';

export function useChallans() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCustomerId = searchParams.get('customerId') || '';

  const [challans, setChallans] = useState<SalesChallan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId);
  const [wizardItems, setWizardItems] = useState<{ productId: string; quantity: number }[]>([]);
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
      console.error('Failed to fetch sales challans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, [statusFilter]);

  // Open wizard directly if URL contains customerId parameter
  useEffect(() => {
    if (initialCustomerId) {
      openWizard();
    }
  }, [initialCustomerId]);

  const openWizard = async () => {
    setIsWizardOpen(true);
    setFormError('');
    if (wizardItems.length === 0) {
      setWizardItems([{ productId: '', quantity: 1 }]);
    }
    try {
      const [custRes, prodRes] = await Promise.all([
        apiClient.get('/customers?limit=100'),
        apiClient.get('/products?limit=100'),
      ]);
      if (custRes.data.success) setCustomers(custRes.data.data);
      if (prodRes.data.success) setProducts(prodRes.data.data);
    } catch (err) {
      console.error('Failed to load customers or products for wizard:', err);
    }
  };

  const handleAddLineItem = () => {
    setWizardItems([...wizardItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveLineItem = (index: number) => {
    setWizardItems(wizardItems.filter((_, i) => i !== index));
  };

  const handleUpdateLineItem = (index: number, field: 'productId' | 'quantity', value: any) => {
    const updated = [...wizardItems];
    updated[index] = { ...updated[index], [field]: value };
    setWizardItems(updated);
  };

  const calculateGrandTotal = () => {
    const prodMap = new Map(products.map((p) => [p.id, p]));
    return wizardItems.reduce((sum, item) => {
      const prod = prodMap.get(item.productId);
      return sum + (prod ? Number(prod.unitPrice) * item.quantity : 0);
    }, 0);
  };

  const handleCreateOrder = async (targetStatus: ChallanStatus) => {
    if (!selectedCustomerId) {
      setFormError('Please select a customer.');
      return;
    }

    const validItems = wizardItems.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0) {
      setFormError('Please add at least one line item product.');
      return;
    }

    setFormError('');
    setFormSubmitting(true);
    try {
      const res = await apiClient.post('/challans', {
        customerId: selectedCustomerId,
        items: validItems,
        requestedStatus: targetStatus,
      });

      if (res.data.success) {
        setIsWizardOpen(false);
        setWizardItems([{ productId: '', quantity: 1 }]);
        setSelectedCustomerId('');
        clientCache.invalidate('/challans');
        clientCache.invalidate('/products');
        clientCache.invalidate('/customers');
        clientCache.invalidate('/inventory');
        fetchChallans();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to create sales order');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateStatus = async (challanId: string, targetStatus: 'CONFIRMED' | 'CANCELLED') => {
    try {
      const res = await apiClient.patch(`/challans/${challanId}/status`, {
        status: targetStatus,
      });
      if (res.data.success) {
        clientCache.invalidate('/challans');
        clientCache.invalidate('/products');
        clientCache.invalidate('/customers');
        clientCache.invalidate('/inventory');
        fetchChallans();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || `Failed to set status to ${targetStatus}`);
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

  const filteredChallans = challans.filter((c) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const cNum = c.challanNumber?.toLowerCase() || '';
    const bName = c.customer?.businessName?.toLowerCase() || '';
    const cName = c.customer?.name?.toLowerCase() || '';
    return cNum.includes(term) || bName.includes(term) || cName.includes(term);
  });

  const canManage = user?.role === 'ADMIN' || user?.role === 'SALES';

  return {
    challans: filteredChallans,
    rawChallans: challans,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isWizardOpen,
    setIsWizardOpen,
    customers,
    products,
    selectedCustomerId,
    setSelectedCustomerId,
    wizardItems,
    formError,
    formSubmitting,
    canManage,
    openWizard,
    handleAddLineItem,
    handleRemoveLineItem,
    handleUpdateLineItem,
    calculateGrandTotal,
    handleCreateOrder,
    handleUpdateStatus,
    handleDownloadPdf,
  };
}
