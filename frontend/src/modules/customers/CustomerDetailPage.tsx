import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Customer, SalesChallan } from '../../types';
import { apiClient } from '../../services/api';
import { clientCache, getCachedData } from '../../services/apiCache';
import { exportCustomerStatementToExcel } from '../../utils/exportExcel';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { EditCustomerModal } from './components/EditCustomerModal';
import { useAuth } from '../auth/AuthContext';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  DollarSign,
  Edit3,
  Download,
  MessageSquare,
  ShoppingBag,
  CreditCard,
  Receipt,
  UserCheck,
  MapPin,
} from 'lucide-react';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Edit Modal State
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    businessName: '',
    gstNumber: '',
    customerType: 'RETAIL' as any,
    address: '',
    status: 'LEAD' as any,
    followUpDate: '',
  });
  const [editError, setEditError] = useState('');

  const fetchCustomerDetail = async () => {
    if (!id) return;
    const cacheKey = `/customers/${id}`;

    const cached = clientCache.get<any>(cacheKey);
    if (cached) {
      setCustomer(cached.data || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData(cacheKey);
      if (res.data.success) {
        setCustomer(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load customer detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetail();
  }, [id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const res = await apiClient.post(`/customers/${customer.id}/notes`, {
        note: newNote,
      });
      if (res.data.success) {
        setNewNote('');
        clientCache.invalidate(`/customers/${customer.id}`);
        clientCache.invalidate('/customers');
        fetchCustomerDetail();
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const openEditModal = () => {
    if (!customer) return;
    setEditingCustomer(customer);
    setEditError('');
    setEditFormData({
      name: customer.name || '',
      mobile: customer.mobile || '',
      email: customer.email || '',
      businessName: customer.businessName || '',
      gstNumber: customer.gstNumber || '',
      customerType: customer.customerType || 'RETAIL',
      address: customer.address || '',
      status: customer.status || 'LEAD',
      followUpDate: customer.followUpDate
        ? new Date(customer.followUpDate).toISOString().split('T')[0]
        : '',
    });
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setEditError('');
    try {
      const res = await apiClient.put(`/customers/${customer.id}`, editFormData);
      if (res.data.success) {
        setEditingCustomer(null);
        clientCache.invalidate(`/customers/${customer.id}`);
        clientCache.invalidate('/customers');
        fetchCustomerDetail();
      }
    } catch (err: any) {
      setEditError(err.response?.data?.error?.message || 'Failed to update customer');
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

  const canEdit = user?.role === 'ADMIN' || user?.role === 'SALES';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#FFE4C4] dark:bg-slate-800 animate-pulse" />
          <div className="w-48 h-6 rounded bg-[#FFE4C4] dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="w-full h-32 rounded-2xl bg-[#FFE4C4] dark:bg-slate-800 animate-pulse" />
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

  if (!customer) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-base text-[#6B5542] dark:text-slate-400 font-medium">Customer profile not found.</p>
        <Link
          to="/customers"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#004D34] text-white rounded-xl text-xs font-bold shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Back to Customers</span>
        </Link>
      </div>
    );
  }

  // Calculate Ledger & Financial Aggregates
  const salesChallans: SalesChallan[] = customer.salesChallans || [];
  const confirmedChallans = salesChallans.filter((c) => c.status === 'CONFIRMED');
  const totalBilled = confirmedChallans.reduce((sum, c) => sum + Number(c.totalAmount || 0), 0);
  const totalOrdersCount = salesChallans.length;
  const draftOrdersCount = salesChallans.filter((c) => c.status === 'DRAFT').length;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-300 rounded-xl border border-[#F3CEA6] dark:border-slate-700 transition shadow-sm"
            title="Back to Customers List"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">
                {customer.businessName}
              </h2>
              <Badge
                label={customer.status}
                variant={
                  customer.status === 'ACTIVE'
                    ? 'success'
                    : customer.status === 'LEAD'
                    ? 'warning'
                    : 'neutral'
                }
              />
              <span className="text-[10px] font-mono font-bold uppercase bg-[#FFE4C4] dark:bg-slate-800 px-2 py-0.5 rounded border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300">
                {customer.customerType}
              </span>
            </div>
            <p className="text-xs text-[#6B5542] dark:text-slate-400">
              Contact: <span className="font-semibold text-[#002A1C] dark:text-slate-200">{customer.name}</span> • ID: <span className="font-mono text-[11px]">{customer.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => exportCustomerStatementToExcel(customer)}
            className="px-3.5 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm"
            title="Export full financial ledger statement to Excel"
          >
            <Download size={14} className="text-[#004D34] dark:text-sky-400" />
            <span>Export Statement (.xlsx)</span>
          </button>

          {canEdit && (
            <>
              <button
                onClick={openEditModal}
                className="px-3.5 py-2 bg-[#FFE4C4] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <Edit3 size={14} className="text-amber-700 dark:text-amber-400" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => navigate(`/challans?customerId=${customer.id}`)}
                className="px-4 py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md"
              >
                <ShoppingBag size={14} />
                <span>Create Sales Order</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* TOP SECTION: Business Contact Profile Card */}
      <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
            <span>Business Contact Profile & Master Details</span>
          </h3>
          <span className="text-xs font-mono font-bold text-[#004D34] dark:text-sky-400">
            GSTIN: {customer.gstNumber || 'N/A'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Business / Trade Name</span>
            </span>
            <p className="font-bold text-[#002A1C] dark:text-white text-sm">{customer.businessName}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Contact Person</span>
            </span>
            <p className="font-bold text-[#002A1C] dark:text-slate-200">{customer.name}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Email & Phone</span>
            </span>
            <p className="font-bold text-[#002A1C] dark:text-slate-200">{customer.email}</p>
            <p className="text-[#6B5542] dark:text-slate-400 font-medium">{customer.mobile}</p>
          </div>

          <div className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 rounded-xl border border-[#F3CEA6]/80 dark:border-slate-700 space-y-1">
            <span className="text-[#6B5542] dark:text-slate-400 font-medium flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Address & Follow-up</span>
            </span>
            <p className="font-medium text-[#002A1C] dark:text-slate-200 line-clamp-1">{customer.address}</p>
            <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">
              Next: {customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : 'Not scheduled'}
            </p>
          </div>
        </div>
      </div>

      {/* SECOND SECTION: Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Total Invoiced Billed</span>
            <DollarSign className="w-4 h-4 text-[#004D34] dark:text-emerald-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            INR {totalBilled.toFixed(2)}
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">
            From {confirmedChallans.length} Confirmed Challans
          </p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Total Sales Orders</span>
            <Receipt className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            {totalOrdersCount} Orders
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Lifetime order count</p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Draft Orders</span>
            <FileText className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          </div>
          <p className="text-lg font-extrabold text-[#002A1C] dark:text-white">
            {draftOrdersCount} Pending
          </p>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">Draft challans awaiting confirmation</p>
        </div>

        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#6B5542] dark:text-slate-400">
            <span className="text-xs font-bold">Account Status</span>
            <UserCheck className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
          </div>
          <div className="pt-1">
            <Badge
              label={customer.status}
              variant={
                customer.status === 'ACTIVE'
                  ? 'success'
                  : customer.status === 'LEAD'
                  ? 'warning'
                  : 'neutral'
              }
            />
          </div>
          <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium pt-0.5">
            Follow-up: {customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : 'Not scheduled'}
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Financial Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
                <span>Customer Financial Ledger & Statements</span>
              </h3>
              <span className="text-xs text-[#6B5542] dark:text-slate-400 font-medium">
                {confirmedChallans.length} Invoiced Entries
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Transaction Description / Challan #</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Debit (Billed)</th>
                    <th className="py-2.5 px-3 text-right">Invoice PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
                  {salesChallans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                        No financial ledger transactions recorded for this client.
                      </td>
                    </tr>
                  ) : (
                    salesChallans.map((ch) => (
                      <tr key={ch.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                        <td className="py-3 px-3 text-[#6B5542] dark:text-slate-400 font-mono text-[11px]">
                          {new Date(ch.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-[#004D34] dark:text-sky-400 font-mono">{ch.challanNumber}</p>
                          <p className="text-[10px] text-[#6B5542] dark:text-slate-500">Sales Order Invoice</p>
                        </td>
                        <td className="py-3 px-3 text-center">
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
                        <td className="py-3 px-3 text-right font-bold text-[#002A1C] dark:text-white">
                          INR {Number(ch.totalAmount).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDownloadPdf(ch.id, ch.challanNumber)}
                            className="px-2.5 py-1 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#004D34] dark:text-sky-400 font-bold border border-[#F3CEA6] dark:border-slate-700 rounded-lg transition text-[11px] inline-flex items-center space-x-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Column: CRM Notes Timeline */}
        <div className="space-y-6">
          <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#002A1C] dark:text-white flex items-center space-x-2 border-b border-[#F3CEA6] dark:border-slate-800 pb-3">
              <MessageSquare className="w-4 h-4 text-[#004D34] dark:text-sky-400" />
              <span>CRM Interaction Timeline ({customer.notes?.length || 0})</span>
            </h3>

            {canEdit && (
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  required
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter call log, meeting agreement, or follow-up note..."
                  className="w-full bg-[#FFFBF7] dark:bg-slate-800 border border-[#F3CEA6] dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-white placeholder-[#6B5542]/60 dark:placeholder-slate-500 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="w-full py-2 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-md"
                >
                  {isSubmittingNote ? 'Logging Note...' : 'Log Interaction Note'}
                </button>
              </form>
            )}

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {customer.notes?.length === 0 ? (
                <p className="text-xs text-[#6B5542] dark:text-slate-500 font-medium">No interaction notes recorded yet.</p>
              ) : (
                customer.notes?.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-[#FFFBF7] dark:bg-slate-800/60 border border-[#F3CEA6] dark:border-slate-700/50 rounded-xl text-xs space-y-1"
                  >
                    <p className="text-[#002A1C] dark:text-slate-200 font-medium">{n.note}</p>
                    <div className="flex items-center justify-between text-[10px] text-[#6B5542] dark:text-slate-500 font-medium">
                      <span>Logged by: {n.author?.fullName || 'Sales Rep'}</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Customer Modal */}
      <EditCustomerModal
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSubmit={handleUpdateCustomer}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        formError={editError}
      />
    </div>
  );
};
