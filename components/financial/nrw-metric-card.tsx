import React from 'react';
import { Droplet, Coins, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface NrwMetricCardProps {
  klSaved: number;
  zarRecovered: number;
  roiMultiple: number;
  paybackMonths?: number;
  className?: string;
}

function formatCurrencyZar(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-ZA').format(Math.round(val));
}

export function NrwMetricCard({
  klSaved,
  zarRecovered,
  roiMultiple,
  paybackMonths,
  className = '',
}: NrwMetricCardProps) {
  return (
    <Card
      className={`bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-amber-500/30 shadow-xl shadow-amber-500/5 ${className}`}
      data-testid="nrw-metric-card"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Financial Impact Model
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Non-Revenue Water (NRW) Recovery
            </h3>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
            Tariff: R 17.01/kL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* kL Saved */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Droplet size={18} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Water Loss Prevented
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {formatNumber(klSaved)}
              </span>
              <span className="text-sm font-semibold text-cyan-400">kL</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Direct physical loss mitigation</p>
          </div>

          {/* ZAR Recovered */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Coins size={18} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Revenue Recovered
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-emerald-400 tracking-tight font-mono">
                {formatCurrencyZar(zarRecovered)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Municipal cash-flow preservation</p>
          </div>

          {/* ROI Multiple */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <TrendingUp size={18} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Net ROI Multiple
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-amber-400 tracking-tight font-mono">
                {roiMultiple.toFixed(1)}×
              </span>
              <span className="text-xs font-medium text-slate-400">CAPEX return</span>
            </div>
            {paybackMonths !== undefined && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                <Clock size={12} className="text-amber-500" />
                <span>Payback in ~{paybackMonths} months</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
