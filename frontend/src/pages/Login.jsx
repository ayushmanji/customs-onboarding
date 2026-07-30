import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Anchor, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoBroker = () => {
    setEmail('broker@customsbroker.com');
    setPassword('Password@123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@customsbroker.com');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-button items-center justify-center text-white mb-4 shadow-xl shadow-sky-500/20">
            <Anchor className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Broker Portal Login</h1>
          <p className="text-sm text-slate-400 mt-1">
            Access your Customs Client Onboarding Engine
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-slate-700/60">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Broker Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="broker@customsbroker.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 gradient-button text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 disabled:opacity-50"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-xs font-medium text-slate-400 mb-3 text-center">
              ⚡ Demo Test Presets (One-click fill)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={fillDemoBroker}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5 text-sky-400" />
                Demo Broker
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                Demo Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have a broker account?{' '}
          <Link to="/register" className="text-sky-400 hover:underline font-semibold">
            Register as a Customs Broker
          </Link>
        </p>
      </div>
    </div>
  );
};
