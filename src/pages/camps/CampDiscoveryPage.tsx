import React, { useEffect, useState } from 'react';
import { Search, MapPin, Tent, Calendar, Clock, ArrowRight, Activity, Zap, CheckCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CampService } from '../../services/camps';
import type { Camp } from '../../types';
import { ProgressBar } from '../../components/ui/Tabs';
import { CampRegistrationWizard } from '../../components/forms/CampRegistrationWizard';
import { CampDetailsModal } from './CampDetailsModal';
import { LeafletMap } from '../../components/maps/LeafletMap';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function CampDiscoveryPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [registeringCamp, setRegisteringCamp] = useState<any | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    void CampService.getAllCamps()
      .then(setCamps)
      .catch(error => setLoadError(error instanceof Error ? error.message : 'Camps could not be loaded.'));
  }, []);

  const filteredCamps = camps.filter(camp => {
    const q = searchQuery.toLowerCase();
    const matchSearch = camp.name.toLowerCase().includes(q) || camp.city.toLowerCase().includes(q) || camp.organisation.toLowerCase().includes(q);
    const matchBlood = !bloodFilter || camp.bloodGroups.includes(bloodFilter) || camp.bloodGroups.includes('All');
    const matchStatus = !statusFilter || camp.status === statusFilter;
    return matchSearch && matchBlood && matchStatus;
  });

  return (
    <div className="space-y-6">
      {registeringCamp && (
        <CampRegistrationWizard camp={registeringCamp} onClose={() => setRegisteringCamp(null)} />
      )}
      <CampDetailsModal 
        isOpen={!!selectedCamp} 
        onClose={() => setSelectedCamp(null)} 
        camp={selectedCamp} 
        onRegister={() => {
          setRegisteringCamp(selectedCamp);
          setSelectedCamp(null);
        }} 
      />
      
      <div className="text-center max-w-2xl mx-auto py-4">
        <h1 className="text-3xl font-extrabold text-[var(--text)] mb-3">Discover Blood Camps</h1>
        <p className="text-[var(--text-secondary)]">Find and register for blood donation drives in your city. Your single donation can save up to 3 lives.</p>
      </div>

      {loadError && <p role="alert" className="text-center text-sm font-semibold text-[var(--red)]">{loadError}</p>}

      <div className="glass-panel rounded-[var(--radius-xl)] p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <input
            type="text"
            placeholder="Search by camp name, city, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--glass-border)] text-[var(--text)] focus:outline-none focus:border-[var(--blue)]"
          />
        </div>
        <select
          value={bloodFilter}
          onChange={(e) => setBloodFilter(e.target.value)}
          className="px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--glass-border)] text-[var(--text)] focus:outline-none focus:border-[var(--blue)]"
        >
          <option value="">All Blood Groups</option>
          {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--glass-border)] text-[var(--text)] focus:outline-none focus:border-[var(--blue)]"
        >
          <option value="">All Statuses</option>
          <option value="ongoing">Happening Now</option>
          <option value="upcoming">Upcoming</option>
        </select>
        
        <div className="flex bg-[var(--bg)] rounded-[var(--radius-md)] border border-[var(--glass-border)] overflow-hidden shrink-0">
          <button 
            className={`px-4 py-2 text-sm font-semibold transition-colors ${viewMode === 'grid' ? 'bg-[var(--blue)] text-white' : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button 
            className={`px-4 py-2 text-sm font-semibold transition-colors border-l border-[var(--glass-border)] ${viewMode === 'map' ? 'bg-[var(--blue)] text-white' : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'}`}
            onClick={() => setViewMode('map')}
          >
            Map
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="h-[600px] w-full">
          <LeafletMap 
            center={filteredCamps[0]?.coordinates ?? { lat: 21.1458, lng: 79.0882 }}
            zoom={11}
            locations={filteredCamps.map(c => ({
              id: c.id,
              name: c.name,
              lat: c.coordinates.lat,
              lng: c.coordinates.lng,
              type: 'camp',
              details: `${c.registered} / ${c.target} registered`
            }))}
            onMarkerClick={(loc) => {
              const camp = filteredCamps.find(c => c.id === loc.id);
              if (camp) setSelectedCamp(camp);
            }}
            className="h-full"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCamps.map(camp => (
          <div key={camp.id} className="glass-panel rounded-[var(--radius-xl)] overflow-hidden flex flex-col hover:border-[var(--blue)] transition-colors duration-300">
            <div className="p-5 border-b border-[var(--glass-border)] flex-1">
              <div className="flex justify-between items-start mb-3">
                <Badge variant={camp.status === 'ongoing' ? 'green' : 'blue'}>
                  {camp.status === 'ongoing' ? 'Happening Now' : 'Upcoming'}
                </Badge>
                {camp.emergency && <Badge variant="red" className="animate-pulse">High Priority</Badge>}
              </div>
              <h3 className="text-xl font-bold text-[var(--text)] mb-1">{camp.name}</h3>
              <p className="text-sm font-semibold text-[var(--blue)] mb-4">{camp.organisation}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--muted)]" />
                  <span>{camp.venue}, {camp.city} <span className="text-[var(--blue)] font-medium">({camp.distance})</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Calendar size={16} className="shrink-0 text-[var(--muted)]" />
                  <span>{camp.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Clock size={16} className="shrink-0 text-[var(--muted)]" />
                  <span>{camp.time}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--text)]">{camp.registered} / {camp.target} Registered</span>
                  <span className="text-[var(--muted)]">{Math.round((camp.registered / camp.target) * 100)}%</span>
                </div>
                <ProgressBar value={Math.round((camp.registered / camp.target) * 100)} color={camp.emergency ? 'red' : 'blue'} />
              </div>
            </div>
            
            <div className="p-5 bg-[var(--glass)] flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">Required Blood Groups</p>
                <div className="flex flex-wrap gap-1.5">
                  {camp.bloodGroups.map((bg: string) => (
                    <Badge key={bg} variant="default" className="text-xs font-bold">{bg}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  className="flex-1 text-xs px-2"
                  onClick={() => setSelectedCamp(camp)}
                >
                  View Details
                </Button>
                <Button 
                  className="flex-1 text-xs px-2 group" 
                  onClick={() => setRegisteringCamp(camp)}
                >
                  <span>Register</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!loadError && filteredCamps.length === 0 && <p className="col-span-full py-12 text-center text-sm text-[var(--muted)]">No camps have been saved yet.</p>}
      </div>
      )}
    </div>
  );
}
