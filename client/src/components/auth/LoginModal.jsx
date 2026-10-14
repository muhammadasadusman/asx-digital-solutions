import React, { useState } from 'react';
import { ShieldCheck, X, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function LoginModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillSuperAdmin = () => {
    setEmail('admin@asxdigital.com');
    setPassword('Admin@ASX2026');
    setError('');
  };

  const fillManager = () => {
    setEmail('manager@asxdigital.com');
    setPassword('Manager@ASX2026');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-white">
              ASX Staff & Admin Portal
            </h3>
            <p className="text-xs text-slate-400">
              Role-Based Access Control Protected
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Quick Demo Pre-fill helpers */}
        <div className="mb-5 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Quick 1-Click Login (Pre-Configured Accounts):
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillSuperAdmin}
              className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 text-[11px] font-semibold transition-all"
            >
              👑 Super Admin
            </button>
            <button
              type="button"
              onClick={fillManager}
              className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 text-[11px] font-semibold transition-all"
            >
              🛡️ Sub-Admin / Manager
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
              Email Address:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@asxdigital.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
              Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Control Center'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
