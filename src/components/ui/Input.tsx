import React from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function Input({ label, icon, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-[var(--text)]">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
            {icon}
          </span>
        )}
        <input
          className={[
            'w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--glass)] backdrop-blur border border-[var(--glass-border)] text-[var(--text)] placeholder-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/50 focus:border-[var(--blue)] transition-all',
            icon ? 'pl-10' : '',
            error ? 'border-[var(--red)] focus:ring-[var(--red)]/30' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[var(--red)]">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-[var(--text)]">{label}</label>}
      <select
        className={[
          'w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--glass)] backdrop-blur border border-[var(--glass-border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/50 focus:border-[var(--blue)] transition-all appearance-none cursor-pointer',
          className,
        ].join(' ')}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[var(--bg-secondary)]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder, className = '' }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--glass)] backdrop-blur border border-[var(--glass-border)] text-[var(--text)] placeholder-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/50 focus:border-[var(--blue)] transition-all"
      />
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, label, description, disabled }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={[
          'w-11 h-6 rounded-full transition-all duration-300',
          checked ? 'bg-[var(--blue)]' : 'bg-[var(--muted)]/40',
          disabled ? 'opacity-50' : '',
        ].join(' ')}>
          <div className={[
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300',
            checked ? 'translate-x-5' : '',
          ].join(' ')} />
        </div>
      </div>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-semibold text-[var(--text)]">{label}</p>}
          {description && <p className="text-xs text-[var(--muted)]">{description}</p>}
        </div>
      )}
    </label>
  );
}
