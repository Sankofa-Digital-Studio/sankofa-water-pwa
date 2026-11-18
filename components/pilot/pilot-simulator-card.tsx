'use client';

import React, { useState } from 'react';
import {
  Activity,
  MapPin,
  Camera,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Droplets,
  AlertCircle,
  FileCheck2,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WATER_TARIFF_ZAR_PER_KL } from '@/lib/constants/config';
import { formatZar } from '@/lib/utils/financial.utils';

export interface PilotStep {
  step: number;
  phase: string;
  title: string;
  subtitle: string;
  metric: string;
  badge: string;
  badgeVariant: 'nominal' | 'surge' | 'depressurized' | 'filtered';
  description: string;
  technicalDetails: { label: string; value: string }[];
}

const PILOT_STEPS: PilotStep[] = [
  {
    step: 1,
    phase: 'Hourglass Phase 1 & 2: Edge Acoustic Detection',
    title: 'Water Hammer & Hydraulic Transient Detection',
    subtitle: 'Node 101 & 102 (Welkom CBD, Stateway Ave)',
    metric: '11.2 Bar Spike ➔ 0.8 Bar Drop',
    badge: 'BURST_DETECTED',
    badgeVariant: 'surge',
    description:
      'Acoustic transducer detects catastrophic 11.2 bar transient shockwave following load-shedding pump surge against brittle 1974 Class 10 Asbestos Cement pipe.',
    technicalDetails: [
      { label: 'Sampling Frequency', value: '1,000 Hz Edge Interrupt' },
      { label: 'Static Delta (ΔP)', value: '-2.4 Bar within 800ms' },
      { label: 'LoRaWAN Uplink', value: 'EU868 +14dBm (SF9, 1.2s airtime)' },
      { label: 'Battery Impact', value: '0.030 mAh consumed' },
    ],
  },
  {
    step: 2,
    phase: 'Hourglass Phase 3: Spatial TDOA Triangulation',
    title: 'PostGIS Multi-Node Coincidence Localization',
    subtitle: 'Triangulation between Node 101 & Node 102',
    metric: '± 11.4 Meters Circular Error',
    badge: 'TDOA_COINCIDENCE_CONFIRMED',
    badgeVariant: 'depressurized',
    description:
      'Server-side PostGIS engine calculates acoustic time-difference-of-arrival (TDOA) across water wavefront velocity (1,250 m/s), eliminating false alarms from private irrigation.',
    technicalDetails: [
      { label: 'Propagation Velocity', value: '1,250 m/s (AC Pipeline)' },
      { label: 'Time Delta (Δt)', value: '18.4 milliseconds' },
      { label: 'Coordinates', value: '27.9786° S, 26.7352° E' },
      { label: 'Zone Scope', value: 'Ward 3 CBD Transmission Main' },
    ],
  },
  {
    step: 3,
    phase: 'Hourglass Phase 4 & 5: Field Dispatch & Geofencing',
    title: 'Anti-Ghost-Work GPS Attestation (≤ 15.0m)',
    subtitle: 'Mobile Field Crew Dispatched to Ground Zero',
    metric: '8.2m Distance Verified',
    badge: 'GEOFENCE_VALIDATED',
    badgeVariant: 'nominal',
    description:
      'Mobile field plumber arrives on scene. Server-side ST_DistanceSphere confirms physical presence within 8.2 meters of acoustic centroid, permanently blocking ghost-work fraud.',
    technicalDetails: [
      { label: 'Plumber Mobile GPS', value: '± 3.1m DOP accuracy' },
      { label: 'Geofence Constraint', value: 'ST_DistanceSphere ≤ 15.0m' },
      { label: 'Discrepancy Check', value: 'PASS (0.0m violation)' },
      { label: 'Statutory Alignment', value: 'MFMA Section 53' },
    ],
  },
  {
    step: 4,
    phase: 'Hourglass Phase 6: 3-Stage Photographic Proof',
    title: 'Excavation, Class 16 Sleeve & Compaction Verification',
    subtitle: 'Immutable Evidence Ledger for Municipal Audit',
    metric: '3 of 3 Stages Completed',
    badge: 'REPAIR_EVIDENCE_SEALED',
    badgeVariant: 'nominal',
    description:
      'Technician documents each milestone with live WebRTC camera capture. Photos cannot be selected from gallery and are hashed with GPS telemetry.',
    technicalDetails: [
      { label: 'Stage 1: Excavation', value: 'Pothole exposed, pipe fracture documented' },
      { label: 'Stage 2: Sleeve Fitting', value: 'Class 16 heavy-duty clamp bolted @ 4.2 bar' },
      { label: 'Stage 3: Road Restoration', value: 'Sub-base gravel compaction confirmed' },
      { label: 'Proof Integrity', value: 'SHA-256 Photo Hash Bound' },
    ],
  },
  {
    step: 5,
    phase: 'Hourglass Phase 7: Municipal Authorization & Water Saved',
    title: 'MFMA Sec 33 Payment Voucher & Recovered Water',
    subtitle: 'Director of Water Services Digital Authorization',
    metric: '1,680 kL Saved = R 28,576.80',
    badge: 'VOUCHER_AUTHORIZED',
    badgeVariant: 'nominal',
    description:
      'Municipal accounting officer reviews tamper-proof audit trail and authorizes disbursement. Water saved is certified against bulk Vaal Central tariffs.',
    technicalDetails: [
      { label: 'Water Saved (Single Event)', value: '1,680 kL (28 kL/h × 60h saved)' },
      { label: 'Bulk Tariff Recovered', value: 'R 28,576.80 (@ R17.01/kL)' },
      { label: 'Civic Transparency', value: 'Published to Public SLA Portal' },
      { label: 'POPIA Compliance', value: 'Signer IP SHA-256 hashed' },
    ],
  },
];

