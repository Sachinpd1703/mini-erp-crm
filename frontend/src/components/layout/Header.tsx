import React from 'react';
import { useAuth } from '../../modules/auth/AuthContext';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'SALES':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'WAREHOUSE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ACCOUNTS':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <h1 className="text-sm font-semibold text-white">Operations Command Portal</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Role Badge */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getRoleBadgeStyle(
            user?.role
          )}`}
        >
          {user?.role}
        </span>

        {/* User Info */}
        <div className="flex items-center space-x-2 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-white">{user?.fullName}</p>
            <p className="text-[10px] text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
