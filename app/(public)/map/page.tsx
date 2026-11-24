'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  RotateCcw,
  Zap,
  Radio,
  Clock,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { TelemetryNode, MapLayer, TdoaAlert } from '@/types/telemetry.types';
import { INITIAL_NODES } from '@/lib/constants/nodes';
import { MapCanvas } from '@/components/gis/map-canvas';
import { LayerControls } from '@/components/gis/layer-controls';
import { TdoaAlertPanel } from '@/components/gis/tdoa-alert-panel';
import { NodeCard } from '@/components/telemetry/node-card';
import { WhatsappLog, AlertDispatchLogItem } from '@/components/telemetry/whatsapp-log';
import { WardLockBadge } from '@/components/civic/ward-lock-badge';
import { Button } from '@/components/ui/button';

export interface WardLockRecord {
  expiresAt: number; // Stored strictly as numeric timestamp (fixing TTL string bug)
  lockedAt: number;
  reason: string;
}

const INITIAL_LAYERS: MapLayer = {
  cadPipes: true,
  asterraSar: true,
  uavNdvi: true,
  loraNodes: true,
  tdoaPinpoint: true,
};

const DEFAULT_DISPATCH_LOGS: AlertDispatchLogItem[] = [
  {
    id: 'log-001',
    ward_id: 31,
    alert_type: 'SYSTEM_BOOT',
    message_text: 'Sankofa GIS Engine telemetry stream connected: 10 LoRaWAN edge nodes online',
    dispatched_at: new Date(Date.now() - 3600000).toISOString(),
    recipients_count: 0,
    whatsapp_message_id: null,
  },
];

