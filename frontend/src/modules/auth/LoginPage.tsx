import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || 'Failed to authenticate. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations Portal Login</h1>
          <p className="text-xs text-slate-400">Mini ERP + CRM Distribution Management System</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@minierp.com"
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Fill Role Buttons for Evaluator Convenience */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-sky-400" />
            <span>Quick Fill Demo Role Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@minierp.com', 'Admin123!')}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 rounded-lg transition text-left"
            >
              <span className="font-semibold">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('sales@minierp.com', 'Sales123!')}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 rounded-lg transition text-left"
            >
              <span className="font-semibold">Sales</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('warehouse@minierp.com', 'Warehouse123!')}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 rounded-lg transition text-left"
            >
              <span className="font-semibold">Warehouse</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('accounts@minierp.com', 'Accounts123!')}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 rounded-lg transition text-left"
            >
              <span className="font-semibold">Accounts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
