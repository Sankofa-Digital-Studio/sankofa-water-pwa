import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  Radio,
  Layers,
  ShieldCheck,
  TrendingUp,
  MapPin,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Database,
  Smartphone,
  Gauge,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PilotSimulatorCard } from '@/components/pilot/pilot-simulator-card';
import { TransientBurstWalkthrough } from '@/components/pilot/transient-burst-walkthrough';

export const metadata = {
  title: 'Architecture Wiki & Hardware Specification | Sankofa Water',
  description:
    'Sankofa Digital Matjhabeng Water PWA: 4-Layer Edge-to-Civic Architecture, KiCad DRC Hardware BOM, and NRW Telemetry System.',
};

const ARCH_LAYERS = [
  {
    number: '01',
    name: 'Edge Sensing & LoRaWAN Mesh',
    badge: 'Hardware & RF',
    icon: Radio,
    color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    description:
      'Ultra-low power autonomous edge pressure nodes deployed across Welkom trunk lines.',
    highlights: [
      'STM32WL55JC dual-core ARM Cortex-M4/M0+ with integrated LoRa transceiver',
      'Piezoresistive 4–20mA pressure transducer (0–16 bar range, ±0.25% FS accuracy)',
      '11.2 µA average current draw giving 6.8-year lifespan on a single 3000 mAh LiFePO4 cell',
      'LoRaWAN EU868 / SA ISM band with adaptive data rate (SF7–SF12) and 1% duty-cycle compliance',
    ],
  },
  {
    number: '02',
    name: 'Ingestion & Spatial Correlation',
    badge: 'PostGIS & TDOA',
    icon: Database,
    color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30',
    description:
      'ChirpStack v4 webhook ingestion engine with HMAC-SHA256 signature verification.',
    highlights: [
      'Constant-time crypto verification preventing spoofed pressure surges or denial-of-service',
      '3-Node spatial correlation (PostGIS ST_DWithin) to filter out single-point irrigation draws',
      'Time-Difference-of-Arrival (TDOA) acoustic wavefront pinpointing at 1,250 m/s wave speed',
      '4-Hour ward debounce lock preventing community notification fatigue and duplicate dispatches',
    ],
  },
  {
    number: '03',
    name: 'Civic Verification & Anti-Ghost Work',
    badge: 'Field PWA & POPIA',
    icon: Smartphone,
    color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
    description:
      'POPIA Section 69 compliant WhatsApp alerts and tamper-proof GPS-geofenced contractor verification.',
    highlights: [
      'Automated Meta WhatsApp Cloud API alert dispatch to registered Ward 31 residents',
      'Offline-capable technician PWA with IndexedDB write queuing and automatic background sync',
      'Mandatory 3-stage photo and GPS geofence validation (threshold ≤ 15m from pipe coordinate)',
      'Eliminates ghost contractor invoices: repair completion must be cryptographically attested on-site',
    ],
  },
  {
    number: '04',
    name: 'Financial Governance & SDBIP Audit',
    badge: 'Executive Dossiers',
    icon: TrendingUp,
    color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
    description:
      'Live Non-Revenue Water recovery accounting, municipal SDBIP KPI tracking, and signed LOI archives.',
    highlights: [
      'Live tariff accounting at R 17.01/kL recovering up to R 1,027,324.80 per 18 prevented bursts',
      'Municipal SDBIP audit discrepancy flag highlighting gaps between claimed vs verified repairs',
      '5 Formal stakeholder dossiers with digital cryptographic signature block and SHA-256 audit trail',
      'Clear progression roadmap: MVP-0 (R 150,000 / 40% margin) → Lean DMA (R 1.25M) → Full Municipal (R 5.85M)',
    ],
  },
];

