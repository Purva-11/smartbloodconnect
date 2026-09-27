import React, { useState } from 'react';
import { ShieldCheck, Download, Filter, Search, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { initialAuditLogs } from '../../data/mockData';

export function AuditSecurityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredLogs = initialAuditLogs.filter(log => {
    const matchSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        log.actor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || log.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)] flex items-center gap-2">
          <ShieldCheck size={24} className="text-[var(--cyan)]" />
          Audit & Security
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Immutable audit trail of all data access, consents, and critical actions.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 glass-panel rounded-[var(--radius-xl)] p-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search logs (e.g. actor, action, IP)..."
            className="w-full pl-9 pr-4 py-2 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--glass-border)] text-sm focus:outline-none focus:border-[var(--blue)]"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--glass-border)] text-sm focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="consent">Consent Changes</option>
          <option value="auth">Authentication</option>
          <option value="emergency">Emergency SOS</option>
          <option value="registration">Registrations</option>
        </select>
        <Button variant="ghost" className="shrink-0"><Download size={14} /> Export CSV</Button>
      </div>

      <div className="glass-panel rounded-[var(--radius-xl)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--glass)] border-b border-[var(--glass-border)] text-[var(--muted)] text-left">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Action & Details</th>
                <th className="py-3 px-4 font-semibold">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[var(--glass)] transition-colors text-[var(--text)]">
                  <td className="py-3 px-4 whitespace-nowrap text-xs text-[var(--muted)]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold">{log.actor}</div>
                    <div className="text-[10px] text-[var(--muted)] uppercase tracking-wide">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={
                      log.category === 'consent' ? 'green' : 
                      log.category === 'emergency' ? 'red' : 
                      log.category === 'auth' ? 'blue' : 'default'
                    }>
                      {log.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold mb-0.5">{log.action}</div>
                    <div className="text-xs text-[var(--muted)] max-w-md truncate">{log.details}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[var(--muted)]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-[var(--muted)]">
            <Filter size={32} className="mx-auto mb-3 opacity-30" />
            <p>No audit logs match your filters.</p>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border border-[var(--green)]/30 bg-[var(--green)]/5 text-[var(--green)] text-sm">
        <CheckCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Cryptographically Secured</p>
          <p className="mt-1 opacity-90 text-xs">These logs are read-only and cryptographically signed to prevent tampering. They satisfy compliance requirements for medical data handling.</p>
        </div>
      </div>
    </div>
  );
}
