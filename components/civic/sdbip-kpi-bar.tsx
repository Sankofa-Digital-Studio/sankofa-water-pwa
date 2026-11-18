'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SdbipKpiBarProps {
  kpiCode: string;
  title: string;
  municipalPercent: number;
  citizenVerifiedPercent: number;
  targetPercent?: number;
  onAuditClick?: (kpiCode: string) => void;
  className?: string;
}

export function SdbipKpiBar({
  kpiCode,
  title,
  municipalPercent,
  citizenVerifiedPercent,
  targetPercent = 85,
  onAuditClick,
  className = '',
}: SdbipKpiBarProps) {
  const discrepancy = Math.abs(municipalPercent - citizenVerifiedPercent);
  const isHighDiscrepancy = discrepancy >= 15;

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3 ${className}`}
      data-testid={`sdbip-kpi-${kpiCode}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {kpiCode}
            </span>
            <span className="text-xs text-slate-400">Target: {targetPercent}%</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-1">{title}</h4>
        </div>

        {isHighDiscrepancy ? (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle size={12} />
            <span>Δ {discrepancy.toFixed(0)}% Discrepancy</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle size={12} />
            <span>Aligned</span>
          </span>
        )}
      </div>

      {/* Comparative Progress Bars */}
      <div className="space-y-2 pt-1">
        {/* Municipal Claim */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Official Municipal SDBIP Claim</span>
            <span className="font-mono font-bold text-amber-400">
              {municipalPercent.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, municipalPercent))}%` }}
            />
          </div>
        </div>

        {/* Citizen & IoT Verified */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck size={13} className="text-cyan-400" />
              <span>Independent IoT & Citizen Ground-Truth</span>
            </span>
            <span
              className={`font-mono font-bold ${
                isHighDiscrepancy ? 'text-rose-400' : 'text-cyan-400'
              }`}
            >
              {citizenVerifiedPercent.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHighDiscrepancy ? 'bg-rose-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, citizenVerifiedPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Audit Button */}
      {onAuditClick && (
        <div className="pt-2 border-t border-slate-800/80 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAuditClick(kpiCode)}
            className="text-xs flex items-center gap-1.5"
            data-testid={`audit-btn-${kpiCode}`}
          >
            <Search size={13} />
            <span>Audit PostGIS Evidence</span>
          </Button>
        </div>
      )}
    </div>
  );
}
