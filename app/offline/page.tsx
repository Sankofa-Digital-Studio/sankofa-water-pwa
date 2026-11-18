"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-sky-400 shadow-lg shadow-sky-950/40">
          <WifiOff className="h-8 w-8 animate-pulse text-amber-400" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
          Field Offline Mode
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Connection Unavailable
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          You are currently operating without network connectivity. Local data and queued
          telemetry logs remain safely stored on this device.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Check Connection
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