const HARDWARE_BOM = [
  {
    component: 'Microcontroller & RF',
    mvp0: 'STM32WL55JC Sub-GHz LoRa SoC (R 185.00)',
    tier3: 'Siemens / Schneider RTU Panel (R 45,000.00)',
    saving: '99.6%',
  },
  {
    component: 'Pressure Transducer',
    mvp0: 'Industrial Ceramic Piezoresistive 0–16 bar G1/4 (R 320.00)',
    tier3: 'Endress+Hauser Cerabar Pressure Transmitter (R 18,500.00)',
    saving: '98.3%',
  },
  {
    component: 'Power Supply',
    mvp0: 'LiFePO4 3.2V 3000mAh 18650 cell + TPS7A02 LDO (R 110.00)',
    tier3: 'Mains 230V drop + 100W Solar + Lead-Acid Cabinet (R 14,200.00)',
    saving: '99.2%',
  },
  {
    component: 'Enclosure & Ingress',
    mvp0: 'IP68 Polycarbonate NEMA-4X with PG7 gland (R 85.00)',
    tier3: 'Stainless 316 Double-Door Kiosk + Concrete Plinth (R 22,000.00)',
    saving: '99.6%',
  },
  {
    component: 'Connectivity & SIM',
    mvp0: 'Unlicensed EU868 LoRaWAN mesh (R 0.00 / mo)',
    tier3: 'APN GSM/LTE cellular data contract (R 350.00 / node / mo)',
    saving: '100%',
  },
  {
    component: 'Total Per Node Cost',
    mvp0: 'R 800.00 / Node (R 90,000 Total Delivery vs R 150,000 Turn-key Fee)',
    tier3: 'R 99,700.00 (Standard Municipal Tender Quotation)',
    saving: '99.2%',
  },
];

