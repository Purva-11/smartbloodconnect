import React, { useState } from 'react';
import {
  ArrowRight, AlertTriangle, Tent, Droplets, Activity,
  Users, TrendingUp, MapPin, Clock, ChevronRight, Zap
} from 'lucide-react';
import { StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/Tabs';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { initialCamps, initialEmergencies } from '../../data/mockData';

interface OverviewPageProps {
  onNavigate: (s: string) => void;
}

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [networkPulse] = useState({ active: 18426, responding: 2814, emergency: 27 });

  const ongoingCamps = initialCamps.filter(c => c.status === 'ongoing');
  const upcomingCamps = initialCamps.filter(c => c.status === 'upcoming').slice(0, 3);
  const activeEmergencies = initialEmergencies.filter(e => e.status === 'active');

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[var(--muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
              NATIONAL BLOOD MOBILISATION NETWORK
            </span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-[var(--text)] leading-tight mb-4">
            {t('heroTitle').split('for every').map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-[var(--blue)]">for every donation.</span>}
                {i === 0 && part}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-lg">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={() => onNavigate('camps')} className="shadow-lg shadow-blue-500/20">
              Find Blood Camps <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => onNavigate('emergency')}>
              Request Blood
            </Button>
          </div>
        </div>

        {/* Network Pulse Widget */}
        <div className="glass-panel-strong rounded-[var(--radius-xl)] p-6 relative overflow-hidden border border-[var(--glass-border)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blue)]/10 rounded-full blur-3xl" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-bold text-[var(--text)] flex items-center gap-2">
              <Activity size={18} className="text-[var(--blue)]" />
              Network Pulse
            </h3>
            <Badge variant="green" className="animate-pulse">Live</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)]">
              <p className="text-3xl font-black text-[var(--text)] tracking-tight">{networkPulse.active.toLocaleString()}</p>
              <p className="text-xs text-[var(--muted)] mt-1 font-semibold">Active Donors</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)]">
              <p className="text-3xl font-black text-[var(--blue)] tracking-tight">{networkPulse.responding.toLocaleString()}</p>
              <p className="text-xs text-[var(--muted)] mt-1 font-semibold">Currently Responding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      {activeEmergencies.length > 0 && (
        <div className="glass-panel border-l-4 border-[var(--red)] rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gradient-to-r from-[var(--red)]/10 to-transparent">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <AlertTriangle className="text-[var(--red)]" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] flex items-center gap-2">
                Emergency Alerts in Your Area
                <Badge variant="red" className="animate-pulse">{activeEmergencies.length} Active</Badge>
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Patients urgently need <span className="font-bold text-[var(--red)]">{activeEmergencies.map(e => e.bloodGroup).join(', ')}</span> blood. 
                Your contribution can save a life right now.
              </p>
            </div>
          </div>
          <Button variant="danger" className="shrink-0 w-full sm:w-auto" onClick={() => onNavigate('emergency')}>
            Respond Now <Zap size={14} />
          </Button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col - Stats & Ongoing Camps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <StatCard
              title="Donations This Month"
              value="4,281"
              subtitle="+12% from last month"
              icon={<TrendingUp size={20} />}
              color="green"
            />
            <StatCard
              title="Lives Saved"
              value="12,843"
              subtitle="Estimated total"
              icon={<Users size={20} />}
              color="blue"
            />
          </div>

          <div className="glass-panel rounded-[var(--radius-xl)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
                <Tent className="text-[var(--blue)]" size={20} />
                Ongoing Drives Near You
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('camps')}>View All</Button>
            </div>
            
            <div className="space-y-4">
              {ongoingCamps.map(camp => (
                <div key={camp.id} className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] hover:bg-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-bold text-[var(--text)] mb-1">{camp.name}</h4>
                      <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                        <MapPin size={12} /> {camp.venue}, {camp.city} <span className="mx-1">•</span> {camp.distance}
                      </p>
                    </div>
                    <Badge variant="green" className="w-fit self-start shrink-0">Happening Now</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[var(--text)]">{camp.registered} Donors</span>
                      <span className="text-[var(--muted)]">Target: {camp.target}</span>
                    </div>
                    <ProgressBar value={Math.round((camp.registered / camp.target) * 100)} color="blue" />
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--glass-border)]">
                    <div className="flex gap-1.5 flex-wrap">
                      {camp.bloodGroups.map(bg => (
                        <span key={bg} className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--bg)] text-[var(--text-secondary)] border border-[var(--glass-border)]">
                          {bg}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => onNavigate('camps')}>
                      Join Drive
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - Upcoming & Quick Actions */}
        <div className="space-y-6">
          <div className="glass-panel rounded-[var(--radius-xl)] p-6">
            <h3 className="font-bold text-[var(--text)] mb-4">Upcoming Schedule</h3>
            <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-[var(--glass-border)]">
              {upcomingCamps.map((camp, i) => (
                <div key={camp.id} className="relative pl-8">
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-[var(--bg)] ${i === 0 ? 'bg-[var(--blue)]' : 'bg-[var(--glass-border)]'} flex items-center justify-center`}>
                    {i === 0 && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <h4 className="font-bold text-sm text-[var(--text)] mb-0.5">{camp.name}</h4>
                  <p className="text-xs text-[var(--muted)] flex items-center gap-1 mb-2">
                    <Clock size={11} /> {camp.date} • {camp.time}
                  </p>
                  <p className="text-xs font-medium text-[var(--text-secondary)] line-clamp-1">{camp.location}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs">
              View Calendar <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
