import React from 'react';
import { MapPin, Calendar, Clock, Target, AlertTriangle, Building2, UserPlus } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/Tabs';
import { LeafletMap } from '../../components/maps/LeafletMap';

interface CampDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  camp: any; // Using any for mock
  onRegister: () => void;
}

export function CampDetailsModal({ isOpen, onClose, camp, onRegister }: CampDetailsModalProps) {
  if (!camp) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Camp Details">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-2xl font-extrabold text-[var(--text)]">{camp.name}</h2>
            {camp.emergency && (
              <Badge variant="red" className="animate-pulse shrink-0"><AlertTriangle size={12} className="mr-1 inline" /> Emergency</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-[var(--blue)] font-semibold">
            <Building2 size={16} />
            <span>{camp.organisation}</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="default" className="text-xs px-2"><MapPin size={12} className="mr-1 inline" /> {camp.city}</Badge>
            <Badge variant="default" className="text-xs px-2"><Calendar size={12} className="mr-1 inline" /> {camp.date}</Badge>
            <Badge variant="default" className="text-xs px-2"><Clock size={12} className="mr-1 inline" /> {camp.time}</Badge>
          </div>
        </div>

        {/* Progress & Requirements */}
        <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--glass)] border border-[var(--glass-border)]">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-[var(--text)]">Registration Goal</span>
            <span className="text-[var(--blue)]">{camp.registered} / {camp.target}</span>
          </div>
          <ProgressBar value={Math.round((camp.registered / camp.target) * 100)} color={camp.emergency ? 'red' : 'blue'} />
          
          <div className="mt-5">
            <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Urgently Required</p>
            <div className="flex flex-wrap gap-2">
              {camp.bloodGroups.map((bg: string) => (
                <span key={bg} className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--red)]/10 text-[var(--red)] font-black border border-[var(--red)]/20">
                  {bg}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Map Location */}
        <div>
          <h3 className="text-sm font-bold text-[var(--text)] mb-3">Venue Location</h3>
          <p className="text-sm text-[var(--muted)] mb-3">{camp.venue}, {camp.location}</p>
          <LeafletMap 
            center={{ lat: camp.coordinates.lat || 19.0760, lng: camp.coordinates.lng || 72.8777 }} 
            zoom={15} 
            className="h-48"
            locations={[
              { id: camp.id, lat: camp.coordinates.lat || 19.0760, lng: camp.coordinates.lng || 72.8777, type: 'camp', name: camp.venue }
            ]} 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[var(--glass-border)]">
          <Button variant="secondary" className="flex-1 font-semibold text-sm" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-[2] font-semibold text-sm" onClick={onRegister}>
            <UserPlus size={16} className="mr-2" /> Proceed to Register
          </Button>
        </div>
      </div>
    </Modal>
  );
}
