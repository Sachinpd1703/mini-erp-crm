import React from 'react';
import { User, Role } from '../../../types';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { Trash2, Edit3 } from 'lucide-react';

interface UserTableProps {
  users: User[];
  loading: boolean;
  currentUserId?: string;
  isAdmin: boolean;
  onOpenRoleModal: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  currentUserId,
  isAdmin,
  onOpenRoleModal,
  onDeleteUser,
}) => {
  if (loading) {
    return <TableSkeleton rows={5} cols={5} />;
  }

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wide">
            ADMIN
          </span>
        );
      case 'SALES':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
            SALES
          </span>
        );
      case 'WAREHOUSE':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
            WAREHOUSE
          </span>
        );
      case 'ACCOUNTS':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-500/30 uppercase tracking-wide">
            ACCOUNTS
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FDD8A8] dark:bg-slate-800/50 text-[#002A1C] dark:text-slate-400 border-b border-[#F3CEA6] dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Staff Member / Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4 text-center">System Role</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3CEA6]/50 dark:divide-slate-800/50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#6B5542] dark:text-slate-500 font-medium">
                  No staff accounts found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-[#FFFBF7]/60 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-[#002A1C] dark:text-white text-sm">{u.fullName}</p>
                        {isSelf && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#004D34] text-white rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#002A1C] dark:text-slate-300 font-mono">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 text-center">{getRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-4 text-[#6B5542] dark:text-slate-400 font-mono text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onOpenRoleModal(u)}
                            className="px-2.5 py-1 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#004D34] dark:text-sky-400 font-bold border border-[#F3CEA6] dark:border-slate-700 rounded-lg transition text-[11px] inline-flex items-center space-x-1"
                            title="Change User Role"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Role</span>
                          </button>

                          {!isSelf && (
                            <button
                              onClick={() => onDeleteUser(u)}
                              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold border border-rose-500/30 rounded-lg transition text-[11px] inline-flex items-center space-x-1"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
