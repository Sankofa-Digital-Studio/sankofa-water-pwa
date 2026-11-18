'use client';

import React from 'react';
import { Layers, Activity, Eye, Radio, ShieldAlert } from 'lucide-react';
import { MapLayer } from '@/types/telemetry.types';

export interface LayerControlsProps {
  layers: MapLayer;
  onToggleLayer: (layerKey: keyof MapLayer) => void;
  className?: string;
}

interface LayerOption {
  key: keyof MapLayer;
  label: string;
  description: string;
  icon: React.ReactNode;
  badgeColor: string;
}

const LAYER_CONFIGS: LayerOption[] = [
  {
    key: 'cadPipes',
    label: 'CAD Pipe Network',
    description: 'Underground AC/PVC reticulation mains',
    icon: <Layers size={14} className="text-cyan-400" />,
    badgeColor: 'border-cyan-500/40 text-cyan-400',
  },
  {
    key: 'loraNodes',
    label: 'LoRa Telemetry Nodes',
    description: '10 pressure monitoring IoT nodes',
    icon: <Radio size={14} className="text-amber-400" />,
    badgeColor: 'border-amber-500/40 text-amber-400',
  },
  {
    key: 'asterraSar',
    label: 'Asterra SAR Soil Moisture',
    description: 'L-band microwave subsurface anomalies',
    icon: <Activity size={14} className="text-indigo-400" />,
    badgeColor: 'border-indigo-500/40 text-indigo-400',
  },
  {
    key: 'uavNdvi',
    label: 'UAV Multispectral NDVI',
    description: 'High-vigor vegetation proxy clusters',
    icon: <Eye size={14} className="text-emerald-400" />,
    badgeColor: 'border-emerald-500/40 text-emerald-400',
  },
  {
    key: 'tdoaPinpoint',
    label: 'TDOA Acoustic Vector',
    description: 'Wave propagation cross-correlation pinpoint',
    icon: <ShieldAlert size={14} className="text-rose-400" />,
    badgeColor: 'border-rose-500/40 text-rose-400',
  },
];

export function LayerControls({
  layers,
  onToggleLayer,
  className = '',
}: LayerControlsProps) {
  return (
    <div
      className={`bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl ${className}`}
      data-testid="layer-controls"
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-300">
        <Layers size={14} className="text-amber-400" />
        <span>GIS Sensor Layers</span>
      </div>

      <div className="space-y-2">
        {LAYER_CONFIGS.map((layer) => {
          const isChecked = !!layers[layer.key];
          return (
            <label
              key={layer.key}
              className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${
                isChecked
                  ? 'bg-slate-800/80 border border-slate-700/60'
                  : 'bg-slate-950/40 border border-transparent hover:border-slate-800'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleLayer(layer.key)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/40"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {layer.icon}
                  <span className="text-xs font-medium text-slate-200 truncate">
                    {layer.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {layer.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
