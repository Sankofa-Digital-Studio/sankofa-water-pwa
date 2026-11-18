import React from 'react';
import { Lock, Unlock, Clock, ShieldAlert } from 'lucide-react';

export interface WardLockBadgeProps {
  wardId: number;
  isLocked: boolean;
  lockedAt?: string | Date | undefined;
  expiresAt?: string | Date | undefined;
  lockReason?: string | undefined;
  className?: string | undefined;
}

export function WardLockBadge({
  wardId,
  isLocked,
  lockedAt,
  expiresAt,
  lockReason,
  className = '',
}: WardLockBadgeProps) {
  // Format remaining lock time if expiresAt provided
  let remainingText = '4h debounce active';
  if (expiresAt) {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diffMin = Math.max(0, Math.round((expiry - now) / 60000));
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    remainingText = `${hours}h ${mins}m lock remaining`;
  }

  if (!isLocked) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${className}`}
        data-testid={`ward-lock-${wardId}`}
      >
        <Unlock size={12} />
        <span>Ward {wardId} Alerts Ready</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-col gap-1 p-2 rounded-lg text-xs bg-amber-500/10 text-amber-400 border border-amber-500/40 shadow-sm ${className}`}
      data-testid={`ward-lock-${wardId}`}
    >
      <div className="flex items-center gap-1.5 font-bold">
        <Lock size={13} className="text-amber-400 animate-pulse" />
        <span>Ward {wardId} Alert Cooldown Lock</span>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono">
        <Clock size={11} />
        <span>{remainingText}</span>
      </div>

      {lockReason && (
        <p className="text-[10px] text-slate-400 border-t border-amber-500/20 pt-1 mt-0.5">
          {lockReason}
        </p>
      )}
    </div>
  );
}
