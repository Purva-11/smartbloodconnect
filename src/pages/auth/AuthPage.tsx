import React, { useState } from 'react';
import { Building2, User2, ArrowRight, Droplets } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ORG_TYPES = [
  { value: 'ngo', label: 'NGO / Non-Profit' },
  { value: 'blood_bank', label: 'Blood Bank' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'college', label: 'College / University' },
  { value: 'corporate', label: 'Corporate CSR' },
];

export function AuthPage() {
  const { login } = useAuth();
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('individual');
  const [userType, setUserType] = useState<'donor' | 'receiver'>('donor');
  const [formMode, setFormMode] = useState<'signin' | 'signup'>('signin');
  const [showAuth, setShowAuth] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [blood, setBlood] = useState('O+');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [hlaType, setHlaType] = useState('');
  const [idProofName, setIdProofName] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const addressParts = address.split(',').map(part => part.trim()).filter(Boolean);
      const details = {
        role: accountType,
        userType,
        name,
        email,
        phone,
        age: accountType === 'individual' ? Number(age) : undefined,
        bloodGroup: blood,
        address,
        location: address,
        city: addressParts.length > 1 ? addressParts[addressParts.length - 2] : address,
        hlaType: hlaType || undefined,
        idProofName,
        organizationName: accountType === 'organization' ? name : undefined,
      } as const;
      const session = formMode === 'signup'
        ? await AuthService.register(details, password)
        : await AuthService.login(email, password);
      setPassword('');
      login(session);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'individual', label: 'Individual', icon: <User2 size={14} /> },
    { id: 'organization', label: 'Organization', icon: <Building2 size={14} /> },
  ];

  if (!showAuth) {
    return (
      <div className="min-h-screen bg-[#f6f8f5] text-[#172721]">
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-10">
          <a href="#top" className="flex items-center gap-2 text-lg font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d84343] text-white"><Droplets size={19} /></span>
            <span>Blood<span className="text-[#ffb3a7]">Connect</span></span>
          </a>
          <button onClick={() => setShowAuth(true)} className="rounded-full border border-white/60 px-5 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#172721]">Sign in</button>
        </header>

        <main id="top">
          <section className="relative flex min-h-[680px] items-end overflow-hidden bg-[#172721] px-6 pb-16 pt-28 sm:min-h-[740px] sm:px-12 sm:pb-20 lg:px-20">
            <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=2200&q=85" alt="Blood donation supplies ready for a community drive" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-[#0d1a17]/65" />
            <div className="relative z-10 max-w-3xl animate-[rise-in_700ms_ease-out_both]">
              <p className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.22em] text-[#ffb3a7]"><span className="h-px w-8 bg-[#ffb3a7]" />A faster path from need to help</p>
              <h1 className="max-w-3xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">Every minute matters. Every donor counts.</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">BloodConnect brings donors, hospitals and community camps together to move blood where it is needed, when it is needed.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button onClick={() => { setShowAuth(true); setFormMode('signup'); }} className="rounded-full bg-[#d84343] px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#bf3437]">Join the network <ArrowRight size={16} className="ml-2 inline" /></button>
                <a href="#how-it-works" className="rounded-full border border-white/50 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Explore the platform</a>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-9 gap-y-4 border-t border-white/25 pt-6 text-sm text-white/80">
                <span><strong className="text-white">Emergency SOS</strong> with hospital location</span>
                <span><strong className="text-white">Nearby camps</strong> on a live map</span>
                <span><strong className="text-white">QR check-in</strong> for camp attendance</span>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:py-24">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#c14443]">One connected response</p><h2 className="mt-3 max-w-xl text-3xl font-black leading-tight sm:text-4xl">A clearer route from the first alert to the final check-in.</h2></div>
              <p className="max-w-md text-sm leading-6 text-[#53645d]">Coordinate urgent requests, discover nearby donation camps and keep every participant informed in one place.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { image: 'photo-1576091160399-112ba8d25d1d', label: '01 / RESPOND', title: 'Reach matching donors', text: 'Urgent requests carry blood group, hospital details and a map pin to help nearby donors act quickly.' },
                { image: 'photo-1532938911079-1b06ac7ceec7', label: '02 / DISCOVER', title: 'Find a camp nearby', text: 'Explore community drives on a map, see what groups are needed and reserve a place.' },
                { image: 'photo-1584515933487-779824d29309', label: '03 / CHECK IN', title: 'Make attendance count', text: 'Give registered participants a digital QR pass and let camp teams confirm attendance by scan.' },
              ].map(item => (
                <article key={item.label} className="group">
                  <div className="aspect-[5/3] overflow-hidden bg-[#e0e7e2]"><img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=80`} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" /></div>
                  <p className="mt-5 text-[11px] font-extrabold tracking-[0.2em] text-[#c14443]">{item.label}</p>
                  <h3 className="mt-2 text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#53645d]">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-16 flex flex-col items-start justify-between gap-6 border-y border-[#d8e0da] py-8 sm:flex-row sm:items-center">
              <div><p className="text-2xl font-black">Local action. Connected care.</p><p className="mt-1 text-sm text-[#53645d]">For individual donors, recipients, hospitals and community organizations.</p></div>
              <button onClick={() => { setShowAuth(true); setFormMode('signup'); }} className="rounded-full bg-[#172721] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#30463d]">Create your account <ArrowRight size={15} className="ml-2 inline" /></button>
            </div>
          </section>
        </main>
        <footer className="border-t border-[#d8e0da] px-6 py-6 text-center text-xs text-[#64756d]">BloodConnect · Connecting people to lifesaving blood donation</footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative z-10 max-w-xl">
        <div>
          <div className="flex items-center gap-2 text-2xl font-extrabold mb-8">
            <span className="text-[var(--red)]">✦</span>
            <span>Blood<span className="text-[var(--blue)]">Connect</span></span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            The intelligent <br />
            <span className="text-[var(--blue)]">blood mobilisation</span> <br />
            platform.
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Join the national network of donors, hospitals, and NGOs working together to ensure nobody dies waiting for blood.
          </p>
        </div>
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-[var(--glass-border)]">
            <div className="w-12 h-12 rounded-full bg-[var(--blue)]/10 flex items-center justify-center shrink-0">
              <Droplets className="text-[var(--blue)]" />
            </div>
            <div>
              <p className="font-bold text-[var(--text)]">18,426 Active Donors</p>
              <p className="text-sm text-[var(--text-secondary)]">Ready to respond to emergencies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="glass-panel-strong w-full max-w-md max-h-[92vh] overflow-y-auto p-8 rounded-3xl shadow-2xl border border-[var(--glass-border)]">
          <div className="lg:hidden flex items-center justify-center gap-2 text-xl font-extrabold mb-8">
            <span className="text-[var(--red)]">✦</span>
            <span>Blood<span className="text-[var(--blue)]">Connect</span></span>
          </div>

          <button type="button" onClick={() => setShowAuth(false)} className="mb-4 text-xs font-bold text-[var(--blue)] hover:underline">← Back to BloodConnect</button>

          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-sm">{formMode === 'signin' ? 'Sign in to your account to continue.' : 'Create a profile for your blood donation community.'}</p>

          <Tabs
            tabs={TABS}
            activeTab={accountType}
            onChange={(id) => {
              setAccountType(id as 'individual' | 'organization');
            }}
            className="mb-6"
          />

          {formMode === 'signup' && <div className="grid grid-cols-2 gap-2 mb-5">
            {(['donor', 'receiver'] as const).map(type => (
              <button key={type} type="button" onClick={() => setUserType(type)} className={`rounded-lg border px-3 py-2.5 text-sm font-bold capitalize transition ${userType === type ? 'border-[var(--blue)] bg-[var(--blue)] text-white' : 'border-[var(--glass-border)] text-[var(--muted)]'}`}>
                {type === 'receiver' ? 'Recipient' : 'Donor'}
              </button>
            ))}
          </div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {formMode === 'signup' && <>
              <Input label={accountType === 'organization' ? 'Organization Name' : 'Full Name'} placeholder={accountType === 'organization' ? 'Red Cross Society' : 'Your full name'} value={name} onChange={e => setName(e.target.value)} required />
              {accountType === 'organization' && <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)] ml-1">Organization Type</label>
                <select className="w-full h-11 px-4 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)]" defaultValue="ngo">
                  {ORG_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </div>}
              <div className="grid grid-cols-2 gap-3">
                {accountType === 'individual' && <Input label="Age" type="number" min="18" max="100" placeholder="18+" value={age} onChange={e => setAge(e.target.value)} required />}
                <Input label="Contact number" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} required />
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] ml-1">{accountType === 'organization' ? `${userType === 'donor' ? 'Donor' : 'Recipient'} blood group` : 'Blood group'}</label>
                  <select value={blood} onChange={e => setBlood(e.target.value)} className="w-full h-11 px-4 rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-sm text-[var(--text)]">
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              {accountType === 'individual' && <Input label="HLA typing (optional)" placeholder="Enter HLA type if known" value={hlaType} onChange={e => setHlaType(e.target.value)} />}
              <Input label="Address" placeholder="Street, city, state" value={address} onChange={e => setAddress(e.target.value)} required />
              <label className="block text-xs font-semibold text-[var(--text-secondary)] ml-1">
                ID proof <span className="text-[var(--red)]">*</span>
                <input type="file" accept="image/*,.pdf" required onChange={e => setIdProofName(e.target.files?.[0]?.name ?? '')} className="mt-1.5 block w-full rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-xs text-[var(--text)] file:mr-3 file:rounded file:border-0 file:bg-[var(--blue)] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" />
                {idProofName && <span className="mt-1 block font-normal text-[var(--muted)]">Selected: {idProofName}</span>}
              </label>
            </>}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />

            {authError && <p role="alert" className="text-sm font-semibold text-[var(--red)]">{authError}</p>}

            {formMode === 'signin' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[var(--blue)] hover:underline font-semibold">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-sm group" disabled={loading}>
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {formMode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            {formMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setFormMode(formMode === 'signin' ? 'signup' : 'signin')}
              className="text-[var(--blue)] font-bold hover:underline"
            >
              {formMode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
