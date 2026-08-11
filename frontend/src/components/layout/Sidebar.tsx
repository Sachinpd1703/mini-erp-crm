import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  History,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../modules/auth/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Customer CRM', path: '/customers', icon: Users, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Product Catalog', path: '/products', icon: Package, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Inventory Audit', path: '/inventory', icon: History, roles: ['ADMIN', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Sales Challans', path: '/challans', icon: FileText, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
  ];

  const allowedNav = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-9 h-9 bg-sky-500/20 border border-sky-500/30 rounded-xl flex items-center justify-center text-sky-400 font-bold">
            ERP
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Mini ERP + CRM</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Distribution System</p>
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
                      ? 'bg-sky-600/10 text-sky-400 border border-sky-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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

      {/* Role Access Footer Info */}
      <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Logged Role:</span>
          <span className="font-semibold text-sky-400">{user?.role}</span>
        </div>
        <div className="text-[10px] text-slate-500 flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3 text-slate-400" />
          <span>RBAC Route Protection Active</span>
        </div>
      </div>
    </aside>
  );
};
