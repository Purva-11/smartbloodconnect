import React, { useState } from 'react';
import { User2, Calendar, Droplets, MapPin, Target, ShieldCheck, HeartPulse, Clock, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { QRPassModal } from '../../components/qr/QRPassModal';

export function DonorSpacePage() {
  const { user, myRegistrations, consentSettings, updateConsent } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'consent'>('profile');
  const [selectedPass, setSelectedPass] = useState<any>(null);

  const TABS = [
    { id: 'profile', label: 'My Profile' },
    { id: 'history', label: 'Donation History' },
    { id: 'consent', label: 'Privacy & Consent' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {selectedPass && (
        <QRPassModal 
          isOpen={!!selectedPass} 
          onClose={() => setSelectedPass(null)} 
          pass={{
            id: selectedPass.id,
            token: selectedPass.qrCodeToken,
            campName: selectedPass.campName,
            date: new Date(selectedPass.registrationDate).toLocaleDateString(),
            time: selectedPass.preferredTimeSlot,
            venue: "Community Center",
            status: selectedPass.status,
            participantName: user?.name || "Participant",
            bloodGroup: user?.bloodGroup || "A+"
          }} 
        />
      )}
      <div className="flex flex-col md:flex-row items-center gap-6 glass-panel rounded-[var(--radius-xl)] p-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0">
          {(user?.name?.[0] ?? 'U').toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-[var(--text)]">{user?.name}</h1>
          <p className="text-[var(--muted)]">{user?.email} • {user?.phone}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            <Badge variant="blue"><User2 size={12} className="mr-1" />{user?.userType}</Badge>
            <Badge variant="red"><Droplets size={12} className="mr-1" />{user?.bloodGroup}</Badge>
            <Badge variant="cyan"><MapPin size={12} className="mr-1" />{user?.city}</Badge>
            {user?.isAvailableForEmergency && <Badge variant="green"><HeartPulse size={12} className="mr-1" />On Call</Badge>}
          </div>
        </div>
        <div className="shrink-0 space-y-2 w-full md:w-auto">
          <Button className="w-full"><FileText size={14} /> Download Digital ID</Button>
          <Button variant="ghost" className="w-full">Edit Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Donations" value={user?.donationCount?.toString() ?? '0'} icon={<Target size={18} />} color="blue" />
        <StatCard title="Lives Saved" value={((user?.donationCount ?? 0) * 3).toString()} icon={<HeartPulse size={18} />} color="red" />
        <StatCard title="Registrations" value={myRegistrations.length.toString()} icon={<Calendar size={18} />} color="cyan" />
        <StatCard title="Last Donated" value={user?.lastDonationDate ?? 'Never'} icon={<Clock size={18} />} color="green" />
      </div>

      <div className="glass-panel rounded-[var(--radius-xl)] overflow-hidden">
        <div className="flex border-b border-[var(--glass-border)]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'text-[var(--blue)] border-b-2 border-[var(--blue)] bg-[var(--blue)]/5'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-4">Medical Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--muted)] uppercase font-semibold">Blood Group</p>
                    <p className="text-lg font-bold text-[var(--text)] text-[var(--red)] mt-1">{user?.bloodGroup}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--muted)] uppercase font-semibold">HLA Typing</p>
                    <p className="text-lg font-bold text-[var(--text)] mt-1">{user?.hlaType ?? 'Not tested'}</p>
                    {(!user?.hlaType) && <button className="text-xs text-[var(--blue)] mt-2 font-semibold hover:underline">Request HLA TestKit</button>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-bold text-[var(--text)] mb-4">My Registrations</h3>
              {myRegistrations.length === 0 ? (
                <p className="text-[var(--muted)] text-center py-8">No past registrations found.</p>
              ) : (
                <div className="space-y-4">
                  {myRegistrations.map(reg => (
                    <div key={reg.id} className="flex flex-col sm:flex-row justify-between p-4 rounded-xl border border-[var(--glass-border)] hover:bg-[var(--glass)] transition-colors">
                      <div>
                        <h4 className="font-bold text-[var(--text)]">{reg.campName}</h4>
                        <p className="text-sm text-[var(--muted)] mt-1">Ticket: <span className="font-mono text-[var(--blue)]">{reg.id}</span></p>
                        <p className="text-sm text-[var(--muted)]">Registered on {new Date(reg.registrationDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col items-end mt-4 sm:mt-0">
                        <Badge variant={reg.status === 'Present' ? 'green' : reg.status === 'Cancelled' ? 'red' : 'blue'}>
                          {reg.status}
                        </Badge>
                        {reg.status !== 'Present' && reg.status !== 'Cancelled' && (
                          <Button variant="ghost" size="sm" className="mt-2 text-[var(--blue)]" onClick={() => setSelectedPass(reg)}>View Digital Pass</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'consent' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[var(--blue)] mb-4">
                <ShieldCheck size={20} />
                <h3 className="text-lg font-bold text-[var(--text)]">Privacy Controls</h3>
              </div>
              <p className="text-sm text-[var(--muted)] mb-6">Manage how your contact information is shared and when we can contact you.</p>

              <div className="space-y-4">
                {[
                  { key: 'emergencyAlerts', label: 'Emergency Alerts', desc: 'Receive immediate notifications for critical blood needs in your area.', icon: <AlertTriangle size={18} className="text-[var(--red)]" /> },
                  { key: 'whatsappNotifications', label: 'WhatsApp Updates', desc: 'Receive camp reminders and digital passes via WhatsApp.', icon: <Target size={18} className="text-[var(--green)]" /> },
                  { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Receive standard SMS messages for updates.', icon: <FileText size={18} className="text-[var(--blue)]" /> },
                  { key: 'shareContactWithOrganizers', label: 'Data Sharing', desc: 'Allow verified camp organizers to see your contact info for coordination.', icon: <ShieldCheck size={18} className="text-[var(--cyan)]" /> },
                ].map(({ key, label, desc, icon }) => (
                  <div key={key} className="flex items-start justify-between p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)]">
                    <div className="flex gap-3 pr-4">
                      <div className="mt-0.5">{icon}</div>
                      <div>
                        <h4 className="font-bold text-[var(--text)] text-sm">{label}</h4>
                        <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={consentSettings[key as keyof typeof consentSettings] as boolean}
                        onChange={(e) => updateConsent({ [key]: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--blue)]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
