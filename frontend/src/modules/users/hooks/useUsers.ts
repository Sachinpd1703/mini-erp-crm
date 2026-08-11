import { useState, useEffect } from 'react';
import { User, Role } from '../../../types';
import { apiClient } from '../../../services/api';
import { clientCache, getCachedData } from '../../../services/apiCache';
import { useAuth } from '../../auth/AuthContext';

export function useUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingRoleUser, setEditingRoleUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role>('SALES');

  // New User Form State
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'SALES' as Role,
  });

  const [formError, setFormError] = useState('');

  const fetchUsers = async () => {
    const params: any = {};
    if (roleFilter) params.role = roleFilter;

    const cached = clientCache.get<any>('/users', params);
    if (cached) {
      setUsers(cached.data || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCachedData('/users', params);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await apiClient.post('/users', newUserData);
      if (res.data.success) {
        setIsAddUserModalOpen(false);
        setNewUserData({ fullName: '', email: '', password: '', role: 'SALES' });
        clientCache.invalidate('/users');
        fetchUsers();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to create user');
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoleUser) return;
    setFormError('');
    try {
      const res = await apiClient.patch(`/users/${editingRoleUser.id}/role`, {
        role: newRole,
      });
      if (res.data.success) {
        setEditingRoleUser(null);
        clientCache.invalidate('/users');
        fetchUsers();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userToDelete: User) => {
    if (window.confirm(`Are you sure you want to remove ${userToDelete.fullName}'s account?`)) {
      try {
        const res = await apiClient.delete(`/users/${userToDelete.id}`);
        if (res.data.success) {
          clientCache.invalidate('/users');
          fetchUsers();
        }
      } catch (err: any) {
        alert(err.response?.data?.error?.message || 'Failed to delete user account');
      }
    }
  };

  const openRoleModal = (u: User) => {
    setEditingRoleUser(u);
    setNewRole(u.role);
    setFormError('');
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const name = u.fullName?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    const role = u.role?.toLowerCase() || '';
    return name.includes(term) || email.includes(term) || role.includes(term);
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  return {
    users: filteredUsers,
    rawUsers: users,
    loading,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    editingRoleUser,
    setEditingRoleUser,
    newRole,
    setNewRole,
    newUserData,
    setNewUserData,
    formError,
    isAdmin,
    currentUser,
    handleCreateUser,
    handleUpdateRole,
    handleDeleteUser,
    openRoleModal,
  };
}
