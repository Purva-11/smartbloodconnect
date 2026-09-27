import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'pills', className = '' }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-[var(--glass-border)] ${className}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-[var(--blue)] text-[var(--blue)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]',
            ].join(' ')}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--glass)] backdrop-blur border border-[var(--glass-border)] flex-wrap ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-[var(--radius-sm)] transition-all',
            activeTab === tab.id
              ? 'bg-[var(--blue)] text-white shadow-lg'
              : 'text-[var(--text-secondary)] hover:bg-white/30 hover:text-[var(--text)]',
          ].join(' ')}
        >
          {tab.icon}{tab.label}
        </button>
      ))}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showPercent?: boolean;
}

export function ProgressBar({ value, max = 100, label, color = 'var(--blue)', showPercent }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-[var(--muted)] mb-1.5">
          {label && <span>{label}</span>}
          {showPercent && <span>{pct}%</span>}
        </div>
      )}
      <div className="h-2 bg-[var(--glass)] rounded-full overflow-hidden border border-[var(--glass-border)]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-[var(--glass-border)] ${className}`} />;
}
