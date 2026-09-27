import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onDismiss: (id: string) => void;
  duration?: number;
}

const typeStyles: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: { bg: 'border-[var(--green)] bg-green-50 dark:bg-green-900/30', icon: <CheckCircle size={16} className="text-[var(--green)]" /> },
  error: { bg: 'border-[var(--red)] bg-red-50 dark:bg-red-900/30', icon: <XCircle size={16} className="text-[var(--red)]" /> },
  warning: { bg: 'border-[var(--amber)] bg-amber-50 dark:bg-amber-900/30', icon: <AlertTriangle size={16} className="text-[var(--amber)]" /> },
  info: { bg: 'border-[var(--blue)] bg-blue-50 dark:bg-blue-900/30', icon: <Info size={16} className="text-[var(--blue)]" /> },
};

function Toast({ id, message, type = 'info', onDismiss, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => { setVisible(false); setTimeout(() => onDismiss(id), 300); }, duration);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [id, duration, onDismiss]);

  const { bg, icon } = typeStyles[type];
  return (
    <div className={[
      'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border backdrop-blur-md shadow-xl max-w-sm w-full text-sm font-medium text-[var(--text)] transition-all duration-300',
      bg,
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
    ].join(' ')}>
      {icon}
      <span className="flex-1">{message}</span>
      <button onClick={() => onDismiss(id)} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors ml-1">
        <X size={14} />
      </button>
    </div>
  );
}

// Toast Manager
interface ToastData { id: string; message: string; type: ToastType; }
let _addToast: ((t: ToastData) => void) | null = null;

export function toast(message: string, type: ToastType = 'info') {
  _addToast?.({ id: Date.now().toString(), message, type });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  _addToast = (t) => setToasts(prev => [...prev, t]);
  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
