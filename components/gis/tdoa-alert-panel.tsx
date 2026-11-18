'use client';

import React from 'react';
import { ShieldAlert, Crosshair, Navigation, Zap, AlertTriangle } from 'lucide-react';
import { TdoaAlert } from '@/types/telemetry.types';
import { Button } from '@/components/ui/button';

export interface TdoaAlertPanelProps {
  alert: TdoaAlert | null;
  onDispatchTeam?: () => void;
  className?: string;
}

export function TdoaAlertPanel({
  alert,
  onDispatchTeam,
  className = '',
}: TdoaAlertPanelProps) {
  if (!alert) {
    return (
      <div
        className={`bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center text-slate-500 text-xs ${className}`}
        data-testid="tdoa-alert-idle"
      >
        <Crosshair size={24} className="mx-auto mb-2 opacity-30 text-cyan-400" />
        <p className="font-medium text-slate-400">Acoustic Triangulation Standing By</p>
        <p className="text-[11px] mt-1 text-slate-500">
          Continuous cross-correlation between adjacent node pairs (Δt resolution: 1 ms)
        </p>
      </div>
    );
  }

  const [lng, lat] = alert.ruptureCoord;

  return (
    <div
      className={`bg-rose-950/40 border border-rose-500/50 rounded-xl p-4 shadow-xl shadow-rose-950/30 backdrop-blur-md ${className}`}
      data-testid="tdoa-alert-panel"
    >
      <div className="flex items-center gap-2 mb-3 text-rose-400 font-bold text-sm tracking-wide uppercase">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
        </span>
        <ShieldAlert size={18} />
        <span>TDOA Rupture Pinpoint Triggered</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">Triangulation Nodes</span>
          <span className="font-mono font-bold text-amber-400">
            {alert.between[0]} ↔ {alert.between[1]}
          </span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">Time Differential (Δt)</span>
          <span className="font-mono font-bold text-cyan-400 flex items-center gap-1">
            <Zap size={12} /> {alert.deltaTMs} ms
          </span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">Wave Velocity (c)</span>
          <span className="font-mono text-slate-200">
            {alert.waveVelocityMs.toLocaleString()} m/s
          </span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">Pinpoint Accuracy</span>
          <span className="font-mono font-semibold text-emerald-400">
            ±{alert.accuracy.toFixed(1)} m
          </span>
        </div>
      </div>

      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation size={14} className="text-rose-400" />
          <span className="text-[11px] text-slate-300 font-mono">
            {lat.toFixed(5)}° S, {lng.toFixed(5)}° E
          </span>
        </div>
        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded">
          Critical Rupture
        </span>
      </div>

      <div className="flex gap-2">
        {onDispatchTeam && (
          <Button
            variant="danger"
            size="sm"
            onClick={onDispatchTeam}
            className="w-full flex items-center justify-center gap-1.5"
          >
            <AlertTriangle size={14} />
            <span>Generate Field Repair Ticket</span>
          </Button>
        )}
      </div>
    </div>
  );
}
