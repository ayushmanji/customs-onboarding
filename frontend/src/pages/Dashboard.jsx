import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../services/api';
import {
  Users,
  Globe,
  Building2,
  CheckCircle2,
  UserPlus,
  Search,
  Filter,
  Eye,
  X,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  FileCheck2
} from 'lucide-react';

export const Dashboard = () => {
  const location = useLocation();
  const [toast, setToast] = useState(location.state?.toastMessage || null);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalExporters: 0,
    totalImporters: 0,
    totalVerified: 0,
  });
  const [customers, setCustomers] = useState([]);
  const [filterType, setFilterType] = useState('ALL'); // ALL, EXPORTER, IMPORTER, BOTH
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/customers');
      setStats(res.data.stats);
      setCustomers(res.data.customers);

      // Auto popup newly created customer profile if came from onboarding form
      if (location.state?.newCustomerId) {
        const newlyCreated = res.data.customers.find(
          (c) => c.id === location.state.newCustomerId
        );
        if (newlyCreated) {
          setSelectedCustomer(newlyCreated);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search and type
  const filteredCustomers = customers.filter((c) => {
    const matchesType =
      filterType === 'ALL'
        ? true
        : filterType === 'BOTH'
        ? c.customerType === 'BOTH'
        : c.customerType === filterType || c.customerType === 'BOTH';

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.gstin.toLowerCase().includes(q) ||
      (c.tradeName && c.tradeName.toLowerCase().includes(q)) ||
      c.email.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q));

    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Toast Alert Banner */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <span>{toast}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-emerald-400 hover:text-emerald-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Customs Broker Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your onboarded exporters & importers for customs declaration filings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/onboard"
            className="gradient-button px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20"
          >
            <UserPlus className="h-4 w-4" />
            Onboard New Customer
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalCustomers}</div>
            <div className="text-xs text-slate-400 font-medium">Total Onboarded Clients</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalExporters}</div>
            <div className="text-xs text-slate-400 font-medium">Active Exporters</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalImporters}</div>
            <div className="text-xs text-slate-400 font-medium">Active Importers</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-slate-400 font-medium">GSTIN Compliance Rate</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-6">
        {/* Controls: Search and Filter Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name, GSTIN, Email, City..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Clients' },
              { id: 'EXPORTER', label: 'Exporters' },
              { id: 'IMPORTER', label: 'Importers' },
              { id: 'BOTH', label: 'Dual Trade' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Table */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Fetching onboarded profiles from database...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="text-slate-300 font-semibold">No Customer Profiles Found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No customers match search "${searchQuery}"`
                : 'You have not onboarded any exporters or importers yet.'}
            </p>
            <Link
              to="/onboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold mt-2"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Onboard First Customer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/60 text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4">Entity Name & Trade</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">GSTIN & IEC Code</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Customs Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {cust.name}
                      </div>
                      {cust.tradeName && (
                        <div className="text-xs text-slate-400 font-normal">
                          Trade: {cust.tradeName}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          cust.customerType === 'EXPORTER'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : cust.customerType === 'IMPORTER'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {cust.customerType === 'EXPORTER' && <Globe className="h-3 w-3" />}
                        {cust.customerType === 'IMPORTER' && <Building2 className="h-3 w-3" />}
                        {cust.customerType === 'BOTH' && <Sparkles className="h-3 w-3" />}
                        {cust.customerType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs">
                      <div className="text-sky-300 font-medium">{cust.gstin}</div>
                      {cust.iec && <div className="text-slate-400 text-[11px]">IEC: {cust.iec}</div>}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div>{cust.email}</div>
                      <div className="text-slate-400 text-[11px]">{cust.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {cust.city}, {cust.state}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detailed Profile Modal Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-xl rounded-2xl border border-slate-700/80 p-6 shadow-2xl space-y-6 relative overflow-hidden">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {selectedCustomer.customerType} Profile
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedCustomer.name}</h2>
                {selectedCustomer.tradeName && (
                  <p className="text-xs text-slate-400">Trade: {selectedCustomer.tradeName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">GSTIN</span>
                <div className="font-mono text-sky-300 font-bold text-sm mt-0.5">
                  {selectedCustomer.gstin}
                </div>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">IEC Code</span>
                <div className="font-mono text-emerald-300 font-bold text-sm mt-0.5">
                  {selectedCustomer.iec || 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">PAN Number</span>
                <div className="font-mono text-slate-200 font-semibold mt-0.5">
                  {selectedCustomer.pan || 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Customs Status</span>
                <div className="text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  VERIFIED
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-sky-400 flex-shrink-0" />
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-sky-400 flex-shrink-0" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>
                  {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} -{' '}
                  {selectedCustomer.pincode}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Onboarded: {new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
