import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  wide?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[var(--blue)] hover:bg-[var(--blue-dark)] text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-[var(--glass-strong)] hover:bg-white/90 text-[var(--text)] border border-[var(--glass-border)]',
  danger: 'bg-[var(--red)] hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
  ghost: 'bg-transparent hover:bg-white/20 text-[var(--text-secondary)] hover:text-[var(--text)]',
  outline: 'bg-transparent border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-[var(--radius-sm)]',
  md: 'px-5 py-2.5 text-sm rounded-[var(--radius-md)]',
  lg: 'px-7 py-3.5 text-base rounded-[var(--radius-md)]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  iconRight,
  wide,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-[var(--transition)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        wide ? 'w-full' : '',
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
