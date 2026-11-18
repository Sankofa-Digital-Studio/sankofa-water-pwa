'use client';

import React from 'react';
import { Wifi, Battery, Radio } from 'lucide-react';
import { TelemetryNode } from '@/types/telemetry.types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Sparkline } from '@/components/ui/sparkline';
import { NodeStatusBadge } from './node-status-badge';

export interface NodeCardProps {
  node: TelemetryNode;
  isSelected?: boolean;
  onClick?: (nodeId: string) => void;
}

function pressureColor(v: number): string {
  if (v > 5) return '#f59e0b'; // amber — surge
  if (v < 2) return '#f43f5e'; // rose — depressurized
  return '#34d399'; // emerald — nominal
}

export function NodeCard({ node, isSelected = false, onClick }: NodeCardProps) {
  // Support both camelCase and snake_case properties
  const wardId = node.ward ?? (node as unknown as { ward_id?: number }).ward_id ?? 0;
  const currentBar = node.currentBar ?? (node as unknown as { current_bar?: number }).current_bar ?? 0;
  const baselineBar = node.baselineBar ?? (node as unknown as { baseline_bar?: number }).baseline_bar ?? 4.0;
  const deltaBar = node.deltaBar ?? (node as unknown as { delta_bar?: number }).delta_bar ?? 0;
  const batteryMv = node.batteryMv ?? (node as unknown as { battery_mv?: number }).battery_mv ?? 3300;
  const rssi = node.rssi ?? (node as unknown as { rssi_dbm?: number }).rssi_dbm ?? -85;
  const snr = node.snr ?? (node as unknown as { snr_db?: number }).snr_db ?? 9.5;
  const sparklineData = node.sparkline ?? (node as unknown as { sparkline_data?: number[] }).sparkline_data ?? [];

  const battPct = Math.min(100, Math.max(0, Math.round(((batteryMv - 3000) / (3650 - 3000)) * 100)));

  return (
    <div
      onClick={() => onClick?.(node.id)}
      className="relative cursor-pointer text-left"
      data-testid={`node-card-${node.id}`}
    >
      <Card
        className={`transition-all duration-200 ${
          isSelected
            ? 'border-amber-500 ring-1 ring-amber-500/50 shadow-amber-500/10'
            : 'hover:border-slate-700'
        }`}
      >
        <CardHeader>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-white">{node.name}</span>
            <span className="text-xs text-slate-400">Ward {wardId} · {node.suburb}</span>
          </div>
          <div data-testid={`node-status-${node.id}`}>
            <NodeStatusBadge status={node.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Pressure gauge */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Pressure</span>
              <span className="font-mono text-white">
                {currentBar.toFixed(2)} bar
                {deltaBar !== 0 && (
                  <span
                    className={deltaBar > 0 ? 'text-amber-400 ml-1' : 'text-cyan-400 ml-1'}
                  >
                    {deltaBar > 0 ? '+' : ''}{deltaBar.toFixed(2)}
                  </span>
                )}
              </span>
            </div>
            <ProgressBar
              value={currentBar}
              max={Math.max(baselineBar * 1.5, 6)}
              colorVariant={
                node.status === 'HAMMER_SURGE'
                  ? 'warning'
                  : node.status === 'DEPRESSURIZED'
                  ? 'danger'
                  : 'success'
              }
              size="sm"
            />
          </div>

          {/* Sparkline */}
          {sparklineData.length > 0 && (
            <div className="py-1">
              <Sparkline
                values={sparklineData}
                maxVal={Math.max(...sparklineData, baselineBar * 1.5, 6)}
                colorFn={pressureColor}
                width={200}
                height={28}
              />
            </div>
          )}

          {/* Battery + RSSI row */}
          <div className="flex gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-xs">
              <Battery
                size={12}
                className={
                  battPct < 20
                    ? 'text-rose-400'
                    : battPct < 50
                    ? 'text-orange-400'
                    : 'text-emerald-400'
                }
              />
              <span className="font-mono text-slate-300">{battPct}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Radio size={12} className="text-cyan-400" />
              <span className="font-mono text-slate-300">{rssi} dBm</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Wifi size={12} className="text-slate-400" />
              <span className="font-mono text-slate-300">{snr.toFixed(1)} SNR</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
