import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0';
  
  const variants = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-sm hover:shadow-md',
    secondary: 'bg-[var(--secondary)] text-[var(--foreground)] hover:brightness-95 shadow-sm hover:shadow-md',
    outline: 'border border-[var(--foreground)]/20 text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--surface-alt)]',
    ghost: 'text-[var(--foreground)] hover:bg-[var(--muted)]',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
