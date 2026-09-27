import React from 'react';

type BadgeVariant = 'blue' | 'cyan' | 'red' | 'green' | 'amber' | 'gray' | 'emergency' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-100 text-[var(--blue)] border-blue-200 dark:bg-blue-900/30 dark:border-blue-700',
  cyan: 'bg-cyan-100 text-[var(--cyan)] border-cyan-200 dark:bg-cyan-900/30 dark:border-cyan-700',
  red: 'bg-red-100 text-[var(--red)] border-red-200 dark:bg-red-900/30 dark:border-red-700',
  green: 'bg-green-100 text-[var(--green)] border-green-200 dark:bg-green-900/30 dark:border-green-700',
  amber: 'bg-amber-100 text-[var(--amber)] border-amber-200 dark:bg-amber-900/30 dark:border-amber-700',
  gray: 'bg-gray-100 text-[var(--muted)] border-gray-200 dark:bg-gray-800/50 dark:border-gray-700',
  emergency: 'bg-red-600 text-white border-red-700 animate-pulse',
  default: 'bg-gray-100 text-[var(--muted)] border-gray-200 dark:bg-gray-800/50 dark:border-gray-700',
};

export function Badge({ children, variant = 'blue', pulse, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
        variantStyles[variant],
        pulse ? 'animate-pulse' : '',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

interface BloodGroupBadgeProps {
  group: string;
  size?: 'sm' | 'md';
}

export function BloodGroupBadge({ group, size = 'md' }: BloodGroupBadgeProps) {
  return (
    <span className={[
      'inline-flex items-center justify-center font-bold rounded-full bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20',
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
    ].join(' ')}>
      {group}
    </span>
  );
}
