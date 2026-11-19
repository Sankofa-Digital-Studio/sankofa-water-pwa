'use client';

import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Gauge,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Coins,
  MapPin,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WATER_TARIFF_ZAR_PER_KL } from '@/lib/constants/config';
import { formatZar } from '@/lib/utils/financial.utils';

interface WalkthroughMilestone {
  id: string;
  stepNumber: string;
  title: string;
  phaseBadge: string;
  badgeVariant: 'nominal' | 'surge' | 'depressurized' | 'filtered';
  summary: string;
  pressureState: string;
  burstPreventionImpact: string;
  detailedMechanics: string[];
  operationalOutcome: string;
}

const MILESTONES: WalkthroughMilestone[] = [
  {
    id: 'stage-transient-origin',
    stepNumber: '01',
    title: 'Hydraulic Shockwave Inception (12+ Bar Surge Trigger)',
    phaseBadge: 'Transient Genesis',
    badgeVariant: 'surge',
    summary:
      'Post-load shedding pump reactivations at Koppie Alleen and rapid industrial valving trigger destructive 11.0 to 14.8 bar pressure spikes through brittle Class 10 Asbestos Cement mains rated for only 3.5 bar.',
    pressureState: 'Peak Pressure: 12.4 Bar (354% of Nominal Rating)',
    burstPreventionImpact: 'Initiates pipe wall micro-fissuring and fatigue fractures',
    detailedMechanics: [
      'Stage 4–6 power restoration triggers un-cushioned high-volume centrifugal pump restarts.',
      'Acoustic shockwave propagates at 1,250 m/s down 300mm AC trunk lines along Stateway Avenue.',
      'Without mitigation, repeated transient cycles cause circumferential pipe rupture within 72–120 hours.',
    ],
    operationalOutcome:
      'Transducers intercept the rising edge wave in under 15ms, triggering rapid protection workflows before structural failure occurs.',
  },
  {
    id: 'stage-snubbing-telemetry',
    stepNumber: '02',
    title: 'Edge Transducer Snubbing & LoRaWAN Interrupt Uplink',
    phaseBadge: 'Sub-Millisecond Damping',
    badgeVariant: 'filtered',
    summary:
      'The Boundary Watch node utilizes a sintered bronze orifice snubber to mechanically buffer high-frequency pressure waves while sampling at 1,000 Hz, instantly broadcasting an emergency LoRa packet.',
    pressureState: 'Damped Wavefront: Transient damped by 42% at sensor diaphragm',
    burstPreventionImpact: 'Prevents transducer blowout and captures exact transient profile',
    detailedMechanics: [
      'Piezoresistive sensor measures ΔP > 1.5 bar in under 800 milliseconds.',
      'High-speed interrupt awakens ESP32-C3 from 11.2 µA deep sleep in 3.5 milliseconds.',
      'Signed ChirpStack packet is transmitted over EU868 (+14 dBm) consuming only 0.030 mAh.',
    ],
    operationalOutcome:
      'High-site gateway at Bedelia receives packet and pushes verified HMAC payload to Next.js webhook API in under 2 seconds.',
  },
  {
    id: 'stage-tdoa-triangulation',
    stepNumber: '03',
    title: 'Spatial Coincidence & Acoustic Wavefront Localization',
    phaseBadge: 'Spatial Localization',
    badgeVariant: 'depressurized',
    summary:
      'Server-side PostGIS engine calculates acoustic Time-Difference-of-Arrival (TDOA) across neighboring boundary nodes, pin-pointing the subterranean micro-fissure to ±11.4 meters.',
    pressureState: 'Pressure Delta: -2.4 Bar localized between Node 101 & 102',
    burstPreventionImpact: 'Discovers underground leakage before road collapse or surface sinkholes',
    detailedMechanics: [
      'Sound velocity calibrated for water in asbestos-cement conduits: 1,250 m/s.',
      '3-Node spatial correlation (PostGIS ST_DWithin) eliminates single-tap domestic draw false positives.',
      'Automated 4-hour ward alert debounce mutex prevents dispatch flooding.',
    ],
    operationalOutcome:
      'Precise GPS coordinates generated: crews are guided to the exact 15-meter excavation zone rather than searching kilometers of road.',
  },
  {
    id: 'stage-rapid-intervention',
    stepNumber: '04',
    title: 'Geofenced Dispatch & Active Micro-Rupture Collar Repair',
    phaseBadge: 'Field Containment',
    badgeVariant: 'nominal',
    summary:
      'Field plumbing crews arrive on site with live GPS geofence validation (≤ 15.0m), excavating and applying a Class 16 heavy-duty repair sleeve in 4 hours instead of the historic 120-hour baseline.',
    pressureState: 'Stabilized Line: Static pressure restored to 3.8 Bar nominal',
    burstPreventionImpact: 'Directly converts a potential catastrophic road blowout into an early sleeve repair',
    detailedMechanics: [
      'Mobile Field PWA verifies technician physical proximity (ST_DistanceSphere ≤ 15.0m).',
      'Class 16 split-collar sleeve torqued around micro-fissure under static line pressure.',
      '3-Stage photo attestation captured (Excavation, Sleeve Torque, Backfill Compaction).',
    ],
    operationalOutcome:
      'Turnaround duration slashed from 120 hours down to under 4 hours, preserving water volume before pipe disintegration.',
  },
  {
    id: 'stage-compound-recovery',
    stepNumber: '05',
    title: 'Monthly Cumulative Impact: 18 Bursts Prevented',
    phaseBadge: 'Net Fiscal & Volumetric Recovery',
    badgeVariant: 'nominal',
    summary:
      'By suppressing destructive 12-bar shockwaves and isolating fissures at the micro-fracture stage, 18 major pipeline bursts are completely prevented every month, recovering R 1,028,764.80 in bulk water tariffs.',
    pressureState: 'Reticulation Equilibrium: Wards 3 & 5 transient shocks reduced by 85%',
    burstPreventionImpact: '18 pipe blowouts prevented/month = 60,480 kL water preserved',
    detailedMechanics: [
      'Monthly Volumetric Equation: 18 bursts × 28 kL/hr average flow × 120 hours saved = 60,480 kL/mo.',
      'Financial Recovery Equation: 60,480 kL × R 17.01/kL Vaal Central Tariff = R 1,028,764.80 / month.',
      'Civil Cost Avoidance: Eliminates ~R 810,000 in emergency plant hire, asphalt repaving, and private property flooding claims.',
    ],
    operationalOutcome:
      'Municipal payback on the R 150,000 turn-key pilot is achieved in just 1.3 months (over 6.8× ROI in 90 days), with zero ghost-work fraud.',
  },
];

