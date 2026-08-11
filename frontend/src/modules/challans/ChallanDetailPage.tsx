import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SalesChallan } from '../../types';
import { apiClient } from '../../services/api';
import { clientCache, getCachedData } from '../../services/apiCache';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../auth/AuthContext';
import {
  ArrowLeft,
  Receipt,
  Building,
  Mail,
  Phone,
  MapPin,
  Download,
  CheckCircle,
  XCircle,
  DollarSign,
  Package,
  User,
  ShoppingBag,
} from 'lucide-react';

export const ChallanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [challan, setChallan] = useState<SalesChallan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChallanDetail = async () => {
    if (!id) return;
    const cacheKey = `/challans/${id}`;

    const cached = clientCache.get<any>(cacheKey);
    if (cached) {
      setChallan(cached.data || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData(cacheKey);
      if (res.data.success) {
        setChallan(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load sales challan detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallanDetail();
  }, [id]);

  const handleUpdateStatus = async (targetStatus: 'CONFIRMED' | 'CANCELLED') => {
    if (!challan) return;
    try {
      const res = await apiClient.patch(`/challans/${challan.id}/status`, {
        status: targetStatus,
      });
      if (res.data.success) {
        clientCache.invalidate(`/challans/${challan.id}`);
        clientCache.invalidate('/challans');
        clientCache.invalidate('/products');
        clientCache.invalidate('/customers');
        clientCache.invalidate('/inventory');
        fetchChallanDetail();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || `Failed to set status to ${targetStatus}`);
    }
  };

  const handleDownloadPdf = async () => {
    if (!challan) return;
    try {
      const response = await apiClient.get(`/challans/${challan.id}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${challan.challanNumber || challan.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const token = localStorage.getItem('mini_erp_token');
      window.open(`http://localhost:5000/api/v1/challans/${challan.id}/pdf?token=${token}`, '_blank');
    }
  };

  const canManage = user?.role === 'ADMIN' || user?.role === 'SALES';

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

  if (!challan) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-base text-[#6B5542] dark:text-slate-400 font-medium">Sales Order details not found.</p>
        <Link
          to="/challans"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#004D34] text-white rounded-xl text-xs font-bold shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Back to Sales Orders</span>
        </Link>
      </div>
    );
  }

  const isDraft = challan.status === 'DRAFT';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/challans')}
            className="p-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-300 rounded-xl border border-[#F3CEA6] dark:border-slate-700 transition shadow-sm"
            title="Back to Sales Orders"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight font-mono">
                {challan.challanNumber}
              </h2>
              <Badge
                label={challan.status}
                variant={
                  challan.status === 'CONFIRMED'
                    ? 'success'
                    : challan.status === 'DRAFT'
                    ? 'warning'
                    : 'danger'
                }
              />
            </div>
            <p className="text-xs text-[#6B5542] dark:text-slate-400">
              Billed To: <span className="font-semibold text-[#002A1C] dark:text-slate-200">{challan.customer?.businessName}</span> • Date: <span className="font-mono">{new Date(challan.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadPdf}
            className="px-3.5 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm"
          >
            <Download size={14} className="text-[#004D34] dark:text-sky-400" />
            <span>Download PDF Invoice</span>
          </button>

          {canManage && isDraft && (
            <>
              <button
                onClick={() => handleUpdateStatus('CONFIRMED')}
                className="px-4 py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
              >
                <CheckCircle size={14} />
                <span>Confirm & Deduct Stock</span>
              </button>

              <button
                onClick={() => handleUpdateStatus('CANCELLED')}
                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
              >
                <XCircle size={14} />
                <span>Cancel Order</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* TOP SECTION: Billed Customer Profile Card */}
      <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
            <span>Billed Customer Profile & Delivery Details</span>
          </h3>
          <span className="text-xs font-mono font-bold text-[#004D34] dark:text-sky-400">
            GSTIN: {challan.customer?.gstNumber || 'N/A'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Business / Trade Name</span>
            </span>
            <p className="font-bold text-[#002A1C] dark:text-white text-sm">{challan.customer?.businessName}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Contact Person</span>
            </span>
            <p className="font-bold text-[#002A1C] dark:text-slate-200">{challan.customer?.name}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Email & Phone</span>
            </span>
            <p className="font-bold text-[#002A1C] dark:text-slate-200">{challan.customer?.email}</p>
            <p className="text-[#6B5542] dark:text-slate-400 font-medium">{challan.customer?.mobile}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Billing Address</span>
            </span>
            <p className="font-medium text-[#002A1C] dark:text-slate-200 line-clamp-2">{challan.customer?.address}</p>
          </div>
        </div>
      </div>

      {/* SECOND SECTION: Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Grand Total Order Value</span>
            <DollarSign className="w-4 h-4 text-[#004D34] dark:text-emerald-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            INR {Number(challan.totalAmount || 0).toFixed(2)}
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Inclusive of all line items</p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Total Items & Units</span>
            <Package className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            {challan.items?.length || 0} Items ({challan.totalQuantity || 0} Pcs)
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Total physical products ordered</p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Sales Order Status</span>
            <Receipt className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
          </div>
          <div className="pt-1">
            <Badge
              label={challan.status}
              variant={
                challan.status === 'CONFIRMED'
                  ? 'success'
                  : challan.status === 'DRAFT'
                  ? 'warning'
                  : 'danger'
              }
            />
          </div>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium pt-0.5">
            {challan.status === 'CONFIRMED' ? 'Stock deducted & invoice issued' : 'Draft pending confirmation'}
          </p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Sales Representative</span>
            <User className="w-4 h-4 text-[#004D34] dark:text-indigo-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white truncate">
            {challan.author?.fullName || 'Sales Staff'}
          </p>
          <p className="text-[11px] text-[#004D34] dark:text-sky-400 uppercase font-bold">
            Role: {challan.author?.role || 'SALES'}
          </p>
        </div>
      </div>

      {/* Main Itemized Line Items Table */}
      <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
            <span>Itemized Order Line Items</span>
          </h3>
          <span className="text-xs text-[#6B5542] dark:text-slate-400 font-medium">
            {challan.items?.length || 0} Distinct Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Product Description / SKU</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-center">Ordered Qty</th>
                <th className="py-2.5 px-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
              {challan.items?.map((item, idx) => (
                <tr key={item.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3 text-[#6B5542] dark:text-slate-400 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-[#002A1C] dark:text-white">{item.snapshotProductName}</p>
                    <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-mono">SKU: {item.snapshotSku}</p>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-[#002A1C] dark:text-slate-300">
                    INR {Number(item.snapshotUnitPrice).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#004D34] dark:text-sky-400">
                    {item.quantity} Units
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-[#002A1C] dark:text-white text-sm">
                    INR {Number(item.lineTotal).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-[#F3CEA6] dark:border-slate-700 bg-[#FDD8A8]/60 dark:bg-slate-800/40 font-bold">
              <tr>
                <td colSpan={3} className="py-3 px-3 text-[#002A1C] dark:text-white text-right text-xs uppercase tracking-wider">
                  Grand Total Order Value:
                </td>
                <td className="py-3 px-3 text-center text-[#004D34] dark:text-sky-400">
                  {challan.totalQuantity} Pcs
                </td>
                <td className="py-3 px-3 text-right text-base text-[#002A1C] dark:text-white font-extrabold">
                  INR {Number(challan.totalAmount || 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
