import React, { useState, useEffect } from 'react';
import { Customer, CustomerStatus, CustomerType } from '../../types';
import { apiClient } from '../../services/api';
import { clientCache, getCachedData } from '../../services/apiCache';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Search, Plus, UserPlus, Phone, Mail, Building, Calendar, MessageSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const CustomersPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newNote, setNewNote] = useState('');

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

  const [formError, setFormError] = useState('');

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
        // Refresh detail view
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

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Customer CRM</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Manage client profiles, lead conversion status, and follow-up logs</p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-medium text-xs rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Customer</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B5542] dark:text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-[#002A1C] dark:text-white placeholder-[#6B5542]/70 dark:placeholder-slate-500 focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500 font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
        >
          <option value="">All Statuses</option>
          <option value="LEAD">LEAD</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#002A1C] dark:text-slate-300 font-medium focus:outline-none focus:border-[#004D34] dark:focus:border-sky-500"
        >
          <option value="">All Customer Types</option>
          <option value="RETAIL">RETAIL</option>
          <option value="WHOLESALE">WHOLESALE</option>
          <option value="DISTRIBUTOR">DISTRIBUTOR</option>
        </select>
      </div>

      {/* Customer Data Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Business / Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Next Follow-Up</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                      No matching customer records found.
                    </td>
                  </tr>
                ) : (
                  customers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#002A1C] dark:text-white">{cust.businessName}</p>
                        <p className="text-[11px] text-[#6B5542] dark:text-slate-400 font-medium">{cust.name}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[#002A1C] dark:text-slate-300">
                        <div className="flex items-center space-x-1.5 text-[11px] font-medium">
                          <Mail className="w-3 h-3 text-[#6B5542] dark:text-slate-500" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[11px] text-[#6B5542] dark:text-slate-400">
                          <Phone className="w-3 h-3 text-[#6B5542] dark:text-slate-500" />
                          <span>{cust.mobile}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono font-bold uppercase bg-[#FFFBF7] dark:bg-slate-800 px-2 py-1 rounded border border-[#F3CEA6] dark:border-slate-700 text-[#002A1C] dark:text-slate-300">
                          {cust.customerType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          label={cust.status}
                          variant={
                            cust.status === 'ACTIVE'
                              ? 'success'
                              : cust.status === 'LEAD'
                              ? 'warning'
                              : 'neutral'
                          }
                        />
                      </td>
                      <td className="py-3.5 px-4 text-[#6B5542] dark:text-slate-400 text-[11px] font-medium">
                        {cust.followUpDate
                          ? new Date(cust.followUpDate).toLocaleDateString()
                          : 'Not scheduled'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openCustomerDetail(cust.id)}
                          className="px-3 py-1.5 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#004D34] dark:text-sky-400 font-bold border border-[#F3CEA6] dark:border-slate-700 rounded-lg transition inline-flex items-center space-x-1 text-xs"
                        >
                          <span>View Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={`Customer Profile: ${selectedCustomer?.businessName || ''}`}
        maxWidth="xl"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Overview Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400">Contact Person:</span>
                <p className="font-semibold text-white">{selectedCustomer.name}</p>
              </div>
              <div>
                <span className="text-slate-400">GSTIN:</span>
                <p className="font-mono text-slate-200">{selectedCustomer.gstNumber || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400">Email:</span>
                <p className="text-slate-200">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-slate-400">Mobile:</span>
                <p className="text-slate-200">{selectedCustomer.mobile}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Address:</span>
                <p className="text-slate-200">{selectedCustomer.address}</p>
              </div>
            </div>

            {/* Log Follow-up Note Form */}
            {canEdit && (
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>Append Interaction / Follow-up Note</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter interaction note, call log, or agreed terms..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-xl transition"
                  >
                    Log Note
                  </button>
                </div>
              </form>
            )}

            {/* Note Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Interaction Timeline ({selectedCustomer.notes?.length || 0})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedCustomer.notes?.length === 0 ? (
                  <p className="text-xs text-slate-500">No interaction notes recorded yet.</p>
                ) : (
                  selectedCustomer.notes?.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-xs space-y-1"
                    >
                      <p className="text-slate-200">{n.note}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Logged by: {n.author?.fullName || 'Sales Rep'}</span>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Customer"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Business / Trade Name *</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Apex Wholesale Ltd"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Contact Person Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rajesh Kumar"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Work Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@company.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Mobile Number *</label>
              <input
                type="text"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Customer Type</label>
              <select
                value={formData.customerType}
                onChange={(e) =>
                  setFormData({ ...formData, customerType: e.target.value as CustomerType })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="RETAIL">RETAIL</option>
                <option value="WHOLESALE">WHOLESALE</option>
                <option value="DISTRIBUTOR">DISTRIBUTOR</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">GST Number (Optional)</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                placeholder="27AAAAA0000A1Z5"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-slate-300 font-medium">Full Address *</label>
              <textarea
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Plot 45, MIDC Industrial Area..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Lead Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as CustomerStatus })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="LEAD">LEAD</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Follow-Up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
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
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
