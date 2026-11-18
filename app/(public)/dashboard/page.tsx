'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Droplet,
  Coins,
  Scale,
  Calendar,
  Percent,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  CapexTierSelector,
  CapexTierId,
  CAPEX_TIERS,
} from '@/components/financial/capex-tier-selector';
import { RoiSliders, RoiSliderValues } from '@/components/financial/roi-sliders';
import { NrwMetricCard } from '@/components/financial/nrw-metric-card';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { WATER_TARIFF_ZAR_PER_KL } from '@/lib/constants/config';
import { formatZar } from '@/lib/utils/financial.utils';
import { getPilotMarginAnalysis } from '@/lib/services/financial.service';

// Standardized capex values calibrated to municipal models (MVP_0 = R150,000 turn-key pilot)
const TIER_CAPEX_LOOKUP: Record<CapexTierId, number> = {
  MVP_0: 150000, // Standardized Tier 1A MVP-0 Turn-key 90-Day Pilot (40% net margin)
  LEAN_DMA: 620000,
  FULL_3_TIER: 3450000,
};

export default function FinancialDashboardPage() {
  const [selectedTier, setSelectedTier] = useState<CapexTierId>('MVP_0');
  const [sliderValues, setSliderValues] = useState<RoiSliderValues>({
    bursts: 18,
    flowRate: 28,
    hoursSaved: 120,
  });

  const tierInfo = useMemo(
    () => (CAPEX_TIERS.find((t) => t.id === selectedTier) || CAPEX_TIERS[0])!,
    [selectedTier]
  );

  const capexAmount = TIER_CAPEX_LOOKUP[selectedTier];

  // Calculations
  const klSaved = useMemo(() => {
    return sliderValues.bursts * sliderValues.flowRate * sliderValues.hoursSaved;
  }, [sliderValues]);

  const zarRecovered = useMemo(() => {
    return klSaved * WATER_TARIFF_ZAR_PER_KL;
  }, [klSaved]);

  const roiMultiple = useMemo(() => {
    if (capexAmount <= 0) return 0;
    return parseFloat((zarRecovered / capexAmount).toFixed(2));
  }, [zarRecovered, capexAmount]);

  const netSurplus = useMemo(() => {
    return zarRecovered - capexAmount;
  }, [zarRecovered, capexAmount]);

  const annualizedSaving = useMemo(() => {
    return zarRecovered * 12;
  }, [zarRecovered]);

  const projectedNrwPercent = useMemo(() => {
    // Matjhabeng baseline NRW is ~64.2%. Max achievable reduction capped at ~24.5%
    const baselineNrw = 64.2;
    const estimatedReduction = Math.min(24.5, (klSaved / 250000) * 100);
    return Math.max(38.0, parseFloat((baselineNrw - estimatedReduction).toFixed(1)));
  }, [klSaved]);

  const paybackMonths = useMemo(() => {
    if (zarRecovered <= 0) return 999;
    return parseFloat((capexAmount / zarRecovered).toFixed(2));
  }, [capexAmount, zarRecovered]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Tariff: R 17.01 / kL
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Matjhabeng Bulk Water Procurement Model
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Non-Revenue Water Financial ROI Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-light">
            Dynamic capital amortization, non-revenue water recovery calculations, and civil repair expenditure mitigation.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">
              Active Tier Capex
            </span>
            <span className="font-mono text-base font-black text-amber-400">
              {formatZar(capexAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Capex Tier Selector */}
      <CapexTierSelector
        selectedTier={selectedTier}
        onSelectTier={(tier) => setSelectedTier(tier)}
      />

      {/* Main Grid: Interactive Sliders (4 cols) + 6 Metric Cards (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <RoiSliders
            values={sliderValues}
            onChange={(newValues) => setSliderValues(newValues)}
          />

          {/* Quick formula note */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Info size={14} className="text-amber-500" />
              <span>Hydraulic Volume Calculation</span>
            </div>
            <p className="font-mono text-[11px] text-slate-400 leading-relaxed bg-slate-950 p-2 rounded border border-slate-800">
              kL = {sliderValues.bursts} bursts × {sliderValues.flowRate} kL/hr × {sliderValues.hoursSaved} hrs
              <br />
              = <span className="text-emerald-400 font-bold">{klSaved.toLocaleString()} kL</span>
            </p>
          </div>
        </div>

        {/* 6 Metric Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: kL Saved */}
            <StatCard
              label="Monthly Water Saved"
              value={klSaved.toLocaleString()}
              unit="kL / mo"
              trend="up"
              trendLabel="+100% acoustic containment"
            />

            {/* Card 2: ZAR Recovered */}
            <StatCard
              label="Monthly ZAR Recovered"
              value={formatZar(zarRecovered)}
              trend="up"
              trendLabel="Tariff R17.01/kL"
            />

            {/* Card 3: ROI Multiple */}
            <StatCard
              label="Capex Amortization Multiple"
              value={`${roiMultiple}×`}
              trend="up"
              trendLabel={`Payback: ${paybackMonths} mo`}
            />

            {/* Card 4: Net Monthly Surplus */}
            <StatCard
              label="Monthly Net Surplus"
              value={formatZar(netSurplus)}
              trend="up"
              trendLabel="Post-Capex recovery"
            />

            {/* Card 5: Annualized Saving */}
            <StatCard
              label="Annualized Cost Avoidance"
              value={formatZar(annualizedSaving)}
              trend="up"
              trendLabel="12-Month run-rate"
            />

            {/* Card 6: Projected NRW % */}
            <StatCard
              label="Projected Municipal NRW"
              value={`${projectedNrwPercent}%`}
              unit="down from 64.2%"
              trend="down"
              trendLabel="-24.5% target ceiling"
            />
          </div>

          {/* Full NRW Metric Card component */}
          <NrwMetricCard
            klSaved={klSaved}
            zarRecovered={zarRecovered}
            roiMultiple={roiMultiple}
            paybackMonths={paybackMonths}
          />
        </div>
      </div>

      {/* Capex Scope Description Box */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Layers size={20} className="text-amber-500" />
            <h2 className="text-lg font-bold text-white">
              {tierInfo.name} — Scope of Engineering & Municipal Value
            </h2>
          </div>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {tierInfo.badge}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-light">
          {tierInfo.description}. Deployment covers <strong className="text-white">{tierInfo.coverage}</strong> with continuous sub-GHz LoRaWAN edge sensing, automated PostGIS acoustic wavefront triangulation, and anti-ghost-work GPS ticket sign-off.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block">Capital Expenditure (Capex)</span>
            <span className="text-lg font-bold font-mono text-white mt-1 block">
              {formatZar(capexAmount)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block">Target Coverage Density</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
              {tierInfo.coverage}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block">Estimated Payback Period</span>
            <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
              {paybackMonths} Months
            </span>
          </div>
        </div>

        {/* Pilot Cost & 40% Margin Breakdown Card */}
        {selectedTier === 'MVP_0' && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Sankofa MVP-0 Commercial Delivery & Profitability Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Itemized turn-key delivery costs yielding a sustainable 40.0% net operating margin for Sankofa while sitting beneath municipal MFMA 3-quote procurement friction limits.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  Net Margin: 40.0% (+R 60,000)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Total Pilot Fee (Turn-Key)</span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">R 150,000.00</span>
                <span className="text-[10px] text-slate-400">90-Day All-Inclusive</span>
              </div>
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Direct Delivery Cost</span>
                <span className="text-base font-bold font-mono text-slate-300 mt-0.5 block">R 90,000.00</span>
                <span className="text-[10px] text-slate-400">Hardware, civil & support</span>
              </div>
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-emerald-900/40 bg-emerald-950/20">
                <span className="text-xs text-emerald-300 block">Sankofa Net Profit</span>
                <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">R 60,000.00</span>
                <span className="text-[10px] text-emerald-300 font-bold">40.0% Margin Guaranteed</span>
              </div>
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-cyan-900/40 bg-cyan-950/20">
                <span className="text-xs text-cyan-300 block">Municipal Water Saved (90d)</span>
                <span className="text-base font-bold font-mono text-cyan-400 mt-0.5 block">R 514,382.00</span>
                <span className="text-[10px] text-cyan-300 font-bold">3.4× Municipal ROI</span>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Itemized Pilot Work Breakdown (Cost: R90,000)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {getPilotMarginAnalysis().costBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2.5 rounded bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-300">{item.category}</span>
                    <span className="font-mono text-slate-400">{formatZar(item.costZar)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
