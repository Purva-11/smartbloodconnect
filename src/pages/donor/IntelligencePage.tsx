import React, { useState, useEffect } from 'react';
import {
  Brain, TrendingUp, Sliders, Zap, BarChart2,
  Search, MapPin, Activity, Target, RefreshCw,
  CloudRain, Sun, Users, AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/Tabs';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SMART_SEARCH_DATA = [
  { id: 1, name: 'Apollo Hospital Blood Bank', city: 'Mumbai', blood: ['O-', 'A+', 'B+'], type: 'Blood Bank', distance: '1.2 km', units: 48, available: true },
  { id: 2, name: 'Lilavati Hospital', city: 'Mumbai', blood: ['AB+', 'O+', 'A-'], type: 'Hospital', distance: '2.8 km', units: 22, available: true },
  { id: 3, name: 'Rotary Blood Bank', city: 'Mumbai', blood: ['B-', 'O-', 'AB-'], type: 'Blood Bank', distance: '4.1 km', units: 12, available: true },
  { id: 4, name: 'KEM Hospital', city: 'Mumbai', blood: ['A+', 'B+', 'O+'], type: 'Hospital', distance: '5.3 km', units: 65, available: false },
  { id: 5, name: 'HLA Specialised Centre', city: 'Pune', blood: ['O-', 'B-'], type: 'HLA Centre', distance: '12 km', units: 8, available: true },
];

interface ScenarioState {
  baseTurnout: number;
  weather: number;
  volunteers: number;
  emergency: number;
}

function calcPrediction(s: ScenarioState): number {
  return Math.round(500 * (s.baseTurnout / 100) * (s.weather / 100) * (1 + s.volunteers / 100) * (1 + s.emergency / 200));
}

