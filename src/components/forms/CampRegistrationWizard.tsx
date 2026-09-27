import React, { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, User2, MessageSquare, Shield, ClipboardCheck, PartyPopper } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RegistrationService } from '../../services/registrations';
import { QRPassModal } from '../qr/QRPassModal';
import { Input, ToggleSwitch } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Camp, Registration } from '../../types';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface Props {
  camp: Camp;
  onClose: () => void;
}

const STEPS = [
  { id: 1, label: 'Participant Info', icon: <User2 size={14} /> },
  { id: 2, label: 'Communication', icon: <MessageSquare size={14} /> },
  { id: 3, label: 'Consent', icon: <Shield size={14} /> },
  { id: 4, label: 'Pre-check', icon: <ClipboardCheck size={14} /> },
  { id: 5, label: 'Confirmed', icon: <PartyPopper size={14} /> },
];

const TIME_SLOTS = ['08:00 AM – 09:30 AM', '09:30 AM – 11:00 AM', '11:00 AM – 12:30 PM', '01:00 PM – 02:30 PM', '02:30 PM – 04:00 PM'];

export function CampRegistrationWizard({ camp, onClose }: Props) {
  const { user, myRegistrations, addRegistration } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [blood, setBlood] = useState(user?.bloodGroup ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [slot, setSlot] = useState(TIME_SLOTS[1]);
  const [whatsapp, setWhatsapp] = useState(true);
  const [sms, setSms] = useState(false);
  const [emergencyOptIn, setEmergencyOptIn] = useState(true);
  const [consent, setConsent] = useState(false);
  const [futureConsent, setFutureConsent] = useState(false);
  const [preChecks, setPreChecks] = useState({
    age: false, weight: false, noIllness: false, noSurgery: false, id: false,
  });
  const [ticketId, setTicketId] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [token, setToken] = useState('');

  // Check duplicate
  const isDuplicate = myRegistrations.some(r => r.campId === camp.id && r.status !== 'Cancelled');

  const allPreChecks = Object.values(preChecks).every(Boolean);

  const handleNext = async () => {
    if (step === 4) {
      // Submit
      setLoading(true);
      const regResponse = await RegistrationService.registerForCamp(user?.id || 'USR-GUEST', camp.id, {
        name, email, phone, blood, city, campName: camp.name, preferredTimeSlot: slot,
      });
      setTicketId(regResponse.id);
      setToken(regResponse.token);
      
      const reg: Registration = {
        id: regResponse.id,
          campId: camp.id,
          campName: camp.name,
          userId: user?.id ?? 'USR-GUEST',
          userName: name,
          userEmail: email,
          userPhone: phone,
          bloodGroup: blood,
          city,
          registrationDate: new Date().toISOString(),
          status: 'Registered',
          preferredTimeSlot: slot,
          consentGiven: consent,
          emergencyAlertOptIn: emergencyOptIn,
          qrCodeToken: regResponse.token || `TOKEN-${regResponse.id}-${blood.replace('+', 'POS').replace('-', 'NEG')}`,
        };
        addRegistration(reg);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#2563eb', '#06d9ff', '#10b981'] });
        setLoading(false);
        setStep(5);
    } else {
      setStep(s => s + 1);
    }
  };

  if (isDuplicate && step < 5) {
    return (
      <Modal open onClose={onClose} title="Already Registered" size="sm">
        <div className="text-center space-y-4 py-4">
          <CheckCircle size={48} className="mx-auto text-[var(--green)]" />
          <p className="text-sm text-[var(--text-secondary)]">You are already registered for <strong>{camp.name}</strong>. Check your Digital Pass in Donor Space.</p>
          <Button variant="primary" wide onClick={onClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title={`Register — ${camp.name}`} size="lg">
      {/* Stepper */}
      <div className="flex items-center gap-0 mb-7 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-full text-xs font-semibold transition-all ${step >= s.id ? 'text-[var(--blue)]' : 'text-[var(--muted)]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step > s.id ? 'bg-[var(--green)] text-white' : step === s.id ? 'bg-[var(--blue)] text-white' : 'bg-[var(--glass-border)] text-[var(--muted)]'}`}>
                {step > s.id ? '✓' : s.id}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px min-w-[16px] ${step > s.id ? 'bg-[var(--blue)]' : 'bg-[var(--glass-border)]'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Participant Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-bold text-[var(--text)]">Participant Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name *" value={name} onChange={e => setName(e.target.value)} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--text)]">Blood Group *</label>
              <select
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--glass)] backdrop-blur border border-[var(--glass-border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/50"
                value={blood}
                onChange={e => setBlood(e.target.value)}
              >
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--text)]">Preferred Time Slot</label>
              <select
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--glass)] backdrop-blur border border-[var(--glass-border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/50"
                value={slot}
                onChange={e => setSlot(e.target.value)}
              >
                {TIME_SLOTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Communication */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-bold text-[var(--text)]">Communication Preferences</h3>
          <p className="text-xs text-[var(--muted)]">Choose how BloodConnect should keep you informed about this camp and related updates.</p>
          <div className="space-y-4">
            <ToggleSwitch checked={whatsapp} onChange={setWhatsapp} label="WhatsApp Notifications" description="Receive your QR pass, reminders and camp updates via WhatsApp" />
            <ToggleSwitch checked={sms} onChange={setSms} label="SMS Direct Alerts" description="Get essential check-in reminders via SMS" />
            <ToggleSwitch checked={emergencyOptIn} onChange={setEmergencyOptIn} label="Emergency Alert Opt-in" description="Allow BloodConnect to contact you for urgent blood mobilisation requests matching your blood group" />
          </div>
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--blue)]/5 border border-[var(--blue)]/20 text-xs text-[var(--text-secondary)]">
            ℹ You can update these preferences at any time from your Consent & Privacy Centre.
          </div>
        </div>
      )}

      {/* Step 3: Consent */}
      {step === 3 && (
        <div className="space-y-5">
          <h3 className="font-bold text-[var(--text)]">Consent Confirmation</h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-white/30 transition-all">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--blue)] w-4 h-4" />
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">I consent to participate in <em>{camp.name}</em></p>
                <p className="text-xs text-[var(--muted)] mt-1">I confirm that I am registering on my own behalf, that the information provided is accurate, and that I understand basic eligibility requirements for blood donation.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-white/30 transition-all">
              <input type="checkbox" checked={futureConsent} onChange={e => setFutureConsent(e.target.checked)} className="mt-0.5 accent-[var(--blue)] w-4 h-4" />
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Future Drive Participation (Optional)</p>
                <p className="text-xs text-[var(--muted)] mt-1">Allow <strong>{camp.organisation}</strong> to contact me about future donation drives and health awareness campaigns.</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Pre-check */}
      {step === 4 && (
        <div className="space-y-5">
          <h3 className="font-bold text-[var(--text)]">Administrative Pre-check</h3>
          <p className="text-xs text-[var(--muted)]">Please confirm you meet these criteria. This is a self-declaration — not a medical assessment.</p>
          <div className="space-y-3">
            {([
              ['age', 'I am between 18 and 65 years of age'],
              ['weight', 'My body weight is at least 45 kg'],
              ['noIllness', 'I have not had a fever, cold or active infection in the last 7 days'],
              ['noSurgery', 'I have not undergone a surgical procedure in the last 6 months'],
              ['id', 'I will bring a valid government photo ID to the camp'],
            ] as [keyof typeof preChecks, string][]).map(([key, label]) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer p-3 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-white/20 transition-all">
                <input type="checkbox" checked={preChecks[key]} onChange={e => setPreChecks(p => ({ ...p, [key]: e.target.checked }))} className="mt-0.5 accent-[var(--green)] w-4 h-4" />
                <span className="text-sm text-[var(--text)]">{label}</span>
              </label>
            ))}
          </div>
          {!allPreChecks && (
            <p className="text-xs text-[var(--amber)]">⚠ Please confirm all pre-check items to continue.</p>
          )}
        </div>
      )}

      {/* Step 5: Success */}
      {step === 5 && (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 rounded-full bg-[var(--green)]/15 border-2 border-[var(--green)] flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-[var(--green)]" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[var(--text)] mb-2">You're registered!</h3>
            <p className="text-sm text-[var(--text-secondary)]">Your donation pass for <strong>{camp.name}</strong> has been created.</p>
          </div>
          <div className="glass-card p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Ticket ID</span>
              <span className="font-extrabold text-[var(--blue)]">{ticketId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Time Slot</span>
              <span className="font-semibold text-[var(--text)]">{slot}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Blood Group</span>
              <span className="font-extrabold text-[var(--red)]">{blood}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>Close</Button>
            <Button variant="primary" size="md" className="flex-1" onClick={() => setShowQRModal(true)}>
              View Digital Pass
            </Button>
          </div>
        </div>
      )}

      {/* QR Pass Modal */}
      {showQRModal && (
        <QRPassModal 
          isOpen={showQRModal}
          onClose={() => { setShowQRModal(false); onClose(); }}
          pass={{
            id: ticketId,
            token,
            campName: camp.name,
            date: camp.date,
            time: slot,
            venue: camp.venue,
            status: 'Registered',
            participantName: name,
            bloodGroup: blood
          }}
        />
      )}

      {/* Navigation */}
      {step < 5 && (
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--glass-border)]">
          <Button
            variant="ghost"
            size="sm"
            icon={<ChevronLeft size={14} />}
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="md"
            iconRight={step < 4 ? <ChevronRight size={14} /> : undefined}
            onClick={handleNext}
            loading={loading}
            disabled={
              (step === 1 && (!name || !blood)) ||
              (step === 3 && !consent) ||
              (step === 4 && !allPreChecks)
            }
          >
            {step === 4 ? 'Confirm Registration' : 'Continue'}
          </Button>
        </div>
      )}
    </Modal>
  );
}
