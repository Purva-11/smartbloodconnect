import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

export function Card({ children, className = '', hover = true, padding = 'md', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'glass-card',
        paddingMap[padding],
        hover ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  delta?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  color?: 'blue' | 'cyan' | 'red' | 'green' | 'amber';
}

const colorMap: Record<string, string> = {
  blue: 'text-[var(--blue)]',
  cyan: 'text-[var(--cyan)]',
  red: 'text-[var(--red)]',
  green: 'text-[var(--green)]',
  amber: 'text-[var(--amber)]',
};

export function StatCard({ title, subtitle, value, delta, positive, icon, color = 'blue' }: StatCardProps) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{title}</span>
        {icon && <span className={colorMap[color]}>{icon}</span>}
      </div>
      {subtitle && <span className="text-xs text-[var(--muted)]">{subtitle}</span>}
      <div className={`text-3xl font-extrabold ${colorMap[color]}`}>{value}</div>
      {delta && (
        <span className={`text-xs font-medium ${positive ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
          {positive ? '↑' : '↓'} {delta}
        </span>
      )}
    </div>
  );
}
