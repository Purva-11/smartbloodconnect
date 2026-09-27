import React, { useState } from 'react';
import { Building2, Tent, Users, TrendingUp, Plus, CheckCircle, Clock, AlertTriangle, BarChart2, Download, Upload, Eye, Phone, MapPin, Calendar, Activity, Target, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/Tabs';
import { initialCamps, initialRegistrations } from '../../data/mockData';
import { QRScannerModal } from '../../components/qr/QRScannerModal';

interface OrgPageProps {
  onNavigate: (s: string) => void;
}

const BLOOD_INV = [
  { group: 'A+', units: 142, max: 200, critical: false },
  { group: 'B+', units: 89, max: 200, critical: false },
  { group: 'O+', units: 23, max: 200, critical: true },
  { group: 'AB+', units: 61, max: 200, critical: false },
  { group: 'A-', units: 12, max: 100, critical: true },
  { group: 'B-', units: 34, max: 100, critical: false },
  { group: 'O-', units: 8, max: 100, critical: true },
  { group: 'AB-', units: 19, max: 100, critical: false },
];

const VOLUNTEER_CHECKINS = [
  { id: 'BC-TKT-89402', name: 'Riya Mehta', blood: 'O+', time: '09:14 AM', status: 'Present' },
  { id: 'BC-TKT-73120', name: 'Arjun Sharma', blood: 'A+', time: '09:27 AM', status: 'Present' },
  { id: 'BC-TKT-55841', name: 'Priya Patel', blood: 'B+', time: '09:45 AM', status: 'Present' },
  { id: 'BC-TKT-22917', name: 'Vikram Singh', blood: 'AB+', time: '10:02 AM', status: 'Confirmed' },
  { id: 'BC-TKT-10384', name: 'Aanya Gupta', blood: 'O-', time: '—', status: 'Registered' },
];

export function OrganizationDashboardPage({ onNavigate }: OrgPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'camps' | 'inventory' | 'checkin'>('overview');
  const [scanInput, setScanInput] = useState('');
  const [scanned, setScanned] = useState<typeof VOLUNTEER_CHECKINS[0] | null>(null);
  const [scanMsg, setScanMsg] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const myCamps = initialCamps.slice(0, 3);
  const totalRegistered = myCamps.reduce((a, c) => a + c.registered, 0);
  const totalTarget = myCamps.reduce((a, c) => a + c.target, 0);
  const criticalGroups = BLOOD_INV.filter(b => b.critical);

  const handleScan = () => {
    const found = VOLUNTEER_CHECKINS.find(v => v.id.toLowerCase() === scanInput.trim().toLowerCase());
    if (found) { setScanned(found); setScanMsg(''); }
    else { setScanned(null); setScanMsg('Ticket not found. Please verify the ID.'); }
  };

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'camps', label: 'My Camps' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'checkin', label: 'Volunteer Check-in' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={20} className="text-[var(--cyan)]" />
            <h1 className="text-2xl font-extrabold text-[var(--text)]">
              {user?.organizationName ?? 'Organization Dashboard'}
            </h1>
            {user?.verifiedOrganization && (
              <Badge variant="green"><CheckCircle size={10} className="mr-1" />Verified</Badge>
            )}
          </div>
          <p className="text-sm text-[var(--muted)]">Manage camps, blood inventory, and volunteer check-ins.</p>
        </div>
        <Button onClick={() => onNavigate('camps')} className="shrink-0"><Plus size={14} /> Create Camp Drive</Button>
      </div>

      {criticalGroups.length > 0 && (
        <div className="glass-panel border border-[var(--red)]/40 bg-[var(--red)]/5 rounded-[var(--radius-lg)] px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[var(--red)] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-[var(--red)]">Critical Blood Stock Alert</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">Blood groups <strong>{criticalGroups.map(g => g.group).join(', ')}</strong> are critically low.</p>
          </div>
          <Button variant="danger" size="sm" className="ml-auto shrink-0" onClick={() => onNavigate('emergency')}><Zap size={12} /> Alert</Button>
        </div>
      )}

      <div className="flex gap-1 glass-panel rounded-[var(--radius-lg)] p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-4 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold transition-all ${activeTab === t.id ? 'bg-[var(--blue)] text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/20'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* Basic Content rendered for simplicity */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Camps" value={myCamps.length.toString()} icon={<Tent size={18} />} color="blue" />
          <StatCard title="Registered" value={totalRegistered.toString()} icon={<Users size={18} />} color="cyan" />
          <StatCard title="Units Collected" value="1,842" icon={<Activity size={18} />} color="green" />
          <StatCard title="Fulfillment" value={`${Math.round((totalRegistered / totalTarget) * 100)}%`} icon={<Target size={18} />} color="red" />
        </div>
      )}
      
      {activeTab === 'checkin' && (
        <div className="glass-panel rounded-[var(--radius-xl)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--text)] flex items-center gap-2"><CheckCircle size={16} className="text-[var(--green)]" />Volunteer Check-in</h3>
            <Button onClick={() => setIsScannerOpen(true)}>Open Scanner</Button>
          </div>
          <div className="flex gap-3 mb-4">
            <input value={scanInput} onChange={e => setScanInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleScan()} placeholder="Enter Ticket ID (e.g. BC-TKT-89402)" className="flex-1 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm focus:outline-none focus:border-[var(--blue)]" />
            <Button onClick={handleScan}>Search</Button>
          </div>
          {scanMsg && <div className="text-xs text-[var(--red)] font-medium">{scanMsg}</div>}
          {scanned && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--green)]/40 bg-[var(--green)]/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-[var(--green)] font-bold text-sm"><CheckCircle size={16} /> Ticket Found: {scanned.name}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
