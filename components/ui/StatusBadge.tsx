import React from 'react';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'PENDING' | 'APPROVED' | 'DECLINED' | 'COMPLETED' | 'FAILED' | 'CLAIMED';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    ACTIVE: { label: 'Active', color: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20' },
    REDEEMED: { label: 'Redeemed', color: 'bg-[var(--muted)] text-[var(--muted-foreground)]' },
    EXPIRED: { label: 'Expired', color: 'bg-[var(--destructive)]/10 text-[var(--destructive)] border-[var(--destructive)]/20' },
    PENDING: { label: 'Pending', color: 'bg-[var(--secondary)]/10 text-[var(--secondary)] border-[var(--secondary)]/20' },
    APPROVED: { label: 'Approved', color: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20' },
    DECLINED: { label: 'Declined', color: 'bg-[var(--destructive)]/10 text-[var(--destructive)] border-[var(--destructive)]/20' },
    COMPLETED: { label: 'Completed', color: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20' },
    FAILED: { label: 'Failed', color: 'bg-[var(--destructive)]/10 text-[var(--destructive)] border-[var(--destructive)]/20' },
    CLAIMED: { label: 'Claimed', color: 'bg-[var(--muted)] text-[var(--muted-foreground)]' },
  };

  const config = statusConfig[status] || statusConfig.ACTIVE;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.1em] border ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
};
