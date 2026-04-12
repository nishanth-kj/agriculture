'use client';

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
}

const variantClasses: Record<StatusVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  danger:  'bg-red-500/10 text-red-600 border-red-500/20',
  info:    'bg-sky-500/10 text-sky-600 border-sky-500/20',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
