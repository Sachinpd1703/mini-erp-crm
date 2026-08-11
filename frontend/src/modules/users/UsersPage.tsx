import React from 'react';
import { UserPlus } from 'lucide-react';
import { useUsers } from './hooks/useUsers';
import { UserMetricsCards } from './components/UserMetricsCards';
import { UserFilterBar } from './components/UserFilterBar';
import { UserTable } from './components/UserTable';
import { AddUserModal } from './components/AddUserModal';
import { EditRoleModal } from './components/EditRoleModal';

export const UsersPage: React.FC = () => {
  const {
    users,
    rawUsers,
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
  } = useUsers();

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002A1C] dark:text-white tracking-tight">Team & Staff Account Management</h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400">Manage ERP staff accounts, access control roles, and team permissions</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2.5 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff Account</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <UserMetricsCards users={rawUsers} loading={loading} />

      {/* Filter & Search Bar */}
      <UserFilterBar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* User Accounts Table */}
      <UserTable
        users={users}
        loading={loading}
        currentUserId={currentUser?.id}
        isAdmin={isAdmin}
        onOpenRoleModal={openRoleModal}
        onDeleteUser={handleDeleteUser}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleCreateUser}
        newUserData={newUserData}
        setNewUserData={setNewUserData}
        formError={formError}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        user={editingRoleUser}
        onClose={() => setEditingRoleUser(null)}
        onSubmit={handleUpdateRole}
        newRole={newRole}
        setNewRole={setNewRole}
        formError={formError}
      />
    </div>
  );
};
