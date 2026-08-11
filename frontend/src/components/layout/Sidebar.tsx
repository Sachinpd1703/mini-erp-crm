import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  History,
  FileText,
  ShieldAlert,
  UserCog,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../modules/auth/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Customer CRM', path: '/customers', icon: Users, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Product Catalog', path: '/products', icon: Package, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Inventory Audit', path: '/inventory', icon: History, roles: ['ADMIN', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Sales Challans', path: '/challans', icon: FileText, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Staff Accounts', path: '/users', icon: UserCog, roles: ['ADMIN'] },
  ];

  const allowedNav = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-[#002A1C] dark:bg-[#021811] border-r border-[#F3CEA6]/30 dark:border-slate-800 min-h-screen flex flex-col justify-between p-4 transition-colors duration-200">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-9 h-9 bg-[#FFE4C4] dark:bg-emerald-950/60 border border-[#F3CEA6] dark:border-emerald-500/40 rounded-xl flex items-center justify-center text-[#002A1C] dark:text-emerald-400 font-bold shadow-sm">
            ERP
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Mini ERP + CRM</h2>
            <p className="text-[10px] text-[#8CBCAE] dark:text-emerald-400/80 uppercase tracking-widest font-semibold">
              Distribution Portal
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {allowedNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#FFE4C4] text-[#002A1C] font-bold shadow-md'
                      : 'text-[#E2F5EE] hover:text-white hover:bg-[#003B28] dark:hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Info & Logout Block */}
      <div className="space-y-2 pt-4 border-t border-[#F3CEA6]/20 dark:border-slate-800">
        <div className="p-3 bg-[#003B28] dark:bg-slate-900/60 border border-[#F3CEA6]/30 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#E2F5EE]">
            <span className="font-semibold truncate max-w-[120px]">{user?.fullName || 'User'}</span>
            <span className="font-bold text-[#FFE4C4] dark:text-emerald-400 text-[10px] px-2 py-0.5 bg-[#002A1C] dark:bg-slate-800 rounded border border-[#F3CEA6]/20">
              {user?.role}
            </span>
          </div>
          <div className="text-[10px] text-[#8CBCAE] dark:text-slate-400 flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-[#8CBCAE]" />
            <span>RBAC Active</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Logout</span>
        </button>
      </div>
    </aside>
  );
};
