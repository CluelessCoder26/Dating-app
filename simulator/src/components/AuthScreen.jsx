import React, { useState } from 'react';
import { api } from '../api';
import { Flame, LogIn, UserPlus, AlertCircle } from 'lucide-react';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!phone || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Phone format validation: matches backend regex: /^\+?[1-9]\d{9,14}$/
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phone)) {
      setError('Phone number must be in international format (e.g., +15550102 or +919876543210)');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const data = await api.login(phone, password);
        onAuthSuccess(data.token);
      } else {
        const data = await api.register(phone, password);
        onAuthSuccess(data.token);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper flex justify-center items-center min-h-[80vh]">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        {/* Glowing backgrounds */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-color-pink/10 rounded-full filter blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-color-blue/10 rounded-full filter blur-2xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className="brand-logo mx-auto w-16 h-16 bg-gradient-to-tr from-color-pink to-color-purple rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
            <Flame size={32} className="text-white fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to Ignite</h2>
          <p className="text-xs text-muted mt-1">Discover, Match, and Chat in Real-Time</p>
        </div>

        {/* Toggle tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/5">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              isLogin ? 'bg-color-pink text-white shadow-md' : 'text-muted hover:text-white'
            }`}
          >
            <LogIn size={14} /> Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isLogin ? 'bg-color-pink text-white shadow-md' : 'text-muted hover:text-white'
            }`}
          >
            <UserPlus size={14} /> Register
          </button>
        </div>

        {error && (
          <div className="error-box bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg flex items-start gap-2 mb-4">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g., +15550102"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-input"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider uppercase mt-6 relative"
          >
            {loading ? (
              <span className="spinner"></span>
            ) : isLogin ? (
              'Enter Ignite'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-[10px] text-dim">
          {isLogin ? (
            <span>Demo accounts: Use <strong>+15550101</strong> or <strong>+15550102</strong> with password <strong>password123</strong></span>
          ) : (
            <span>Your location will be set to San Francisco by default.</span>
          )}
        </div>
      </div>
    </div>
  );
}