export function PilotSimulatorCard() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeStep = PILOT_STEPS[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < PILOT_STEPS.length - 1) {
      setIsSimulating(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setIsSimulating(false);
      }, 300);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                Executive Demonstration Mode
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Dr Makaronidou Hourglass Methodology
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Sparkles className="text-amber-400 shrink-0" size={24} />
              Supervised Alert-to-Repair Live Pilot Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
              Demonstrates the complete end-to-end operational cycle that turns undetected subterranean water loss into verified MFMA expenditure reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs border-slate-700 hover:bg-slate-800"
            >
              <RotateCcw size={14} className="mr-1.5" />
              Reset Demo
            </Button>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
              Readiness: 9/10 Validated
            </span>
          </div>
        </div>

        {/* 5-Step Progress Tabs */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-6">
          {PILOT_STEPS.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStepIndex(idx)}
                className={`py-2 px-1 sm:px-3 text-center rounded-lg transition-all border flex flex-col items-center gap-1 ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  ) : (
                    <span className="text-[11px] font-mono font-bold">0{s.step}</span>
                  )}
                </div>
                <span className="text-[10px] font-medium truncate hidden sm:inline-block max-w-full">
                  {s.step === 1 && 'Burst Shock'}
                  {s.step === 2 && 'TDOA Pinpoint'}
                  {s.step === 3 && 'GPS Geofence'}
                  {s.step === 4 && '3-Stage Photo'}
                  {s.step === 5 && 'MFMA Voucher'}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-1">
              {activeStep.phase}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Step {activeStep.step}: {activeStep.title}
            </h3>
            <span className="text-xs text-slate-400">{activeStep.subtitle}</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-white">
              {activeStep.metric}
            </span>
            <Badge variant={activeStep.badgeVariant}>{activeStep.badge}</Badge>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-sm text-slate-300 leading-relaxed font-light bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {activeStep.description}
        </p>

        {/* Technical Data Grid */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Telemetry & Statutory Verification Stream
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {activeStep.technicalDetails.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <span className="text-[11px] text-slate-400 block">{item.label}</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400 mt-1 block">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Visual Stage Mock */}
        {activeStep.step === 1 && (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center gap-2">
              <Activity className="text-red-400 animate-pulse" size={18} />
              <span>Simulated Rupture: Static pressure collapse on Stateway AC 300mm main</span>
            </div>
            <span className="font-mono font-bold text-red-400">ΔP &gt; 1.5 Bar (CRITICAL)</span>
          </div>
        )}

        {activeStep.step === 2 && (
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
            <div className="flex items-center gap-2">
              <MapPin className="text-cyan-400" size={18} />
              <span>PostGIS ST_Distance: Rupture localized 11.4m south of Welkom Central PRV</span>
            </div>
            <span className="font-mono font-bold text-cyan-300">TDOA Confidence: 98.4%</span>
          </div>
        )}

        {activeStep.step === 3 && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-amber-400" size={18} />
              <span>Attestation Engine: Plumber device located 8.2m from fault (Allowed: ≤ 15.0m)</span>
            </div>
            <span className="font-mono font-bold text-emerald-400">ANTI-GHOST LOCK: PASS</span>
          </div>
        )}

        {activeStep.step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold block mb-1">✓ Stage 1: Excavated</span>
              Pothole cleared to 4.2m depth; asbestos pipe fissure inspected.
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold block mb-1">✓ Stage 2: Sleeved</span>
              Class 16 split-collar sleeve torqued; hydrostatic test tight.
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold block mb-1">✓ Stage 3: Compacted</span>
              Layered gravel compaction completed; asphalt patch prepped.
            </div>
          </div>
        )}

        {activeStep.step === 5 && (
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
              <span className="flex items-center gap-2">
                <FileCheck2 size={16} />
                MFMA Section 33 Audit Certificate Issued
              </span>
              <span className="font-mono">VOUCHER #MLM-WAT-2026-089</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block">Water Recovered</span>
                <span className="font-mono font-bold text-white">1,680 kL</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block">Fiscal Value Saved</span>
                <span className="font-mono font-bold text-emerald-400">R 28,576.80</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block">Disbursement Approved</span>
                <span className="font-mono font-bold text-amber-400">R 8,500.00 (Plumber Civil)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="border-slate-700 text-xs"
          >
            Previous Phase
          </Button>

          <span className="text-xs text-slate-400 font-mono">
            Phase {currentStepIndex + 1} of {PILOT_STEPS.length}
          </span>

          {currentStepIndex < PILOT_STEPS.length - 1 ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleNextStep}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Advance Simulation
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleReset}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
            >
              Restart Simulation
              <RotateCcw size={14} className="ml-1.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
