import React, { useEffect, useState } from 'react';
import {
  AlertTriangle, Zap, MapPin, Phone, Clock, Users, Crosshair,
  ChevronDown, Send, Radio, Activity, Plus, X, CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import type { EmergencyRequest } from '../../types';
import { LeafletMap } from '../../components/maps/LeafletMap';
import { sendEmergencyDonorEmails } from '../../services/notifications';
import { EmergencyService } from '../../services/emergency';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_OPTIONS = [
  { value: 'critical', label: 'Critical', color: 'red' },
  { value: 'high', label: 'High', color: 'red' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
] as const;

export function EmergencySOSPage() {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailDeliveryMessage, setEmailDeliveryMessage] = useState('');

  // Form state
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [urgency, setUrgency] = useState<'critical' | 'high' | 'medium'>('high');
  const [contactPhone, setContactPhone] = useState('');
  const [radius, setRadius] = useState(10);
  const [hospitalCoordinates, setHospitalCoordinates] = useState({ lat: 21.1458, lng: 79.0882 });
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    void EmergencyService.getAllRequests()
      .then(setEmergencies)
      .catch(error => setLoadError(error instanceof Error ? error.message : 'Emergency requests could not be loaded.'));
  }, []);

  const active = emergencies.filter(e => e.status === 'active');
  const fulfilled = emergencies.filter(e => e.status === 'fulfilled');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: EmergencyRequest = {
      id: `EM-${Date.now()}`,
      patientName,
      hospitalName,
      hospitalAddress,
      bloodGroup,
      unitsNeeded,
      urgency,
      contactPerson: user?.name ?? 'Anonymous',
      contactPhone,
      city: user?.city ?? 'Mumbai',
      coordinates: hospitalCoordinates,
      radiusKm: radius,
      reachableDonorsCount: Math.floor(radius * 18),
      respondedDonorsCount: 0,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    try {
      const savedRequest = await EmergencyService.broadcastSOS(newRequest);
      setEmergencies(prev => [savedRequest, ...prev]);
      setSubmitted(true);
      setEmailDeliveryMessage('Sending email alerts to matching donors...');
      try {
        const result = await sendEmergencyDonorEmails(savedRequest);
        setEmailDeliveryMessage(result.message);
      } catch (error) {
        setEmailDeliveryMessage(error instanceof Error ? error.message : 'Email alerts were not sent.');
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'The emergency request could not be saved.');
    }
  };

  const expandRadius = async (emergency: EmergencyRequest) => {
    const updates = {
      radiusKm: Math.min(emergency.radiusKm + 5, 50),
      reachableDonorsCount: emergency.reachableDonorsCount + Math.floor(Math.random() * 80 + 40),
    };
    try {
      const updated = await EmergencyService.updateRequest(emergency.id, updates);
      setEmergencies(prev => prev.map(item => item.id === emergency.id ? updated : item));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'The broadcast radius could not be updated.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)] flex items-center gap-2">
            <AlertTriangle size={22} className="text-[var(--red)]" />
            Emergency SOS
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Broadcast urgent blood requests and mobilise nearby donors instantly.
          </p>
        </div>
        <Button variant="danger" onClick={() => { setSubmitted(false); setSaveError(''); setEmailDeliveryMessage(''); setShowForm(true); }}>
          <Zap size={14} /> Create SOS Request
        </Button>
      </div>
      {loadError && <p role="alert" className="text-sm font-semibold text-[var(--red)]">{loadError}</p>}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active SOS" value={active.length.toString()} subtitle="Ongoing requests" icon={<Radio size={18} />} color="red" />
        <StatCard title="Fulfilled" value={fulfilled.length.toString()} subtitle="Resolved today" icon={<CheckCircle size={18} />} color="green" />
        <StatCard title="Avg Response" value="4.2 min" subtitle="Donor response time" icon={<Clock size={18} />} color="cyan" />
        <StatCard title="On-call Donors" value="2,814" subtitle="In your city" icon={<Users size={18} />} color="blue" />
      </div>

      {active.length > 0 && <section className="glass-panel rounded-[var(--radius-xl)] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <MapPin size={17} className="text-[var(--red)]" />
          <h2 className="font-bold text-[var(--text)]">Active hospital locations</h2>
        </div>
        <LeafletMap
          center={active[0].coordinates}
          zoom={11}
          emergencyRadius={active[0].radiusKm}
          locations={active.map(emergency => ({
            id: emergency.id,
            name: emergency.hospitalName,
            lat: emergency.coordinates.lat,
            lng: emergency.coordinates.lng,
            type: 'emergency',
            details: `${emergency.bloodGroup} · ${emergency.unitsNeeded} units · ${emergency.city}`,
            urgency: emergency.urgency,
          }))}
          className="h-[340px]"
        />
      </section>}

      {/* Create SOS Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-panel-strong rounded-[var(--radius-xl)] w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[var(--green)]/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-[var(--green)]" />
                </div>
                <h3 className="text-lg font-extrabold text-[var(--text)] mb-2">SOS Request Created</h3>
                <p className="text-sm text-[var(--muted)]">The request is active with the hospital map location attached.</p>
                <p role="status" className="mx-auto mt-3 max-w-sm text-sm font-semibold text-[var(--text)]">{emailDeliveryMessage}</p>
                <Button className="mt-5" onClick={() => { setShowForm(false); setSubmitted(false); }}>Done</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-extrabold text-[var(--text)] flex items-center gap-2">
                    <Zap size={18} className="text-[var(--red)]" />
                    New Emergency SOS
                  </h2>
                  <button onClick={() => setShowForm(false)} className="p-1.5 rounded-full hover:bg-[var(--glass)] text-[var(--muted)]">
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-[var(--muted)] block mb-1">Patient Name *</label>
                      <input
                        required value={patientName} onChange={(e: any) => setPatientName(e.target.value)}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--blue)]"
                        placeholder="Full name of patient"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-[var(--muted)] block mb-1">Hospital *</label>
                      <input
                        required value={hospitalName} onChange={(e: any) => setHospitalName(e.target.value)}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--blue)]"
                        placeholder="Hospital name"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-[var(--muted)] block mb-1">Hospital Address</label>
                      <input
                        value={hospitalAddress} onChange={(e: any) => setHospitalAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--blue)]"
                        placeholder="Full address"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-xs font-semibold text-[var(--muted)]">Hospital map location</label>
                        <button type="button" onClick={() => {
                          if (!navigator.geolocation) {
                            setLocationError('Location access is not available in this browser.');
                            return;
                          }
                          navigator.geolocation.getCurrentPosition(
                            position => {
                              setHospitalCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
                              setLocationError('');
                            },
                            () => setLocationError('Location permission was denied. Select the hospital on the map instead.'),
                            { enableHighAccuracy: true, timeout: 10000 },
                          );
                        }} className="inline-flex items-center gap-1 text-xs font-bold text-[var(--blue)] hover:underline">
                          <Crosshair size={13} /> Use my location
                        </button>
                      </div>
                      <div className="h-56 overflow-hidden rounded-[var(--radius-md)]">
                        <LeafletMap
                          center={hospitalCoordinates}
                          zoom={13}
                          locations={[{ id: 'hospital-location', name: hospitalName || 'Hospital location', lat: hospitalCoordinates.lat, lng: hospitalCoordinates.lng, type: 'hospital', details: hospitalAddress || 'Selected SOS location' }]}
                          onMapClick={setHospitalCoordinates}
                          className="h-full"
                        />
                      </div>
                      <p className="text-[11px] text-[var(--muted)]">Tap the map to set the exact hospital pin. {hospitalCoordinates.lat.toFixed(5)}, {hospitalCoordinates.lng.toFixed(5)}</p>
                      {locationError && <p className="text-xs text-[var(--red)]">{locationError}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--muted)] block mb-1">Blood Group *</label>
                      <select
                        value={bloodGroup} onChange={(e: any) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none"
                      >
                        {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--muted)] block mb-1">Units Needed *</label>
                      <input
                        type="number" min={1} max={20} value={unitsNeeded}
                        onChange={(e: any) => setUnitsNeeded(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--muted)] block mb-1">Urgency</label>
                      <select
                        value={urgency} onChange={(e: any) => setUrgency(e.target.value as typeof urgency)}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none"
                      >
                        {URGENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--muted)] block mb-1">Contact Phone *</label>
                      <input
                        required value={contactPhone} onChange={(e: any) => setContactPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)] focus:outline-none"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-[var(--muted)] block mb-1">
                        Broadcast Radius: <span className="text-[var(--blue)] font-bold">{radius} km</span>
                      </label>
                      <input
                        type="range" min={2} max={50} value={radius}
                        onChange={(e: any) => setRadius(Number(e.target.value))}
                        className="w-full accent-[var(--blue)]"
                      />
                      <p className="text-xs text-[var(--muted)] mt-1">~{Math.floor(radius * 18)} donors reachable</p>
                    </div>
                  </div>
                  {saveError && <p role="alert" className="text-sm font-semibold text-[var(--red)]">{saveError}</p>}
                  <div className="flex gap-3 pt-2">
                    <Button variant="ghost" type="button" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                    <Button variant="danger" type="submit" className="flex-1">
                      <Send size={14} /> Broadcast SOS
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Active Emergencies */}
      <div>
        <h2 className="text-lg font-bold text-[var(--text)] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--red)] animate-pulse" />
          Active Emergency Requests ({active.length})
        </h2>
        <div className="space-y-4">
          {active.map(em => (
            <div key={em.id} className="glass-panel rounded-[var(--radius-xl)] p-5 border border-[var(--red)]/30">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-[var(--text)]">{em.patientName}</h3>
                    <Badge variant="red">{em.urgency.toUpperCase()}</Badge>
                    <Badge variant="blue">{em.bloodGroup}</Badge>
                    <span className="text-xs text-[var(--muted)] font-mono">{em.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                    <span className="flex items-center gap-1"><MapPin size={11} />{em.hospitalName}, {em.city}</span>
                    <span className="flex items-center gap-1"><Activity size={11} />{em.unitsNeeded} units needed</span>
                    <span className="flex items-center gap-1"><Phone size={11} />{em.contactPhone}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{new Date(em.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => void expandRadius(em)}>
                    <Plus size={12} /> Expand Radius
                  </Button>
                  <Button variant="danger" size="sm">
                    <Phone size={12} /> Call
                  </Button>
                </div>
              </div>

              {/* Radius & Donor Info */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-[var(--glass)] rounded-[var(--radius-md)] p-3 text-center">
                  <p className="text-lg font-extrabold text-[var(--blue)]">{em.radiusKm} km</p>
                  <p className="text-xs text-[var(--muted)]">Broadcast radius</p>
                </div>
                <div className="bg-[var(--glass)] rounded-[var(--radius-md)] p-3 text-center">
                  <p className="text-lg font-extrabold text-[var(--text)]">{em.reachableDonorsCount}</p>
                  <p className="text-xs text-[var(--muted)]">Donors alerted</p>
                </div>
                <div className="bg-[var(--glass)] rounded-[var(--radius-md)] p-3 text-center">
                  <p className="text-lg font-extrabold text-[var(--green)]">{em.respondedDonorsCount}</p>
                  <p className="text-xs text-[var(--muted)]">Responded</p>
                </div>
              </div>
            </div>
          ))}
          {active.length === 0 && (
            <div className="text-center py-12 text-[var(--muted)]">
              <CheckCircle size={40} className="mx-auto mb-3 text-[var(--green)] opacity-50" />
              <p className="font-semibold">No active emergencies</p>
              <p className="text-xs mt-1">All requests have been fulfilled.</p>
            </div>
          )}
        </div>
      </div>

      {/* Fulfilled */}
      {fulfilled.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[var(--text)] mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-[var(--green)]" />
            Recently Fulfilled ({fulfilled.length})
          </h2>
          <div className="space-y-3">
            {fulfilled.map(em => (
              <div key={em.id} className="glass-panel rounded-[var(--radius-xl)] p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[var(--text)] text-sm">{em.patientName}</span>
                    <span className="text-xs text-[var(--muted)] ml-2">— {em.hospitalName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="blue">{em.bloodGroup}</Badge>
                    <Badge variant="green">Fulfilled</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
