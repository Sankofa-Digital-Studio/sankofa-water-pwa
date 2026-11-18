import React from 'react';
import { MapPinOff, AlertTriangle } from 'lucide-react';

export interface GeofenceAlertProps {
  distanceMeters: number;
  thresholdMeters?: number;
  message?: string;
  className?: string;
}

export function GeofenceAlert({
  distanceMeters,
  thresholdMeters = 15,
  message,
  className = '',
}: GeofenceAlertProps) {
  const excess = Math.max(0, distanceMeters - thresholdMeters);

  return (
    <div
      className={`bg-rose-950/60 border border-rose-500/50 rounded-xl p-3.5 shadow-lg shadow-rose-950/20 text-xs ${className}`}
      data-testid="geofence-alert"
      role="alert"
    >
      <div className="flex items-start gap-2.5">
        <MapPinOff size={18} className="text-rose-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-rose-300 uppercase tracking-wide text-[11px]">
              Geofence Verification Failed
            </span>
            <span className="font-mono text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30">
              {distanceMeters.toFixed(1)}m from site
            </span>
          </div>

          <p className="text-rose-200 leading-relaxed">
            {message ||
              `Device GPS reports you are ${distanceMeters.toFixed(1)}m away (${excess.toFixed(1)}m outside the ${thresholdMeters}m perimeter). Physical presence on site is legally required under Matjhabeng SDBIP compliance.`}
          </p>

          <div className="mt-2 text-[10px] text-rose-300/80 flex items-center gap-1 font-mono">
            <AlertTriangle size={12} className="text-rose-400" />
            <span>Anti-Fraud PostGIS verification enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
