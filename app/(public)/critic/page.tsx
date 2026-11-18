import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Bug,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';

export const metadata = {
  title: 'Critic Loop & Bug Fix Verification | Sankofa Water',
  description:
    'Sankofa Water Architecture Critic Loop: Systematic resolution of critical bugs, TTL locks, and cryptographic integrity.',
};

const CRITIC_FIXES = [
  {
    id: 'CRITIC-BUG-01',
    title: 'Missing handleAuthorizeDossier in Stakeholders Dossier View',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    description:
      'In the original prototype, clicking Authorize LOI failed due to an unhandled exception or missing handler. Re-architected with asynchronous POST /api/v1/dossiers/sign, SHA-256 IP hashing (POPIA compliant), and deterministic LOI reference generation.',
    file: 'app/(protected)/dossiers/page.tsx',
    fixDetails: 'Integrated full handleAuthorizeDossier handler wired to backend API and local fallback state.',
  },
  {
    id: 'CRITIC-BUG-02',
    title: 'Ward Alert Lock TTL Stored as String Rather Than Numeric Timestamp',
    severity: 'HIGH',
    status: 'RESOLVED',
    description:
      'Original demo stored wardLock expiry as a string timestamp, breaking expiry comparison in JavaScript date math. Fixed to store numeric milliseconds timestamp: { expiresAt: Date.now() + 4*3600*1000 }.',
    file: 'app/(public)/map/page.tsx',
    fixDetails: 'Strictly numeric TTL comparison: Date.now() < wardLocks[31].expiresAt.',
  },
  {
    id: 'CRITIC-BUG-03',
    title: 'Sparkline Component Maximum Value Crash on Flat/Zero Delta Lines',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    description:
      'Sparkline SVGs crashed or divided by zero when all incoming pressure values were uniform. Fixed by introducing Math.max(maxVal, 0.1) and safe fallback range scaling.',
    file: 'components/ui/sparkline.tsx',
    fixDetails: 'Clamped SVG height projection with dynamic pressure threshold color mapping.',
  },
  {
    id: 'CRITIC-BUG-04',
    title: 'TDOA Acoustic Pressure-Wave Propagation Velocity Mislabel',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    description:
      'Prototype previously cited speed of sound in air (343 m/s) instead of acoustic pressure wavefront velocity through water in Asbestos Cement (AC) pipes (1,250 m/s). Corrected in all TDOA triangulation models.',
    file: 'types/telemetry.types.ts & components/gis/tdoa-alert-panel.tsx',
    fixDetails: 'Hydraulically accurate 1,250 m/s acoustic wave velocity applied.',
  },
];

export default function CriticLoopPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
            Engineering Verification
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Full Audit Scorecard
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Architecture Critic Loop & Bug Fix Scorecard
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-3xl">
          Systematic resolution log verifying all four critical bugs, edge cases, 
          and architectural vulnerabilities identified during Senatla Operations internal audits.
        </p>
      </div>

      {/* Grid of 4 Bug Fix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CRITIC_FIXES.map((fix) => (
          <div
            key={fix.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">
                  {fix.id}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 size={12} />
                  <span>{fix.status}</span>
                </span>
              </div>

              <h2 className="text-base font-bold text-white">{fix.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {fix.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Location:</span>
                <span className="text-amber-400">{fix.file}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Resolution:</span>
                <span className="text-emerald-400 font-sans">{fix.fixDetails}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-white">
          Inspect the Production Components in Action
        </h3>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Link
            href="/map"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Verify in GIS Simulator
          </Link>
          <Link
            href="/dossiers"
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Verify LOI Authorization
          </Link>
        </div>
      </div>
    </div>
  );
}
