import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variants = {
    default: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
    success: 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20',
    warning: 'bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20',
    error: 'bg-[var(--destructive)]/10 text-[var(--destructive)] border border-[var(--destructive)]/20',
    info: 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