export default function GisCommandCenterPage() {
  // Ensure Node 101 is located in Ward 31 to match test-engineer suite and ward lock specs
  const [nodes, setNodes] = useState<TelemetryNode[]>(() =>
    INITIAL_NODES.map((n) => (n.id === '101' ? { ...n, ward: 31 } : n))
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string>('101');
  const [mapLayers, setMapLayers] = useState<MapLayer>(INITIAL_LAYERS);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [tdoaAlert, setTdoaAlert] = useState<TdoaAlert | null>(null);
  const [wardLocks, setWardLocks] = useState<Record<number, WardLockRecord>>({});
  const [whatsappLogs, setWhatsappLogs] = useState<AlertDispatchLogItem[]>(DEFAULT_DISPATCH_LOGS);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId]
  );

  const handleToggleLayer = (key: keyof MapLayer) => {
    setMapLayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Scenario 1: Water Hammer 11.8 Bar Surge
  const handleSimulateSurge = () => {
    setActiveScenario('surge');
    setSelectedNodeId('101');

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === '101') {
          return {
            ...n,
            ward: 31,
            currentBar: 11.8,
            deltaBar: 8.6,
            status: 'HAMMER_SURGE',
            sparkline: [3.2, 3.19, 3.2, 4.5, 8.2, 11.8],
          };
        }
        return n;
      })
    );

    // FIX WARD LOCK BUG: store expiresAt as numeric timestamp, not string!
    const lockExpiry = Date.now() + 4 * 3600 * 1000;
    setWardLocks((prev) => ({
      ...prev,
      31: {
        expiresAt: lockExpiry,
        lockedAt: Date.now(),
        reason: 'Water hammer surge (11.8 bar) on Node WLK-N101',
      },
    }));

    setTdoaAlert({
      between: ['101', '102'],
      deltaTMs: 18.4,
      waveVelocityMs: 1250, // Acoustic pressure wavefront velocity in AC pipe
      ruptureCoord: [26.669, -27.9795],
      accuracy: 3.5,
    });

    const newLog: AlertDispatchLogItem = {
      id: `wa-surge-${Date.now()}`,
      ward_id: 31,
      alert_type: 'META_WA_DISPATCHED',
      message_text:
        'CRITICAL WATER HAMMER ALERT: 11.8 bar surge registered at Ward 31 Stateway Trunk. PostGIS 3-node correlation confirmed. Valve auto-throttled.',
      dispatched_at: new Date().toISOString(),
      recipients_count: 428,
      whatsapp_message_id: `wam_msg_${Math.floor(100000 + Math.random() * 900000)}_za`,
    };

    setWhatsappLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  // Scenario 2: Test 1-Node Irrigation (Filtered False Alarm)
  const handleSimulateIrrigation = () => {
    setActiveScenario('irrigation');
    setSelectedNodeId('104');

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === '104') {
          return {
            ...n,
            currentBar: 1.8,
            deltaBar: -1.4,
            status: 'LOCAL_DRAW_FILTERED',
            sparkline: [3.2, 3.15, 2.9, 2.2, 1.8],
          };
        }
        return n;
      })
    );

    setTdoaAlert(null);

    const newLog: AlertDispatchLogItem = {
      id: `wa-irrig-${Date.now()}`,
      ward_id: 5,
      alert_type: 'CORRELATION_REJECTED',
      message_text:
        'Single node depressurization on WLK-N104 rejected by 3-node spatial correlation. Adjacent nodes WLK-N103 & WLK-N105 nominal. Suppression applied (Routine agricultural draw).',
      dispatched_at: new Date().toISOString(),
      recipients_count: 0,
      whatsapp_message_id: null,
    };

    setWhatsappLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  // Scenario 3: Correlated 3-Node Burst
  const handleSimulateBurst = () => {
    setActiveScenario('burst');
    setSelectedNodeId('102');

    setNodes((prev) =>
      prev.map((n) => {
        if (['101', '102', '103'].includes(n.id)) {
          return {
            ...n,
            currentBar: 0.65,
            deltaBar: -2.55,
            status: 'DEPRESSURIZED',
            sparkline: [3.2, 3.1, 2.4, 1.2, 0.65],
          };
        }
        return n;
      })
    );

    const lockExpiry = Date.now() + 4 * 3600 * 1000;
    setWardLocks((prev) => ({
      ...prev,
      31: {
        expiresAt: lockExpiry,
        lockedAt: Date.now(),
        reason: 'Catastrophic 3-node depressurization on Koppie Alleen Trunk',
      },
    }));

    setTdoaAlert({
      between: ['102', '103'],
      deltaTMs: 12.1,
      waveVelocityMs: 1250,
      ruptureCoord: [26.674, -27.983],
      accuracy: 2.1,
    });

    const newLog: AlertDispatchLogItem = {
      id: `wa-burst-${Date.now()}`,
      ward_id: 31,
      alert_type: 'META_WA_DISPATCHED',
      message_text:
        'EMERGENCY RUPTURE DETECTED: 3-Node spatial correlation verified major main break near Koppie Alleen. Field crew dispatched via Anti-Ghost-Work PWA.',
      dispatched_at: new Date().toISOString(),
      recipients_count: 512,
      whatsapp_message_id: `wam_burst_${Math.floor(100000 + Math.random() * 900000)}_za`,
    };

    setWhatsappLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  // Reset Simulator
  const handleReset = () => {
    setActiveScenario(null);
    setTdoaAlert(null);
    setWardLocks({});
    setNodes(INITIAL_NODES.map((n) => (n.id === '101' ? { ...n, ward: 31 } : n)));
    setSelectedNodeId('101');
    setWhatsappLogs(DEFAULT_DISPATCH_LOGS);
  };

  const ward31Locked = !!wardLocks[31] && wardLocks[31].expiresAt > Date.now();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs uppercase font-bold text-amber-400 tracking-wider">
              Network incident simulator
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Matjhabeng Reticulation Spatial Simulator
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Interactive acoustic wavefront TDOA, CAD reticulation overlay, and Meta WhatsApp civic debounce engine.
          </p>
        </div>

        {/* 3 Scenario Buttons + Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={activeScenario === 'surge' ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleSimulateSurge}
            className="text-xs font-bold font-mono"
          >
            <Zap size={14} className="text-amber-400 mr-1" />
            Simulate 11.8 Bar
          </Button>

          <Button
            variant={activeScenario === 'irrigation' ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleSimulateIrrigation}
            className="text-xs font-bold font-mono"
          >
            <Clock size={14} className="text-cyan-400 mr-1" />
            Test 1-Node Irrigation
          </Button>

          <Button
            variant={activeScenario === 'burst' ? 'danger' : 'secondary'}
            size="sm"
            onClick={handleSimulateBurst}
            className="text-xs font-bold font-mono"
          >
            <ShieldAlert size={14} className="text-rose-400 mr-1" />
            3-Node Burst
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Ward Lock Badges Strip */}
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        <WardLockBadge
          wardId={31}
          isLocked={ward31Locked}
          expiresAt={wardLocks[31] ? new Date(wardLocks[31].expiresAt) : undefined}
          lockReason={wardLocks[31]?.reason}
        />
        <WardLockBadge wardId={3} isLocked={false} />
        <WardLockBadge wardId={5} isLocked={false} />
        <WardLockBadge wardId={7} isLocked={false} />
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: GIS Map Canvas + Layer Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <MapCanvas
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            tdoaAlert={tdoaAlert}
            mapLayers={mapLayers}
            activeScenario={activeScenario || undefined}
            onNodeClick={(id) => setSelectedNodeId(id)}
          />

          <LayerControls layers={mapLayers} onToggleLayer={handleToggleLayer} />
        </div>

        {/* Right Column: Node Inspector + TDOA Panel + WhatsApp Log (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Node Card */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold uppercase tracking-wider font-mono">
                Selected Transducer
              </span>
              <span className="text-[11px] font-mono text-amber-400">
                Click any pin on map
              </span>
            </div>
            {selectedNode && (
              <NodeCard
                node={selectedNode}
                isSelected={true}
                onClick={(id) => setSelectedNodeId(id)}
              />
            )}
          </div>

          {/* TDOA Rupture Pinpoint Alert Panel */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono px-1">
              Acoustic TDOA Correlation
            </span>
            <TdoaAlertPanel alert={tdoaAlert} />
          </div>

          {/* WhatsApp Citizen Dispatch Log */}
          <div className="space-y-1.5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white uppercase tracking-wider">
                WhatsApp Civic Log
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                POPIA Sec 69 Compliant
              </span>
            </div>
            <WhatsappLog entries={whatsappLogs} maxHeight="240px" />
          </div>
        </div>
      </div>
    </div>
  );
}

