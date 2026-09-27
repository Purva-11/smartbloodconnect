import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, X, Share2, MapPin, Calendar, Clock, User } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface QRPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  pass: {
    id: string;
    token: string;
    campName: string;
    date: string;
    time: string;
    venue: string;
    status: string;
    participantName: string;
    bloodGroup: string;
  };
}

export function QRPassModal({ isOpen, onClose, pass }: QRPassModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pass.id}-camp-pass.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = { title: `${pass.campName} pass`, text: `Camp pass ${pass.id} for ${pass.participantName}` };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(pass.token);
    window.alert('Camp pass QR token copied.');
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Digital Registration Pass">
      <div className="flex flex-col items-center max-w-sm mx-auto w-full">
        <div ref={qrRef} className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] p-4 text-center text-white">
            <h3 className="font-extrabold text-lg truncate px-2">{pass.campName}</h3>
            <p className="text-white/80 text-xs font-semibold mt-1 opacity-90 uppercase tracking-widest">Official Entry Pass</p>
          </div>
          
          {/* QR Area */}
          <div className="p-6 flex flex-col items-center bg-white">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
              <QRCodeSVG 
                value={pass.token} 
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            
            <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">{pass.id}</p>
            <Badge variant={pass.status === 'Registered' ? 'blue' : 'green'} className="mt-2 text-xs">
              {pass.status}
            </Badge>
          </div>

          {/* Details */}
          <div className="bg-gray-50 p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-800 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <User size={14} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold truncate">{pass.participantName}</p>
                <p className="text-xs text-gray-500 font-medium">Blood Group: <span className="text-[var(--red)] font-bold">{pass.bloodGroup}</span></p>
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 font-medium">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{pass.venue}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{pass.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span>{pass.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full mt-6">
          <Button variant="secondary" className="flex-1 text-sm h-11" onClick={handleDownload}>
            <Download size={16} /> Save Pass
          </Button>
          <Button variant="ghost" className="flex-1 text-sm h-11 border border-[var(--glass-border)]" onClick={() => void handleShare()}>
            <Share2 size={16} /> Share
          </Button>
        </div>
      </div>
    </Modal>
  );
}