export function TransientBurstWalkthrough() {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(0);
  const activeMilestone = MILESTONES[selectedMilestoneIndex];

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden print:border-slate-700">
      {/* Card Header */}
      <CardHeader className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                Operational Engineering Walkthrough
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Matjhabeng Reticulation Defense Architecture
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Zap className="text-amber-400 shrink-0" size={24} />
              Hydraulic Transient Suppression & Pipeline Loss Recovery
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              A comprehensive technical explanation of how suppressing destructive 12-bar water hammer surges directly prevents 18 catastrophic pipeline ruptures per month across Welkom’s aged reticulation grid.
            </p>
          </div>

          {/* Quick Metrics Badge Banner */}
          <div className="flex flex-row lg:flex-col gap-2 shrink-0 self-start lg:self-center">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Gauge size={16} className="text-red-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-mono">Pressure Shock Suppressed</span>
                <span className="text-xs font-bold font-mono text-white">12.4 Bar ➔ 3.8 Bar</span>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2">
              <TrendingDown size={16} className="text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-emerald-300 font-mono">Pipeline Ruptures Prevented</span>
                <span className="text-xs font-bold font-mono text-emerald-400">18 Bursts / Month</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Progress Stepper Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-6">
          {MILESTONES.map((m, idx) => {
            const isSelected = idx === selectedMilestoneIndex;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMilestoneIndex(idx)}
                className={`p-3 text-left rounded-xl transition-all border flex flex-col justify-between gap-2 min-h-[72px] ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold text-amber-400">Step {m.stepNumber}</span>
                  <Badge variant={m.badgeVariant} className="text-[10px] px-1.5 py-0">
                    {m.phaseBadge}
                  </Badge>
                </div>
                <span className="text-xs font-semibold leading-tight whitespace-normal">
                  {idx === 0 && '12+ Bar Surge Inception'}
                  {idx === 1 && 'Edge Damping Telemetry'}
                  {idx === 2 && 'PostGIS Wave Localization'}
                  {idx === 3 && 'Geofenced Collar Repair'}
                  {idx === 4 && '18 Bursts Prevented / Mo'}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Milestone Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400">
                PHASE {activeMilestone.stepNumber} OF 05
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">{activeMilestone.phaseBadge}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">{activeMilestone.title}</h3>
          </div>

          <Badge variant={activeMilestone.badgeVariant} className="self-start sm:self-center text-xs">
            {activeMilestone.phaseBadge}
          </Badge>
        </div>

        {/* Narrative Summary */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90 text-sm text-slate-300 leading-relaxed font-light">
          {activeMilestone.summary}
        </div>

        {/* Two Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <Gauge className="text-amber-400 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Hydraulic State
              </span>
              <span className="text-sm font-bold text-white block">
                {activeMilestone.pressureState}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Burst Prevention Correlation
              </span>
              <span className="text-sm font-bold text-emerald-400 block">
                {activeMilestone.burstPreventionImpact}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Mechanics Breakdown */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">
            Physics & Engineering Mechanics
          </span>
          <div className="space-y-2">
            {activeMilestone.detailedMechanics.map((detail, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/70 text-xs sm:text-sm text-slate-300"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 font-mono text-[10px] mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Outcome */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
          <div className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            <strong className="text-emerald-300 block mb-0.5 font-semibold">
              Operational Realization:
            </strong>
            {activeMilestone.operationalOutcome}
          </div>
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSelectedMilestoneIndex((prev) => Math.max(0, prev - 1))}
            disabled={selectedMilestoneIndex === 0}
            className="border-slate-700 text-xs px-3 sm:px-4"
          >
            Previous Stage
          </Button>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            Step {selectedMilestoneIndex + 1} of {MILESTONES.length}
          </span>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() =>
              setSelectedMilestoneIndex((prev) =>
                prev < MILESTONES.length - 1 ? prev + 1 : 0
              )
            }
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 sm:px-4"
          >
            <span>
              {selectedMilestoneIndex < MILESTONES.length - 1
                ? 'Advance to Next Stage'
                : 'Restart Walkthrough'}
            </span>
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
