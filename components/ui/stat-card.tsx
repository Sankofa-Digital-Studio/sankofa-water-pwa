import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  trendLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  trend = 'neutral',
  trendValue,
  trendLabel: customTrendLabel,
  icon,
  className = '',
}: StatCardProps) {
  const trendConfig = {
    up: { Icon: TrendingUp, color: 'text-emerald-400', label: 'Increasing' },
    down: { Icon: TrendingDown, color: 'text-rose-400', label: 'Decreasing' },
    neutral: { Icon: Minus, color: 'text-slate-400', label: 'Stable' },
  };

  const { Icon, color, label: defaultTrendLabel } = trendConfig[trend];
  const displayTrend = trendValue ?? customTrendLabel;

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="text-slate-500" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
      </div>

      {displayTrend !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${color}`} aria-label={`Trend: ${defaultTrendLabel}`}>
          <Icon size={12} aria-hidden="true" />
          <span>{displayTrend}</span>
        </div>
      )}
    </div>
  );
}
