import React from 'react';
import { useAuth } from '../../modules/auth/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'SALES':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
      case 'WAREHOUSE':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
      case 'ACCOUNTS':
        return 'bg-sky-500/20 text-sky-300 border-sky-400/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <header className="h-16 bg-[#002A1C] dark:bg-[#021811] border-b border-[#F3CEA6]/30 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md transition-colors duration-200">
      <div className="flex items-center space-x-3">
        <h1 className="text-sm font-bold text-white tracking-wide">
          Operations Command Portal
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Sun / Moon Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Click to toggle Light (Spruce Cream) vs Dark Theme"
          className="p-2 text-[#E2F5EE] hover:text-white bg-[#003B28] dark:bg-slate-800 hover:bg-[#004D34] dark:hover:bg-slate-700 border border-[#F3CEA6]/40 dark:border-slate-700 rounded-xl transition flex items-center space-x-1.5 text-xs font-semibold shadow-sm"
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-4 h-4 text-amber-300" />
              {/* <span className="hidden sm:inline">Active: Spruce Cream</span> */}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-sky-400" />
              {/* <span className="hidden sm:inline">Active: Dark Mode</span> */}
            </>
          )}
        </button>

        {/* Role Badge */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getRoleBadgeStyle(
            user?.role
          )}`}
        >
          {user?.role}
        </span>

        {/* User Info */}
        <div className="flex items-center space-x-2 border-l border-[#F3CEA6]/30 dark:border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-[#003B28] dark:bg-slate-800 border border-[#F3CEA6]/40 dark:border-slate-700 flex items-center justify-center text-[#E2F5EE]">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-white">{user?.fullName}</p>
            <p className="text-[10px] text-[#8CBCAE] dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-[#8CBCAE] hover:text-red-300 hover:bg-red-500/20 rounded-xl transition border border-transparent"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
