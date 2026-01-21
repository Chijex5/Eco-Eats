import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
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
      <textarea
        className={`w-full px-4 py-3 rounded-lg border ${
          error
            ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]'
            : 'border-[var(--border)] focus:ring-[var(--primary)]'
        } focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all bg-white dark:bg-[var(--muted)] text-[var(--foreground)] resize-vertical min-h-[120px] ${className}`}
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
