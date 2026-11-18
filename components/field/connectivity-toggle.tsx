'use client';

import React from 'react';
import { Wifi, WifiOff, RefreshCw, Database } from 'lucide-react';

export interface ConnectivityToggleProps {
  isOnline: boolean;
  queuedCount: number;
  onToggle: (online: boolean) => void;
  onSyncNow?: () => void;
  isSyncing?: boolean;
  className?: string;
}

export function ConnectivityToggle({
  isOnline,
  queuedCount,
  onToggle,
  onSyncNow,
  isSyncing = false,
  className = '',
}: ConnectivityToggleProps) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-lg ${className}`}
      data-testid="connectivity-toggle"
    >
      <div className="flex items-center gap-3">
        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={isOnline}
          onClick={() => onToggle(!isOnline)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
          data-testid="offline-switch"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isOnline ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {isOnline ? (
              <>
                <Wifi size={14} className="text-emerald-400" />
                <span className="text-emerald-400">Live Cellular / Wi-Fi</span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-amber-400" />
                <span className="text-amber-400">Offline Field Mode</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400">
            {isOnline ? 'Direct Supabase Realtime sync' : 'IndexedDB local fallback enabled'}
          </span>
        </div>
      </div>

      {/* IndexedDB Queue badge + manual sync */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
            queuedCount > 0
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              : 'bg-slate-800/80 border-slate-700 text-slate-400'
          }`}
          data-testid="queued-count-badge"
        >
          <Database size={12} />
          <span>{queuedCount}</span>
          <span className="text-[10px] font-normal text-slate-400">queued</span>
        </div>

        {isOnline && queuedCount > 0 && onSyncNow && (
          <button
            type="button"
            onClick={onSyncNow}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-50"
            title="Sync queued changes"
            aria-label="Sync queued changes"
            data-testid="sync-now-btn"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
    </div>
  );
}
