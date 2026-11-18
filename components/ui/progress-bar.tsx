import React from 'react';

export interface ProgressBarProps {
  label?: string;
  value: number;
  max?: number;
  colorVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  showPercent?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const colorMap: Record<NonNullable<ProgressBarProps['colorVariant']>, string> = {
  primary: 'bg-amber-500',
  secondary: 'bg-cyan-400',
  success: 'bg-emerald-400',
  danger: 'bg-rose-500',
  warning: 'bg-orange-400',
};

const heightMap: Record<NonNullable<ProgressBarProps['size']>, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
};

export function ProgressBar({
  label,
  value,
  max = 100,
  colorVariant = 'primary',
  showPercent = false,
  size = 'sm',
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / (max === 0 ? 1 : max)) * 100));
  const color = colorMap[colorVariant];
  const height = heightMap[size];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showPercent && (
            <span className="text-xs font-mono text-slate-300">{pct.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full ${height} bg-slate-800 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`${height} ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
