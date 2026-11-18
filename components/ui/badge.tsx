import React from 'react';

export interface BadgeProps {
  variant: 'nominal' | 'surge' | 'depressurized' | 'filtered' | 'info';
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  BadgeProps['variant'],
  { bg: string; text: string; ring: string; dot: string }
> = {
  nominal: {
    bg: 'bg-emerald-400/10',
    text: 'text-emerald-400',
    ring: 'ring-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  surge: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    ring: 'ring-amber-400/30',
    dot: 'bg-amber-400',
  },
  depressurized: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    ring: 'ring-rose-500/30',
    dot: 'bg-rose-500',
  },
  filtered: {
    bg: 'bg-cyan-400/10',
    text: 'text-cyan-400',
    ring: 'ring-cyan-400/30',
    dot: 'bg-cyan-400',
  },
  info: {
    bg: 'bg-slate-700/50',
    text: 'text-slate-300',
    ring: 'ring-slate-600/30',
    dot: 'bg-slate-400',
  },
};

export function Badge({ variant, label, children, className = '' }: BadgeProps) {
  const cfg = variantConfig[variant];
  const display = children ?? label;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
        aria-hidden="true"
      />
      {display}
    </span>
  );
}
