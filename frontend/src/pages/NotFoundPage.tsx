import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, LayoutDashboard, Users, Package, FileText, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFBF7] dark:bg-[#021811] flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-[#FFE4C4] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        {/* Decorative Background Glow Ring */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#004D34]/10 dark:bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Floating 404 Badge Icon */}
        <div className="mx-auto w-20 h-20 bg-[#FFFBF7] dark:bg-slate-800 border-2 border-[#F3CEA6] dark:border-slate-700 rounded-3xl flex items-center justify-center shadow-md">
          <Compass className="w-10 h-10 text-[#004D34] dark:text-emerald-400 animate-spin-slow" />
        </div>

        {/* 404 Header Text */}
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-[#002A1C] dark:text-white tracking-tight font-mono">
            404
          </h1>
          <h2 className="text-lg font-bold text-[#002A1C] dark:text-slate-100">
            Page Not Found / Unreachable Route
          </h2>
          <p className="text-xs text-[#6B5542] dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
            The page or distribution endpoint you requested does not exist or may have been moved.
          </p>
        </div>

        {/* Primary Back Button */}
        <div className="pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-[#004D34] hover:bg-[#003826] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back to Previous Page</span>
          </button>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="pt-4 border-t border-[#F3CEA6] dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-[#6B5542] dark:text-slate-400 uppercase tracking-wider">
            Quick Navigation Shortcuts
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              to="/dashboard"
              className="p-2.5 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-200 border border-[#F3CEA6] dark:border-slate-700 rounded-xl transition flex items-center space-x-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/customers"
              className="p-2.5 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-200 border border-[#F3CEA6] dark:border-slate-700 rounded-xl transition flex items-center space-x-2"
            >
              <Users className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Customers</span>
            </Link>

            <Link
              to="/products"
              className="p-2.5 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-200 border border-[#F3CEA6] dark:border-slate-700 rounded-xl transition flex items-center space-x-2"
            >
              <Package className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Products</span>
            </Link>

            <Link
              to="/challans"
              className="p-2.5 bg-[#FFFBF7] dark:bg-slate-800 hover:bg-[#FDD8A8] dark:hover:bg-slate-700 text-[#002A1C] dark:text-slate-200 border border-[#F3CEA6] dark:border-slate-700 rounded-xl transition flex items-center space-x-2"
            >
              <FileText className="w-3.5 h-3.5 text-[#004D34] dark:text-sky-400" />
              <span>Challans</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
