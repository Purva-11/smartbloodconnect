import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle, XCircle, Search, User } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RegistrationService } from '../../services/registrations';
import { decodeQRToken } from '../../services/qr';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScanCode = useCallback(async (code: string) => {
    setLoading(true);
    setScanError('');
    const registration = await RegistrationService.findRegistrationByCode(code);
    if (!registration) {
      setScanError('Pass not found. Scan a pass created for a camp in this browser.');
      setLoading(false);
      return false;
    }
    setResult({
      id: registration.id,
      name: registration.userName,
      blood: registration.bloodGroup,
      status: registration.status,
      campId: registration.campId,
    });
    setLoading(false);
    return true;
  }, []);

  useEffect(() => {
    if (!isOpen || scanMode !== 'camera' || result || !videoRef.current) return;
    let cancelled = false;
    let handled = false;
    let controls: { stop: () => void } | undefined;
    void import('@zxing/browser').then(async ({ BrowserMultiFormatReader }) => {
      if (cancelled || !videoRef.current) return;
      const reader = new BrowserMultiFormatReader();
      controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, scanResult => {
        if (!scanResult || cancelled || handled) return;
        handled = true;
        void handleScanCode(scanResult.getText()).then(found => {
          if (!found) handled = false;
        });
      });
      if (cancelled) controls.stop();
    }).catch(() => {
      if (!cancelled) setScanError('Camera access failed. Allow camera permission or use Manual ID.');
    });

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [isOpen, scanMode, result, handleScanCode]);

  const handleMarkAttendance = async (status: 'Confirmed' | 'Present') => {
    if (!result) return;
    setLoading(true);
    const updated = await RegistrationService.updateAttendance(result.id, status);
    if (updated) setResult({ ...result, status });
    else setScanError('Attendance could not be saved. Verify the registration and try again.');
    setLoading(false);
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Volunteer Check-in">
      <div className="flex flex-col gap-4">
        
        {/* Toggle Mode */}
        <div className="flex bg-[var(--glass)] p-1 rounded-lg">
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${scanMode === 'camera' ? 'bg-[var(--blue)] text-white shadow' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
            onClick={() => { setScanMode('camera'); setScanError(''); }}
          >
            <Camera size={14} className="inline mr-2" /> Camera
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${scanMode === 'manual' ? 'bg-[var(--blue)] text-white shadow' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
            onClick={() => { setScanMode('manual'); setScanError(''); }}
          >
            <Search size={14} className="inline mr-2" /> Manual ID
          </button>
        </div>

        {!result ? (
          <div className="glass-panel border border-[var(--glass-border)] rounded-xl overflow-hidden h-[min(65dvh,24rem)] shrink-0 flex flex-col items-center justify-center relative">
            {scanMode === 'camera' ? (
              <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
                <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="w-48 h-48 border-2 border-[var(--blue)] rounded-xl relative z-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[var(--cyan)] -mt-1 -ml-1 rounded-tl"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[var(--cyan)] -mt-1 -mr-1 rounded-tr"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[var(--cyan)] -mb-1 -ml-1 rounded-bl"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[var(--cyan)] -mb-1 -mr-1 rounded-br"></div>
                  <div className="w-full h-0.5 bg-[var(--blue)]/50 absolute top-1/2 -translate-y-1/2 animate-scan"></div>
                </div>
                <p className="text-white/90 text-sm mt-6 relative z-10">{loading ? 'Verifying pass...' : 'Position the camp pass QR within the frame'}</p>
                {scanError && <p className="absolute bottom-3 z-10 px-3 text-center text-xs text-white">{scanError}</p>}
              </div>
            ) : (
              <div className="p-6 w-full max-w-sm flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--blue)]/10 flex items-center justify-center">
                  <Search size={24} className="text-[var(--blue)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text)] text-lg mb-1">Enter Ticket ID</h3>
                  <p className="text-sm text-[var(--muted)]">Type the 5-digit code or full ticket ID.</p>
                </div>
                <input 
                  type="text" 
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  placeholder="e.g. BC-TKT-89402"
                  className="w-full text-center text-lg uppercase tracking-wider font-mono p-3 rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] focus:outline-none focus:border-[var(--blue)]"
                />
                {scanError && <p className="text-xs text-[var(--red)]">{scanError}</p>}
                <Button className="w-full" disabled={!manualCode || loading} onClick={() => void handleScanCode(manualCode)}>
                  {loading ? 'Verifying...' : 'Verify Ticket'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel border-2 border-[var(--green)]/50 rounded-xl p-6 bg-[var(--green)]/5 relative overflow-hidden text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--green)]/20 text-[var(--green)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-[var(--text)] mb-1">{result.name}</h3>
            <p className="text-sm text-[var(--muted)] font-mono mb-4">{result.id}</p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge variant="red" className="text-sm px-3 py-1 font-bold">{result.blood}</Badge>
              <Badge variant={result.status === 'Present' ? 'green' : 'blue'} className="text-sm px-3 py-1 font-bold">{result.status}</Badge>
            </div>

            <div className="space-y-3">
              {result.status !== 'Present' && (
                <Button className="w-full h-12 text-lg font-bold bg-[var(--green)] hover:bg-[var(--green)]/90 text-white" disabled={loading} onClick={() => handleMarkAttendance('Present')}>
                  Mark as Present
                </Button>
              )}
              {result.status === 'Registered' && (
                <Button variant="secondary" className="w-full" disabled={loading} onClick={() => handleMarkAttendance('Confirmed')}>
                  Confirm Arrival
                </Button>
              )}
              <Button variant="ghost" className="w-full" onClick={() => setResult(null)}>
                Scan Next Ticket
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
