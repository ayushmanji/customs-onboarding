import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import {
  UserPlus,
  Building2,
  Mail,
  Phone,
  FileCheck2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Globe
} from 'lucide-react';

export const CustomerOnboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    tradeName: '',
    email: '',
    phone: '',
    customerType: 'EXPORTER', // EXPORTER, IMPORTER, BOTH
    gstin: '',
    iec: '',
    pan: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [verifyingGstin, setVerifyingGstin] = useState(false);
  const [gstinVerifiedData, setGstinVerifiedData] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto convert GSTIN, IEC, PAN to Uppercase
    let val = value;
    if (['gstin', 'iec', 'pan'].includes(name)) {
      val = value.toUpperCase();
    }

    setFormData({ ...formData, [name]: val });

    // Auto extract PAN if GSTIN is being typed (chars 3 to 12 of GSTIN)
    if (name === 'gstin' && val.length >= 12) {
      const extractedPan = val.substring(2, 12);
      setFormData((prev) => ({ ...prev, gstin: val, pan: extractedPan }));
    }

    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleVerifyGstin = async () => {
    if (!formData.gstin || formData.gstin.length !== 15) {
      setFieldErrors({ ...fieldErrors, gstin: 'Please enter a full 15-character GSTIN to verify' });
      return;
    }

    setVerifyingGstin(true);
    setError('');

    try {
      const res = await API.post('/customers/verify-gstin', { gstin: formData.gstin });
      setGstinVerifiedData(res.data);
      if (!formData.name) {
        setFormData((prev) => ({ ...prev, name: res.data.legalName }));
      }
    } catch (err) {
      console.error('GSTIN verify error:', err);
    } finally {
      setVerifyingGstin(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await API.post('/customers', formData);
      // On success, navigate back to dashboard with state
      navigate('/dashboard', {
        state: {
          toastMessage: `Successfully onboarded customer '${formData.name}' (${formData.customerType})!`,
          newCustomerId: response.data.customer.id,
        },
      });
    } catch (err) {
      if (err.response?.data?.details) {
        const errs = {};
        err.response.data.details.forEach((d) => {
          errs[d.field] = d.message;
        });
        setFieldErrors(errs);
      } else {
        setError(err.response?.data?.error || 'Failed to save customer profile. Please verify input data.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60 glass-card">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <UserPlus className="h-4 w-4" />
            Client Onboarding Engine
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Onboard New Exporter / Importer</h1>
          <p className="text-sm text-slate-400 mt-1">
            Register client entity profiles for customs filing & clearance on their behalf.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-sky-950/60 px-4 py-2 rounded-xl border border-sky-800/50 text-xs text-sky-300">
          <ShieldCheck className="h-4 w-4 text-sky-400" />
          <span>PostgreSQL API Ready</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Customer Type Selector */}
        <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
          <label className="block text-sm font-semibold text-slate-200">
            Select Customer Business Classification *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'EXPORTER', title: 'Exporter', desc: 'Filing Shipping Bills & Exports', icon: Globe },
              { id: 'IMPORTER', title: 'Importer', desc: 'Filing Bills of Entry & Imports', icon: Building2 },
              { id: 'BOTH', title: 'Both (Dual)', desc: 'Handles Export & Import Trade', icon: Sparkles },
            ].map((item) => {
              const IconComp = item.icon;
              const isSelected = formData.customerType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, customerType: item.id })}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-600/20 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComp className={`h-5 w-5 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-sky-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Primary Business & Identification */}
        <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-3">
            <Building2 className="h-5 w-5 text-sky-400" />
            1. Legal Entity & Registration Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Legal Registered Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Apex Trading & Spices Pvt Ltd"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
              {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Trade Name (Optional)
              </label>
              <input
                type="text"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleChange}
                placeholder="e.g. Apex Spices"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>
          </div>

          {/* GSTIN & IEC & Verification Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                GSTIN (15 Digits) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="gstin"
                  required
                  maxLength={15}
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="27AAAAA0000A1Z5"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white uppercase placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-mono tracking-wider"
                />
              </div>
              {fieldErrors.gstin && <p className="text-red-400 text-xs mt-1">{fieldErrors.gstin}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                IEC (Import Export Code - 10 Digits)
              </label>
              <input
                type="text"
                name="iec"
                maxLength={10}
                value={formData.iec}
                onChange={handleChange}
                placeholder="0304918234"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white uppercase placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-mono tracking-wider"
              />
              {fieldErrors.iec && <p className="text-red-400 text-xs mt-1">{fieldErrors.iec}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                PAN Number
              </label>
              <input
                type="text"
                name="pan"
                maxLength={10}
                value={formData.pan}
                onChange={handleChange}
                placeholder="AAAAA0000A"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white uppercase placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-mono tracking-wider"
              />
            </div>
          </div>

          {/* GST Verification Action Helper */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">
              Need to test GSTIN validity before saving?
            </span>
            <button
              type="button"
              onClick={handleVerifyGstin}
              disabled={verifyingGstin || !formData.gstin}
              className="px-3 py-1.5 bg-sky-900/60 hover:bg-sky-800 border border-sky-700 text-sky-300 rounded-lg font-medium flex items-center gap-1.5 disabled:opacity-40 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              {verifyingGstin ? 'Verifying with GST API...' : 'Verify GSTIN Online'}
            </button>
          </div>

          {gstinVerifiedData && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 space-y-1">
              <div className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                GSTIN Verification Status: {gstinVerifiedData.gstinStatus}
              </div>
              <p>Legal Name: <strong>{gstinVerifiedData.legalName}</strong></p>
              <p>IEC Verification: <strong>{gstinVerifiedData.iecStatus}</strong></p>
            </div>
          )}
        </div>

        {/* Section 3: Contact & Address Info */}
        <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-3">
            <Mail className="h-5 w-5 text-sky-400" />
            2. Contact & Address Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Contact Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customs@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
              {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mobile / Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9920112233"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
              {fieldErrors.phone && <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Registered Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Plot 42, Industrial Area Phase 1"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>
            {fieldErrors.address && <p className="text-red-400 text-xs mt-1">{fieldErrors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
              {fieldErrors.city && <p className="text-red-400 text-xs mt-1">{fieldErrors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
              {fieldErrors.state && <p className="text-red-400 text-xs mt-1">{fieldErrors.state}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Pincode (6 Digits) *
              </label>
              <input
                type="text"
                name="pincode"
                required
                maxLength={6}
                value={formData.pincode}
                onChange={handleChange}
                placeholder="400703"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
              {fieldErrors.pincode && <p className="text-red-400 text-xs mt-1">{fieldErrors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="gradient-button text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-sky-500/25 flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Saving to Database...</span>
            ) : (
              <>
                <span>Save Customer & View Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
