import { useState, useEffect } from 'react';
import { Customer, CustomerStatus, CustomerType } from '../../../types';
import { apiClient } from '../../../services/api';
import { clientCache, getCachedData } from '../../../services/apiCache';
import { useAuth } from '../../auth/AuthContext';

export function useCustomers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal & Drawer States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newNote, setNewNote] = useState('');
  const [formError, setFormError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    businessName: '',
    gstNumber: '',
    customerType: 'RETAIL' as CustomerType,
    address: '',
    status: 'LEAD' as CustomerStatus,
    followUpDate: '',
  });

  const fetchCustomers = async () => {
    const params: any = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (typeFilter) params.type = typeFilter;

    const cached = clientCache.get<any>('/customers', params);
    if (cached) {
      setCustomers(cached.data || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData('/customers', params);
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, statusFilter, typeFilter]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await apiClient.post('/customers', formData);
      if (res.data.success) {
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          mobile: '',
          email: '',
          businessName: '',
          gstNumber: '',
          customerType: 'RETAIL',
          address: '',
          status: 'LEAD',
          followUpDate: '',
        });
        clientCache.invalidate('/customers');
        fetchCustomers();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to create customer');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNote.trim()) return;

    try {
      const res = await apiClient.post(`/customers/${selectedCustomer.id}/notes`, {
        note: newNote,
      });

      if (res.data.success) {
        setNewNote('');
        const updatedDetail = await apiClient.get(`/customers/${selectedCustomer.id}`);
        if (updatedDetail.data.success) {
          setSelectedCustomer(updatedDetail.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const openCustomerDetail = async (id: string) => {
    try {
      const res = await apiClient.get(`/customers/${id}`);
      if (res.data.success) {
        setSelectedCustomer(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load customer detail:', err);
    }
  };

  const canEdit = user?.role === 'ADMIN' || user?.role === 'SALES';

  return {
    customers,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedCustomer,
    setSelectedCustomer,
    newNote,
    setNewNote,
    formData,
    setFormData,
    formError,
    canEdit,
    handleCreateCustomer,
    handleAddNote,
    openCustomerDetail,
  };
}
