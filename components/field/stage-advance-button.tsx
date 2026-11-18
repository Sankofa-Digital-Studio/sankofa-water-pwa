'use client';

import React from 'react';
import { CheckCircle2, Lock, Navigation, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface StageAdvanceButtonProps {
  currentStage: number; // 0=Open, 1=Excavated, 2=Repaired, 3=Authorized
  targetStage: 1 | 2 | 3;
  stageName: string;
  gpsDistanceMeters: number;
  geofenceThresholdMeters?: number;
  isLoading?: boolean;
  onAdvance: (targetStage: 1 | 2 | 3) => void;
  className?: string;
}

export function StageAdvanceButton({
  currentStage,
  targetStage,
  stageName,
  gpsDistanceMeters,
  geofenceThresholdMeters = 15.0,
  isLoading = false,
  onAdvance,
  className = '',
}: StageAdvanceButtonProps) {
  const isGeofenceValid = gpsDistanceMeters <= geofenceThresholdMeters;
  const isCompleted = currentStage >= targetStage;
  const isCurrentStep = currentStage === targetStage - 1;
  const isFutureStep = currentStage < targetStage - 1;

  if (isCompleted) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold ${className}`}
        data-testid={`stage-complete-${targetStage}`}
      >
        <CheckCircle2 size={16} />
        <span>Stage {targetStage}: {stageName} Verified</span>
      </div>
    );
  }

  if (isFutureStep) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 text-xs font-medium ${className}`}
        data-testid={`stage-locked-${targetStage}`}
      >
        <Lock size={14} />
        <span>Stage {targetStage}: {stageName} (Pending Prior Stage)</span>
      </div>
    );
  }

  // Active step requiring advance
  const isDisabled = !isGeofenceValid || isLoading;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <Button
        variant={isGeofenceValid ? 'primary' : 'ghost'}
        size="md"
        disabled={isDisabled}
        isLoading={isLoading}
        onClick={() => onAdvance(targetStage)}
        className="w-full flex items-center justify-between font-semibold"
        data-testid={`stage-advance-btn-${targetStage}`}
      >
        <div className="flex items-center gap-2">
          {isGeofenceValid ? <Navigation size={15} /> : <AlertCircle size={15} />}
          <span>Verify Stage {targetStage}: {stageName}</span>
        </div>

        <span
          className={`text-xs font-mono px-2 py-0.5 rounded ${
            isGeofenceValid
              ? 'bg-slate-950/40 text-slate-950'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          {gpsDistanceMeters.toFixed(1)}m / {geofenceThresholdMeters}m
        </span>
      </Button>

      {!isGeofenceValid && (
        <p className="text-[11px] text-rose-400 font-mono text-center">
          ⚠ Outside 15m geofence ({gpsDistanceMeters.toFixed(1)}m away). Stage locked.
        </p>
      )}
    </div>
  );
}
