import React, { useState, useEffect } from 'react';
import { SalesChallan, Customer, Product, ChallanStatus } from '../../types';
import { apiClient } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FileText, Plus, Download, CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const ChallansPage: React.FC = () => {
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
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;

      const res = await apiClient.get('/challans', { params });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Sales Challans & Order Fulfillment</h2>
          <p className="text-xs text-slate-400">Generate sales orders, trigger atomic stock deductions, and download invoices</p>
        </div>

        {canCreate && (
          <button
            onClick={openCreateWizard}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Sales Challan</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <span className="text-xs text-slate-400">{challans.length} Orders</span>
      </div>

      {/* Challans Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Challan #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">Items / Qty</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading sales challans...
                  </td>
                </tr>
              ) : challans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No sales challans match current criteria.
                  </td>
                </tr>
              ) : (
                challans.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-sky-400">
                      {ch.challanNumber}
                      <p className="text-[10px] text-slate-500">
                        {new Date(ch.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">
                        {ch.customer?.businessName || ch.customer?.name}
                      </p>
                      <p className="text-[11px] text-slate-400">Attn: {ch.customer?.name}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300">
                      <span className="font-semibold text-white">{ch.totalQuantity} Units</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      INR {Number(ch.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        label={ch.status}
                        variant={
                          ch.status === 'CONFIRMED'
                            ? 'success'
                            : ch.status === 'DRAFT'
                            ? 'warning'
                            : 'danger'
                        }
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {ch.status === 'DRAFT' && canCreate && (
                        <>
                          <button
                            onClick={() => handleStatusChange(ch.id, 'CONFIRMED')}
                            title="Confirm & Deduct Stock"
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition text-[11px] font-medium inline-flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Confirm Order</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(ch.id, 'CANCELLED')}
                            title="Cancel Draft"
                            className="px-2 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg transition text-[11px]"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDownloadPdf(ch.id, ch.challanNumber)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg transition text-[11px] font-medium inline-flex items-center space-x-1 border border-slate-700"
                      >
                        <Download className="w-3 h-3" />
                        <span>Invoice PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sales Order Wizard Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Sales Order (Challan Wizard)"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Customer Selector */}
          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-medium">Select Target Customer *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
            >
              <option value="">-- Choose Customer --</option>
              {customersList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName} ({c.name} - {c.customerType})
                </option>
              ))}
            </select>
          </div>

          {/* Line Items Builder */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Order Line Items</label>
              <button
                type="button"
                onClick={addLineItem}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-[11px] font-medium transition"
              >
                + Add Item Row
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {orderItems.map((item, index) => {
                const prodMap = new Map(productsList.map((p) => [p.id, p]));
                const selectedProd = prodMap.get(item.productId);
                const isInsufficient = selectedProd && selectedProd.currentStock < item.quantity;

                return (
                  <div
                    key={index}
                    className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-6">
                      <select
                        value={item.productId}
                        onChange={(e) => updateLineItem(index, 'productId', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      >
                        <option value="">-- Select Product --</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.currentStock}) - INR {Number(p.unitPrice).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(index, 'quantity', parseInt(e.target.value, 10) || 1)
                        }
                        placeholder="Qty"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-right"
                      />
                    </div>

                    <div className="col-span-2 text-right font-semibold text-white">
                      {selectedProd
                        ? `INR ${(Number(selectedProd.unitPrice) * item.quantity).toFixed(2)}`
                        : 'INR 0.00'}
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isInsufficient && (
                      <div className="col-span-12 text-[10px] text-amber-400 flex items-center space-x-1 pt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Warning: Requested qty exceeds available stock ({selectedProd.currentStock})</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grand Total Summary */}
          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Estimated Grand Total:</span>
            <span className="text-base font-bold text-sky-400">
              INR {calculateGrandTotal().toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={formSubmitting}
              onClick={() => handleCreateOrder(ChallanStatus.DRAFT)}
              className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-xs font-medium rounded-xl"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={formSubmitting}
              onClick={() => handleCreateOrder(ChallanStatus.CONFIRMED)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl shadow-lg shadow-emerald-600/20"
            >
              Confirm & Deduct Stock
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
