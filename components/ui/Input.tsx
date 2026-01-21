import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-lg border ${
          error
            ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
            : 'border-[var(--border)] focus:ring-[var(--primary)]'
        } focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all bg-white dark:bg-[var(--muted)] text-[var(--foreground)] ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--destructive)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{helperText}</p>
      )}
    </div>
  );
};
