'use client';

import React from 'react';
import { Layers, ShieldCheck, Cpu } from 'lucide-react';

export type CapexTierId = 'MVP_0' | 'LEAN_DMA' | 'FULL_3_TIER';

export interface CapexTierInfo {
  id: CapexTierId;
  name: string;
  badge: string;
  capexZar: number;
  nodeCount: number;
  coverage: string;
  description: string;
  paybackMonths: number;
}

export const CAPEX_TIERS: CapexTierInfo[] = [
  {
    id: 'MVP_0',
    name: 'Tier 1A: MVP-0 Rapid Pilot',
    badge: '10 Nodes (90-Day Pilot)',
    capexZar: 150000,
    nodeCount: 10,
    coverage: 'Ward 3 CBD & Critical Rupture Points',
    description: 'Turn-key 90-day pilot on Welkom AC high-risk lines (R90k delivery cost, 40% net margin)',
    paybackMonths: 1.3,
  },
  {
    id: 'LEAN_DMA',
    name: 'Lean DMA Pilot',
    badge: '50 Nodes',
    capexZar: 620000,
    nodeCount: 50,
    coverage: 'Wards 3, 5, 7 District Metered Areas',
    description: 'Complete hydraulic boundary isolation with cellular + LoRa gateway failover',
    paybackMonths: 2.8,
  },
  {
    id: 'FULL_3_TIER',
    name: 'Full 3-Tier Municipal System',
    badge: '250 Nodes + SAR + UAV',
    capexZar: 3450000,
    nodeCount: 250,
    coverage: 'All 36 Wards of Matjhabeng Local Municipality',
    description: 'Enterprise integration: IoT, satellite L-band SAR, UAV multispectral, and civic PWA',
    paybackMonths: 4.5,
  },
];

export interface CapexTierSelectorProps {
  selectedTier: CapexTierId;
  onSelectTier: (tier: CapexTierId) => void;
  className?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CapexTierSelector({
  selectedTier,
  onSelectTier,
  className = '',
}: CapexTierSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`} data-testid="capex-tier-selector">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Deployment Architecture Tiers
        </span>
        <span className="text-xs text-amber-400 font-mono">
          Selected: {selectedTier}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CAPEX_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelectTier(tier.id)}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
              data-testid={`capex-tier-${tier.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tier.badge}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {tier.paybackMonths} mo ROI
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{tier.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {tier.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Total CAPEX</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  {formatCurrency(tier.capexZar)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
