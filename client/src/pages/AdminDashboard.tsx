import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Users,
  Layers,
  FileSpreadsheet,
  Activity,
  CheckCircle2,
  Shield,
  Plus,
  Loader2,
} from 'lucide-react';

export const AdminDashboard: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'report' | 'categories' | 'audit'>('users');
  const [loading, setLoading] = useState(true);

  // Data
  const [users, setUsers] = useState<any[]>([]);
  const [report, setReport] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Add Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatDays, setNewCatDays] = useState('90');
  const [addingCat, setAddingCat] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, reportRes, catRes, logsRes] = await Promise.all([
        api.getAdminUsers(),
        api.getSystemReport(),
        api.getCategories(),
        api.getAuditLogs(),
      ]);

      setUsers(usersRes.users);
      setReport(reportRes);
      setCategories(catRes.categories);
      setAuditLogs(logsRes.logs);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (targetUserId: number, newRole: string) => {
    try {
      await api.updateUserRole(targetUserId, newRole);
      // Refresh user list
      const updated = await api.getAdminUsers();
      setUsers(updated.users);
    } catch (err: any) {
      alert('Error updating role: ' + err.message);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setAddingCat(true);
    try {
      await api.createCategory({
        name: newCatName,
        description: newCatDesc,
        retention_period_days: Number(newCatDays),
      });
      setNewCatName('');
      setNewCatDesc('');
      const catRes = await api.getCategories();
      setCategories(catRes.categories);
    } catch (err: any) {
      alert('Category error: ' + err.message);
    } finally {
      setAddingCat(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-charcoal-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-900/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>CampusFind Administrative Oversight Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sans">
            System Administration & Audit Controls
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
            Govern role permissions, monitor system-wide lost/found recovery efficiency, inspect immutable activity logs, and configure category policies.
          </p>
        </div>
      </div>

      {/* Metric Tiles */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm text-center">
            <p className="text-xs text-gray-500 font-medium">Users</p>
            <p className="text-2xl font-bold text-charcoal-900 mt-1 font-sans">{report.totals.users}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm text-center">
            <p className="text-xs text-gray-500 font-medium">Lost Reports</p>
            <p className="text-2xl font-bold text-charcoal-900 mt-1 font-sans">{report.totals.lostItems}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm text-center">
            <p className="text-xs text-gray-500 font-medium">Found Items</p>
            <p className="text-2xl font-bold text-peach-600 mt-1 font-sans">{report.totals.foundItems}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm text-center">
            <p className="text-xs text-gray-500 font-medium">Matches Flagged</p>
            <p className="text-2xl font-bold text-amber-600 mt-1 font-sans">{report.totals.matchedItems}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm text-center">
            <p className="text-xs text-gray-500 font-medium">Claims Filed</p>
            <p className="text-2xl font-bold text-charcoal-800 mt-1 font-sans">{report.totals.claims}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm text-center">
            <p className="text-xs text-gray-500 font-medium">Returned Receipts</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1 font-sans">{report.totals.returns}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Role Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'report'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>System Analytical Report</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories & Policies ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Activity Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-gray-200 text-charcoal-800 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Roll / SAP ID</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Assigned System Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-50/50">
                    <td className="p-3.5 font-bold text-gray-400">#{u.id}</td>
                    <td className="p-3.5 font-semibold text-charcoal-900">{u.name}</td>
                    <td className="p-3.5 text-gray-600">{u.email}</td>
                    <td className="p-3.5 font-medium text-peach-700">{u.identifier || '-'}</td>
                    <td className="p-3.5 text-gray-500">{u.department || 'NMIMS'}</td>
                    <td className="p-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${
                          u.role === 'administrator'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : u.role === 'security_personnel'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-cream-50 text-charcoal-800 border-gray-200'
                        }`}
                      >
                        <option value="campus_user">Campus User (Student/Staff)</option>
                        <option value="security_personnel">Security Personnel</option>
                        <option value="administrator">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: System Analytical Report */}
      {activeTab === 'report' && report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Breakdown Table */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft-sm space-y-4">
              <h3 className="font-bold text-base text-charcoal-900 font-sans">
                Found Property Status Distribution
              </h3>
              <div className="space-y-2">
                {report.statusBreakdown.map((s: any) => (
                  <div key={s.status} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                    <span className="font-medium text-charcoal-800">{s.status}</span>
                    <span className="font-bold text-peach-600 bg-peach-50 px-2 py-0.5 rounded">
                      {s.count} items
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Analysis */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft-sm space-y-4">
              <h3 className="font-bold text-base text-charcoal-900 font-sans">
                Category Lost vs Found Metrics
              </h3>
              <div className="space-y-2">
                {report.categoryDistribution.map((cat: any) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                    <span className="font-medium text-charcoal-800">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">Lost: <strong>{cat.lost_count}</strong></span>
                      <span className="text-peach-700">Found: <strong>{cat.found_count}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Categories & Retention Policy */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-soft-sm">
            <div className="p-4 bg-cream-100/70 border-b border-gray-200 font-bold text-xs text-charcoal-800">
              Active Item Categories
            </div>
            <div className="divide-y divide-gray-100 text-xs">
              {categories.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-charcoal-900">{c.name}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">{c.description || 'No description'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-peach-700 font-semibold bg-peach-50 px-2.5 py-1 rounded-full text-[11px]">
                      {c.retention_period_days || 90} Days Retention
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Category Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-soft-sm space-y-4">
            <h3 className="font-bold text-sm text-charcoal-900 font-sans">
              Add New Category
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Laboratory Equipment"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-peach-500/30"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Scope of items included"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-peach-500/30 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Retention Period (Days)
                </label>
                <input
                  type="number"
                  value={newCatDays}
                  onChange={(e) => setNewCatDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-peach-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={addingCat}
                className="w-full py-2.5 bg-peach-500 hover:bg-peach-600 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                {addingCat && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Category</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Activity Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-gray-200 text-charcoal-800 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Entity</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-cream-50/50">
                    <td className="p-3.5 text-gray-400">#{log.id}</td>
                    <td className="p-3.5 font-bold text-peach-700">{log.action}</td>
                    <td className="p-3.5 text-gray-600">{log.entity_type}</td>
                    <td className="p-3.5 text-charcoal-900">{log.user_name || 'System'}</td>
                    <td className="p-3.5 text-gray-700 font-sans max-w-xs truncate">{log.details}</td>
                    <td className="p-3.5 text-gray-400 font-sans">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
