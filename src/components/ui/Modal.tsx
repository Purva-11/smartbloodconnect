import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--navy)]/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={[
          'relative flex max-h-[calc(100dvh-2rem)] w-full flex-col glass-panel-strong rounded-[var(--radius-xl)] overflow-hidden',
          sizeMap[size],
        ].join(' ')}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--glass-border)]">
            <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--text)] transition-all"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--glass)] text-[var(--muted)] hover:text-[var(--text)] transition-all z-10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
        <div className="min-h-0 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
