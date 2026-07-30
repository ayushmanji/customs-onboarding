import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  ShieldCheck,
  Users,
  Building2,
  Globe,
  Activity,
  UserCheck,
  Lock,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBrokers: 0,
    totalCustomers: 0,
    totalExporters: 0,
    totalImporters: 0,
    totalDual: 0,
  });

  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes] = await Promise.all([
        API.get('/admin/overview'),
        API.get('/admin/users'),
      ]);

      setStats(overviewRes.data.stats);
      setAuditLogs(overviewRes.data.auditLogs);
      setUsers(usersRes.data.users);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.companyName && u.companyName.toLowerCase().includes(q)) ||
      (u.brokerLicenseNo && u.brokerLicenseNo.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-indigo-950/40 p-6 rounded-2xl border border-indigo-800/40 glass-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            System Administration Panel (Bonus Task)
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform-Wide Overview & Users</h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor all registered customs brokers, onboarded exporter/importer accounts, and security audit logs.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700 text-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalBrokers}</div>
            <div className="text-xs text-slate-400 font-medium">Registered Customs Brokers</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalCustomers}</div>
            <div className="text-xs text-slate-400 font-medium">Global Customer Profiles</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalExporters}</div>
            <div className="text-xs text-slate-400 font-medium">Total Exporters</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">Bcrypt Cost 10</div>
            <div className="text-xs text-slate-400 font-medium">Password Hashing API</div>
          </div>
        </div>
      </div>

      {/* Grid: Brokers List & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Registered Brokers Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Registered Customs Brokers
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brokers..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="uppercase bg-slate-900/60 text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="py-2.5 px-3">Broker Name & Role</th>
                  <th className="py-2.5 px-3">License & Agency</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3 text-center">Clients Onboarded</th>
                  <th className="py-2.5 px-3 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{u.name}</div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-sky-500/20 text-sky-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-mono text-sky-400">{u.brokerLicenseNo || 'N/A'}</div>
                      <div className="text-slate-400 text-[11px]">{u.companyName || 'Private Broker'}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300">{u.email}</td>

                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 font-bold text-sky-400 border border-slate-700">
                        {u._count?.customers || 0}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Live Audit Logs */}
        <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-4">
            <Activity className="h-5 w-5 text-emerald-400" />
            Security Audit Trail
          </h2>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <div className="text-slate-500 text-xs py-8 text-center">No system activity logged yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-400 font-mono">{log.action}</span>
                    <span className="text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
