import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Anchor, Mail, Lock, User, Building2, FileText, Phone, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    brokerLicenseNo: '',
    companyName: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.details) {
        const errorsObj = {};
        err.response.data.details.forEach((d) => {
          errorsObj[d.field] = d.message;
        });
        setFieldErrors(errorsObj);
      } else {
        setError(err.response?.data?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Basic Password Strength Meter
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Moderate', color: 'bg-yellow-500' };
    return { score, label: 'Strong (Recommended)', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-button items-center justify-center text-white mb-4 shadow-xl shadow-sky-500/20">
            <Anchor className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customs Broker Registration</h1>
          <p className="text-sm text-slate-400 mt-1">
            Register your customs agency to start onboarding exporters & importers
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-slate-700/60">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Grid 2 Column for Broker Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Broker Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                </div>
                {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Work Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="broker@agency.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                </div>
                {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Customs License No.
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="brokerLicenseNo"
                    value={formData.brokerLicenseNo}
                    onChange={handleChange}
                    placeholder="CB-MUM-2024-8849"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Agency / Freight Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Apex Logistics Pvt Ltd"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9819001122"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password (Hashed via Bcrypt) *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
              {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Security Strength:</span>
                    <span className="font-medium text-slate-200">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-sky-950/40 rounded-xl border border-sky-800/40 text-xs text-sky-300 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-sky-400 mt-0.5" />
              <span>
                Passwords are securely encrypted with <strong>Bcrypt (cost factor 10)</strong> on the Node.js API server prior to database insertion.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 gradient-button text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 disabled:opacity-50"
            >
              {submitting ? (
                <span>Registering Broker Account...</span>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-sky-400 hover:underline font-semibold">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
