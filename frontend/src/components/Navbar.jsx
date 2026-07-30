import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Anchor, LayoutDashboard, UserPlus, ShieldCheck, LogOut, Building2, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav sticky top-0 z-50 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl gradient-button flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Anchor className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
              CustomsEngine <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30">MVP</span>
            </span>
            <p className="text-xs text-slate-400">Broker Onboarding Platform</p>
          </div>
        </Link>

        {/* Navigation Links */}
        {user && (
          <div className="hidden md:flex items-center gap-2 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              to="/onboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/onboard')
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              New Customer Onboarding
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
          </div>
        )}

        {/* User Identity & Logout */}
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="h-8 w-8 rounded-lg bg-sky-900/60 text-sky-400 flex items-center justify-center font-bold text-sm border border-sky-700/50">
                {user.name.charAt(0)}
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-semibold text-white">{user.name}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-sky-400 inline" />
                  {user.brokerLicenseNo ? `Lic: ${user.brokerLicenseNo}` : user.role}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-slate-700/40 hover:border-red-500/30"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="gradient-button text-sm font-semibold text-white px-4 py-2 rounded-xl shadow-md"
            >
              Broker Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
