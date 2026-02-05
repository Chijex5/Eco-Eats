import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-[var(--shadow-soft)] transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--ring)]/30 ${
        hover ? 'hover:-translate-y-0.5 hover:shadow-[var(--shadow)] hover:border-[var(--primary)]/30' : ''
      } ${props.onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <h3 className={`text-xl font-bold text-[var(--foreground)] ${className}`}>{children}</h3>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={className}>{children}</div>;
};