export function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'search' | 'trends'>('simulator');
  const [scenario, setScenario] = useState<ScenarioState>({ baseTurnout: 65, weather: 80, volunteers: 60, emergency: 40 });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(calcPrediction({ baseTurnout: 65, weather: 80, volunteers: 60, emergency: 40 }));

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBlood, setFilterBlood] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    setPrediction(calcPrediction(scenario));
  }, [scenario]);

  const runSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      setPrediction(calcPrediction(scenario));
      setLoading(false);
    }, 1200);
  };

  const filteredSearch = SMART_SEARCH_DATA.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchName = item.name.toLowerCase().includes(q) || item.city.toLowerCase().includes(q);
    const matchBlood = !filterBlood || item.blood.includes(filterBlood);
    const matchType = !filterType || item.type === filterType;
    return matchName && matchBlood && matchType;
  });

  const confidence = { low: Math.max(prediction - 45, 0), high: prediction + 52 };

  const TABS = [
    { id: 'simulator', label: 'Turnout Simulator', icon: <Sliders size={13} /> },
    { id: 'search', label: 'Smart Search', icon: <Search size={13} /> },
    { id: 'trends', label: 'Network Trends', icon: <TrendingUp size={13} /> },
  ];

  const TREND_DATA = [
    { month: 'Apr', units: 3200 }, { month: 'May', units: 4100 }, { month: 'Jun', units: 3750 },
    { month: 'Jul', units: 5200 }, { month: 'Aug', units: 4800 }, { month: 'Sep', units: 6300 },
  ];
  const maxUnits = Math.max(...TREND_DATA.map(d => d.units));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)] flex items-center gap-2">
          <Brain size={22} className="text-[var(--cyan)]" />
          Intelligence Center
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          AI-powered predictions, smart resource search, and network analytics.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Network Active" value="18,426" subtitle="Donors online" icon={<Users size={18} />} color="blue" />
        <StatCard title="Avg Fulfillment" value="83.4%" subtitle="Past 30 days" icon={<Target size={18} />} color="green" />
        <StatCard title="Prediction Acc." value="94.2%" subtitle="Model accuracy" icon={<Brain size={18} />} color="cyan" />
        <StatCard title="SOS Response" value="4.2 min" subtitle="Avg donor ETA" icon={<Zap size={18} />} color="red" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 glass-panel rounded-[var(--radius-lg)] p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={[
              'flex items-center gap-1.5 px-4 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold transition-all',
              activeTab === t.id
                ? 'bg-[var(--blue)] text-white shadow'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/20',
            ].join(' ')}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Turnout Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-panel rounded-[var(--radius-xl)] p-6 space-y-5">
            <h3 className="font-bold text-[var(--text)] flex items-center gap-2">
              <Sliders size={16} className="text-[var(--cyan)]" />
              Scenario Parameters
            </h3>

            {([
              { key: 'baseTurnout', label: 'Base Turnout Rate', icon: <Users size={13} />, unit: '%' },
              { key: 'weather', label: 'Weather Favourability', icon: <Sun size={13} />, unit: '%' },
              { key: 'volunteers', label: 'Volunteer Density', icon: <Activity size={13} />, unit: '%' },
              { key: 'emergency', label: 'Emergency Priority Multiplier', icon: <AlertTriangle size={13} />, unit: '%' },
            ] as const).map(({ key, label, icon, unit }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1">
                    {icon}{label}
                  </label>
                  <span className="text-sm font-bold text-[var(--blue)]">{scenario[key]}{unit}</span>
                </div>
                <input
                  type="range" min={0} max={100} value={scenario[key]}
                  onChange={(e: any) => setScenario(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  className="w-full accent-[var(--blue)]"
                />
              </div>
            ))}

            <Button onClick={runSimulation} className="w-full" disabled={loading}>
              {loading ? <><RefreshCw size={14} className="animate-spin" /> Running...</> : <><Zap size={14} /> Run Simulation</>}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="glass-panel rounded-[var(--radius-xl)] p-6 text-center">
              <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-semibold mb-2">Predicted Turnout</p>
              <div className={`text-6xl font-black mb-2 transition-all ${loading ? 'opacity-30 blur-sm' : ''}`}
                style={{ color: 'var(--blue)' }}>
                {loading ? '...' : prediction}
              </div>
              <p className="text-sm text-[var(--muted)]">donors expected</p>
              <div className="mt-4 flex justify-center gap-4 text-xs text-[var(--muted)]">
                <span>Low: <strong className="text-[var(--text)]">{confidence.low}</strong></span>
                <span>High: <strong className="text-[var(--text)]">{confidence.high}</strong></span>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>Confidence Interval</span>
                  <span>{confidence.low} – {confidence.high}</span>
                </div>
                <ProgressBar value={Math.min(Math.round((prediction / 600) * 100), 100)} />
              </div>
            </div>

            <div className="glass-panel rounded-[var(--radius-xl)] p-5">
              <h4 className="font-bold text-[var(--text)] text-sm mb-3">AI Recommendations</h4>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                {scenario.weather < 50 && (
                  <li className="flex gap-2"><CloudRain size={13} className="text-[var(--blue)] shrink-0 mt-0.5" />
                    Poor weather forecast detected. Consider indoor venue or reschedule.</li>
                )}
                {scenario.volunteers < 40 && (
                  <li className="flex gap-2"><Users size={13} className="text-[var(--red)] shrink-0 mt-0.5" />
                    Low volunteer density. Recruit at least 15% more volunteers for efficient flow.</li>
                )}
                {scenario.emergency > 70 && (
                  <li className="flex gap-2"><AlertTriangle size={13} className="text-[var(--red)] shrink-0 mt-0.5" />
                    High emergency multiplier — prioritise O- and AB- blood group donors.</li>
                )}
                {prediction > 350 && (
                  <li className="flex gap-2"><Target size={13} className="text-[var(--green)] shrink-0 mt-0.5" />
                    Strong turnout predicted. Ensure adequate seating and refreshments for donors.</li>
                )}
                <li className="flex gap-2"><Zap size={13} className="text-[var(--cyan)] shrink-0 mt-0.5" />
                  Send WhatsApp reminders 24h before event to improve show-up rate by ~18%.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Smart Search */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals, blood banks, camps…"
                className="w-full pl-9 pr-4 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--blue)]"
              />
            </div>
            <select
              value={filterBlood} onChange={(e: any) => setFilterBlood(e.target.value)}
              className="px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <select
              value={filterType} onChange={(e: any) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Blood Bank">Blood Bank</option>
              <option value="Hospital">Hospital</option>
              <option value="HLA Centre">HLA Centre</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredSearch.map(item => (
              <div key={item.id} className="glass-panel rounded-[var(--radius-xl)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-[var(--text)] text-sm">{item.name}</h3>
                    <Badge variant={item.available ? 'green' : 'default'}>{item.available ? 'Available' : 'Busy'}</Badge>
                    <Badge variant="default">{item.type}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                    <span className="flex items-center gap-1"><MapPin size={11} />{item.city} · {item.distance}</span>
                    <span className="flex items-center gap-1"><Activity size={11} />{item.units} units available</span>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {item.blood.map(bg => <Badge key={bg} variant="blue">{bg}</Badge>)}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm">
                    <MapPin size={12} /> Directions
                  </Button>
                  <Button size="sm">
                    <Activity size={12} /> Request
                  </Button>
                </div>
              </div>
            ))}
            {filteredSearch.length === 0 && (
              <div className="text-center py-12 text-[var(--muted)]">
                <Search size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No results found</p>
                <p className="text-xs mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-5">
          <div className="glass-panel rounded-[var(--radius-xl)] p-6">
            <h3 className="font-bold text-[var(--text)] mb-5 flex items-center gap-2">
              <BarChart2 size={16} className="text-[var(--blue)]" />
              Units Collected (Last 6 Months)
            </h3>
            <div className="flex items-end gap-3 h-40">
              {TREND_DATA.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[var(--muted)] font-semibold">{d.units.toLocaleString()}</span>
                  <div
                    className="w-full rounded-t-[var(--radius-sm)] bg-gradient-to-t from-[var(--blue)] to-[var(--cyan)] transition-all duration-700"
                    style={{ height: `${(d.units / maxUnits) * 100}%`, minHeight: 8 }}
                  />
                  <span className="text-[10px] text-[var(--muted)]">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-panel rounded-[var(--radius-xl)] p-5">
              <h4 className="font-bold text-[var(--text)] text-sm mb-4">Blood Group Demand</h4>
              <div className="space-y-2">
                {[
                  { group: 'O+', demand: 92 }, { group: 'A+', demand: 78 },
                  { group: 'B+', demand: 65 }, { group: 'O-', demand: 88 },
                  { group: 'AB+', demand: 42 }, { group: 'B-', demand: 55 },
                ].map(({ group, demand }) => (
                  <div key={group} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[var(--text)] w-8">{group}</span>
                    <div className="flex-1"><ProgressBar value={demand} color={demand > 80 ? 'red' : 'blue'} /></div>
                    <span className="text-xs text-[var(--muted)] w-8 text-right">{demand}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[var(--radius-xl)] p-5">
              <h4 className="font-bold text-[var(--text)] text-sm mb-4">Top Cities by Activity</h4>
              <div className="space-y-3">
                {[
                  { city: 'Mumbai', donors: 6240, camps: 18 },
                  { city: 'Pune', donors: 4180, camps: 12 },
                  { city: 'Delhi', donors: 3820, camps: 14 },
                  { city: 'Bengaluru', donors: 3100, camps: 9 },
                  { city: 'Hyderabad', donors: 2890, camps: 8 },
                ].map((c, i) => (
                  <div key={c.city} className="flex items-center gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[var(--blue)]/20 text-[var(--blue)] flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="text-[var(--text)] font-semibold flex-1">{c.city}</span>
                    <span className="text-[var(--muted)]">{c.donors.toLocaleString()} donors</span>
                    <Badge variant="default">{c.camps} camps</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