export default function ArchitectureWikiPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl space-y-6">
          {/* Phase Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
              Tier 1A: R 150,000 Turn-key Pilot (40% Net Margin)
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-slate-800/80 border border-slate-700">
              Tier 1B: R 1.25M Lean DMA (35 Nodes)
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-slate-800/80 border border-slate-700">
              Tier 2: R 5.85M Full 36-Ward Citywide
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Sankofa Digital Matjhabeng Water PWA
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-light">
            An open, low-power IoT and spatial intelligence architecture designed to halt catastrophic 
            water loss in Matjhabeng Local Municipality. Combines sub-GHz edge acoustic wavefront detection, 
            PostGIS spatial burst correlation, POPIA-compliant civic notification, and anti-ghost-work field proof.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:gap-3"
            >
              <MapPin size={18} />
              <span>Launch GIS Command Center</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
            >
              <TrendingUp size={18} className="text-cyan-400" />
              <span>Explore NRW Financial ROI</span>
            </Link>

            <Link
              href="/dossiers"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition-colors"
            >
              <FileCheck2 size={18} className="text-purple-400" />
              <span>Review Stakeholder Dossiers</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Proverbs Scripture Banner */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center shadow-lg">
        <div className="max-w-3xl mx-auto space-y-2">
          <p className="text-amber-300 font-serif text-lg sm:text-xl italic">
            &ldquo;Be diligent to know the state of your flocks, and look well to your herds; for riches do not endure forever, nor a crown to all generations.&rdquo;
          </p>
          <p className="text-amber-400/80 font-mono text-xs uppercase tracking-widest">
            Proverbs 27:23–24 · Principle of Continuous Asset Stewardship
          </p>
        </div>
      </section>

      {/* Live Supervised Pilot Simulator (Hourglass Methodology) */}
      <section id="pilot-simulator" className="space-y-4 scroll-mt-24">
        <PilotSimulatorCard />
      </section>

      {/* Hydraulic Transient Suppression & Pipeline Loss Recovery Walkthrough */}
      <section id="transient-recovery-walkthrough" className="space-y-4 scroll-mt-24">
        <TransientBurstWalkthrough />
      </section>

      {/* 4-Layer Architecture Cards */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            System Stack
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            4-Layer End-to-End Operational Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARCH_LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.number}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-500">
                      LAYER {layer.number}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-semibold bg-gradient-to-r ${layer.color}`}
                    >
                      {layer.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60">
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{layer.name}</h3>
                  </div>

                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {layer.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Core Specifications
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {layer.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hardware BOM Table (Tier 3 vs MVP 0) */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            Frugal Engineering & Cost Reduction
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Hardware Bill of Materials: MVP-0 vs Legacy Tender
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-3xl">
            South African municipalities have historically been trapped in inflated SCADA vendor contracts. 
            Sankofa replaces imported proprietary RTUs with open-source sub-GHz telemetry at less than 1% of the capital cost.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Subsystem</th>
                <th className="p-4 text-emerald-400">Sankofa MVP-0 (10 Nodes)</th>
                <th className="p-4 text-rose-400">Legacy Municipal Tender</th>
                <th className="p-4 text-right">Cost Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {HARDWARE_BOM.map((row, i) => (
                <tr
                  key={i}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    i === HARDWARE_BOM.length - 1 ? 'bg-amber-500/10 font-bold' : ''
                  }`}
                >
                  <td className="p-4 font-medium text-white">{row.component}</td>
                  <td className="p-4 text-emerald-300 font-mono">{row.mvp0}</td>
                  <td className="p-4 text-rose-300/80 font-mono line-through">{row.tier3}</td>
                  <td className="p-4 text-right font-mono text-amber-400 font-bold">
                    -{row.saving}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* KiCad DRC Specs Panel */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Hardware Design Verification
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            KiCad DRC & Embedded RF Specs Panel
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Cpu size={18} className="text-cyan-400" />
              <span>PCB Fabrication Rules</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Layer Stack:</span>
                <span className="font-mono font-bold text-white">2-Layer FR4 (1.6mm)</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Copper Weight:</span>
                <span className="font-mono font-bold text-white">1 oz (35µm) Outer</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Min Trace / Spacing:</span>
                <span className="font-mono font-bold text-emerald-400">6 / 6 mil DRC Passed</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Min Drill Via:</span>
                <span className="font-mono font-bold text-white">0.3mm drill / 0.6mm pad</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Finish:</span>
                <span className="font-mono font-bold text-white">HASL Lead-Free (RoHS)</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Radio size={18} className="text-amber-400" />
              <span>RF & Antenna Matching</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Frequency Band:</span>
                <span className="font-mono font-bold text-white">EU868 (868.1–868.5 MHz)</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">TX Power:</span>
                <span className="font-mono font-bold text-white">+14 dBm (25 mW EIRP)</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Trace Impedance:</span>
                <span className="font-mono font-bold text-emerald-400">50Ω Microstrip Coplanar</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Return Loss (S11):</span>
                <span className="font-mono font-bold text-white">&lt; -18.2 dB at 868MHz</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Antenna Connector:</span>
                <span className="font-mono font-bold text-white">SMA Female Edge-Mount</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Zap size={18} className="text-purple-400" />
              <span>Power Budget & Ingress</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Sleep Current:</span>
                <span className="font-mono font-bold text-emerald-400">11.2 µA (Deep Sleep)</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">TX Pulse Energy:</span>
                <span className="font-mono font-bold text-white">22 mA for 48 ms</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Daily Draw:</span>
                <span className="font-mono font-bold text-white">268.8 µAh / 24 hours</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Theoretical Battery Life:</span>
                <span className="font-mono font-bold text-amber-400">6.8 Years (3000mAh)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Ingress Rating:</span>
                <span className="font-mono font-bold text-white">IP68 (Submersible 2m)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom Navigation CTA */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">
          Experience the Interactive Municipal Simulator
        </h3>
        <p className="text-sm text-slate-300 max-w-xl mx-auto font-light">
          Trigger real-time 11.8 bar water hammer shockwaves, test irrigation correlation filters, 
          and simulate field crew GPS stage advancements.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/map"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
          >
            Open GIS Command Center
          </Link>
          <Link
            href="/field"
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
          >
            Technician Field PWA
          </Link>
        </div>
      </section>
    </div>
  );
}
