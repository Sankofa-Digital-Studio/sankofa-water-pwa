'use client';

import React, { useMemo } from 'react';
import { TelemetryNode, MapLayer, TdoaAlert } from '@/types/telemetry.types';

export interface MapCanvasProps {
  nodes: TelemetryNode[];
  selectedNodeId?: string | null | undefined;
  tdoaAlert?: TdoaAlert | null | undefined;
  mapLayers: MapLayer;
  activeScenario?: string | undefined;
  onNodeClick?: ((nodeId: string) => void) | undefined;
  className?: string | undefined;
}

// Convert geographic coordinates to SVG viewport (1000 x 680)
function projectCoords(lng: number, lat: number): { x: number; y: number } {
  // If coordinates are already screen coordinates (e.g., 0-1000)
  if (lng > 50 && lng < 950 && lat > 50 && lat < 650) {
    return { x: lng, y: lat };
  }

  // Welkom/Matjhabeng bounds:
  // Lng: ~26.62 to ~26.89 (Span ~0.27)
  // Lat: ~-27.85 to ~-28.12 (Span ~0.27)
  const minLng = 26.62;
  const maxLng = 26.89;
  const maxLat = -27.85; // north
  const minLat = -28.12; // south

  const normX = (lng - minLng) / (maxLng - minLng);
  const normY = (maxLat - lat) / (maxLat - minLat);

  const x = Math.max(60, Math.min(940, normX * 820 + 90));
  const y = Math.max(60, Math.min(620, normY * 500 + 80));

  return { x, y };
}

export function MapCanvas({
  nodes,
  selectedNodeId,
  tdoaAlert,
  mapLayers,
  activeScenario,
  onNodeClick,
  className = '',
}: MapCanvasProps) {
  // Map projected nodes
  const projectedNodes = useMemo(() => {
    return nodes.map((n) => {
      const coord = projectCoords(n.x, n.y);
      return {
        ...n,
        svgX: coord.x,
        svgY: coord.y,
      };
    });
  }, [nodes]);

  // Projected TDOA pinpoint
  const projectedTdoa = useMemo(() => {
    if (!tdoaAlert) return null;
    const [tLng, tLat] = tdoaAlert.ruptureCoord;
    const { x, y } = projectCoords(tLng, tLat);

    const nodeA = projectedNodes.find((n) => n.id === tdoaAlert.between[0]);
    const nodeB = projectedNodes.find((n) => n.id === tdoaAlert.between[1]);

    return {
      x,
      y,
      nodeA,
      nodeB,
      accuracy: tdoaAlert.accuracy,
    };
  }, [tdoaAlert, projectedNodes]);

  // Pipe network links between nodes
  const pipeLines = useMemo(() => {
    if (projectedNodes.length === 0) return [];
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; id: string; material: string }> = [];

    // Pre-defined pipe segments connecting Welkom nodes logically
    const pairs = [
      ['101', '102'],
      ['102', '103'],
      ['103', '104'],
      ['104', '105'],
      ['105', '106'],
      ['101', '109'],
      ['109', '110'],
      ['106', '107'],
      ['107', '108'],
    ];

    pairs.forEach(([fromId, toId]) => {
      const from = projectedNodes.find((n) => n.id === fromId || n.name.includes(fromId));
      const to = projectedNodes.find((n) => n.id === toId || n.name.includes(toId));
      if (from && to) {
        lines.push({
          id: `${from.id}-${to.id}`,
          x1: from.svgX,
          y1: from.svgY,
          x2: to.svgX,
          y2: to.svgY,
          material: from.material || 'AC',
        });
      }
    });

    return lines;
  }, [projectedNodes]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl select-none ${className}`}
      data-testid="gis-map-canvas"
    >
      <svg
        viewBox="0 0 1000 680"
        className="w-full h-auto block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(51, 65, 85, 0.25)"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Sub-grid Pattern */}
          <pattern id="subgrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="rgba(51, 65, 85, 0.12)"
              strokeWidth="0.4"
            />
          </pattern>

          {/* Asterra SAR Gradient */}
          <radialGradient id="sarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </radialGradient>

          {/* TDOA Rupture Shockwave Gradient */}
          <radialGradient id="tdoaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#e11d48" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#be123c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Cartographic Grid */}
        <rect width="1000" height="680" fill="#020617" />
        <rect width="1000" height="680" fill="url(#subgrid)" />
        <rect width="1000" height="680" fill="url(#grid)" />

        {/* Municipal Boundary & Suburb Polygons */}
        <g opacity="0.3" stroke="#1e293b" strokeWidth="1" fill="#090d16">
          <polygon points="120,80 380,60 520,140 460,320 280,360 90,260" />
          <polygon points="460,320 720,290 890,390 820,580 540,540 380,420" />
          <polygon points="280,360 480,340 520,530 310,610 140,520" />
        </g>

        {/* Suburb Labeling */}
        <text x="210" y="110" fill="#334155" fontSize="11" fontWeight="600" letterSpacing="1">
          ODENDAALSRUS (WARD 11)
        </text>
        <text x="230" y="270" fill="#334155" fontSize="11" fontWeight="600" letterSpacing="1">
          WELKOM CBD (WARD 3)
        </text>
        <text x="440" y="230" fill="#334155" fontSize="11" fontWeight="600" letterSpacing="1">
          RIEBEECKSTAD (WARD 5)
        </text>
        <text x="260" y="470" fill="#334155" fontSize="11" fontWeight="600" letterSpacing="1">
          THABONG (WARD 7)
        </text>
        <text x="680" y="440" fill="#334155" fontSize="11" fontWeight="600" letterSpacing="1">
          VIRGINIA (WARD 9)
        </text>

        {/* LAYER: Asterra SAR Soil Moisture Anomalies */}
        {mapLayers.asterraSar && (
          <g id="layer-asterra-sar" className="transition-opacity duration-300">
            <circle cx="260" cy="290" r="75" fill="url(#sarGlow)" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
            <circle cx="490" cy="260" r="90" fill="url(#sarGlow)" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
            <circle cx="730" cy="460" r="110" fill="url(#sarGlow)" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
            <text x="265" y="295" fill="#a5b4fc" fontSize="9" opacity="0.8">SAR POI-104 (L-band)</text>
            <text x="735" y="465" fill="#a5b4fc" fontSize="9" opacity="0.8">SAR POI-108 (High Moisture)</text>
          </g>
        )}

        {/* LAYER: UAV Multispectral NDVI High-Vigor Vegetation */}
        {mapLayers.uavNdvi && (
          <g id="layer-uav-ndvi" className="transition-opacity duration-300">
            {/* NDVI Contours indicating subterranean moisture seepage */}
            <polygon
              points="450,230 495,245 480,285 435,270"
              fill="#10b981"
              fillOpacity="0.22"
              stroke="#34d399"
              strokeWidth="1.5"
            />
            <polygon
              points="700,430 760,420 780,480 720,490"
              fill="#10b981"
              fillOpacity="0.22"
              stroke="#34d399"
              strokeWidth="1.5"
            />
            <text x="440" y="222" fill="#6ee7b7" fontSize="9" fontWeight="600">
              NDVI +0.72 (Vegetation Stress Anomaly)
            </text>
          </g>
        )}

        {/* LAYER: CAD Pipe Network */}
        {mapLayers.cadPipes && (
          <g id="layer-cad-pipes" className="transition-opacity duration-300">
            {pipeLines.map((pipe) => {
              const isAc = pipe.material === 'AC';
              return (
                <g key={pipe.id}>
                  {/* Outer glow line */}
                  <line
                    x1={pipe.x1}
                    y1={pipe.y1}
                    x2={pipe.x2}
                    y2={pipe.y2}
                    stroke={isAc ? '#38bdf8' : '#22d3ee'}
                    strokeWidth="3.5"
                    strokeOpacity="0.3"
                  />
                  {/* Core pipe line */}
                  <line
                    x1={pipe.x1}
                    y1={pipe.y1}
                    x2={pipe.x2}
                    y2={pipe.y2}
                    stroke={isAc ? '#0284c7' : '#0891b2'}
                    strokeWidth="1.8"
                    strokeDasharray={isAc ? 'none' : '4 2'}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* LAYER: TDOA Acoustic Rupture Pinpoint */}
        {mapLayers.tdoaPinpoint && projectedTdoa && (
          <g id="layer-tdoa-pinpoint" className="transition-opacity duration-300">
            {/* Vector between reporting nodes */}
            {projectedTdoa.nodeA && projectedTdoa.nodeB && (
              <line
                x1={projectedTdoa.nodeA.svgX}
                y1={projectedTdoa.nodeA.svgY}
                x2={projectedTdoa.nodeB.svgX}
                y2={projectedTdoa.nodeB.svgY}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
            )}

            {/* Shockwave Rings */}
            <circle
              cx={projectedTdoa.x}
              cy={projectedTdoa.y}
              r="48"
              fill="url(#tdoaGlow)"
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="4 2"
              className="animate-pulse"
            />
            <circle
              cx={projectedTdoa.x}
              cy={projectedTdoa.y}
              r="24"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.5"
            />
            <circle
              cx={projectedTdoa.x}
              cy={projectedTdoa.y}
              r="6"
              fill="#f43f5e"
            />

            {/* Crosshair target */}
            <line x1={projectedTdoa.x - 14} y1={projectedTdoa.y} x2={projectedTdoa.x + 14} y2={projectedTdoa.y} stroke="#ffffff" strokeWidth="1.5" />
            <line x1={projectedTdoa.x} y1={projectedTdoa.y - 14} x2={projectedTdoa.x} y2={projectedTdoa.y + 14} stroke="#ffffff" strokeWidth="1.5" />

            {/* Pinpoint Label */}
            <g transform={`translate(${projectedTdoa.x + 16}, ${projectedTdoa.y - 12})`}>
              <rect width="135" height="24" rx="4" fill="#881337" fillOpacity="0.9" stroke="#f43f5e" strokeWidth="1" />
              <text x="6" y="15" fill="#ffe4e6" fontSize="10" fontWeight="700">
                TDOA PINPOINT ±{projectedTdoa.accuracy}m
              </text>
            </g>
          </g>
        )}

        {/* LAYER: LoRa Telemetry Nodes */}
        {mapLayers.loraNodes && (
          <g id="layer-lora-nodes">
            {projectedNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isSurge = node.status === 'HAMMER_SURGE';
              const isDepressurized = node.status === 'DEPRESSURIZED';

              let nodeColor = '#34d399'; // nominal emerald
              if (isSurge) nodeColor = '#f59e0b'; // surge amber
              if (isDepressurized) nodeColor = '#f43f5e'; // depressurized rose

              const currentBar = node.currentBar ?? (node as unknown as { current_bar?: number }).current_bar ?? 0;

              return (
                <g
                  key={node.id}
                  onClick={() => onNodeClick?.(node.id)}
                  className="cursor-pointer group"
                  transform={`translate(${node.svgX}, ${node.svgY})`}
                >
                  {/* Pulse ring for surge / depressurized */}
                  {(isSurge || isDepressurized || isSelected) && (
                    <circle
                      r={isSelected ? '20' : '16'}
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer selection border */}
                  {isSelected && (
                    <circle
                      r="16"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r="8.5"
                    fill="#0f172a"
                    stroke={nodeColor}
                    strokeWidth="2.5"
                    className="transition-transform group-hover:scale-125"
                  />
                  <circle r="3" fill={nodeColor} />

                  {/* Node Label Card */}
                  <g transform="translate(12, -10)" className="pointer-events-none">
                    <rect
                      x="0"
                      y="-4"
                      width="76"
                      height="22"
                      rx="4"
                      fill="#020617"
                      fillOpacity="0.85"
                      stroke={isSelected ? '#f59e0b' : '#334155'}
                      strokeWidth="1"
                    />
                    <text x="5" y="10" fill="#f8fafc" fontSize="9" fontWeight="700">
                      {node.name}
                    </text>
                    <text x="46" y="10" fill={nodeColor} fontSize="9" fontWeight="600" textAnchor="start">
                      {currentBar.toFixed(1)}b
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        )}

        {/* Map Legend / Status Inset */}
        <g transform="translate(20, 610)">
          <rect width="320" height="48" rx="8" fill="#020617" fillOpacity="0.9" stroke="#1e293b" strokeWidth="1" />
          <circle cx="20" cy="24" r="5" fill="#34d399" />
          <text x="32" y="28" fill="#94a3b8" fontSize="10">Nominal</text>

          <circle cx="95" cy="24" r="5" fill="#f59e0b" />
          <text x="107" y="28" fill="#94a3b8" fontSize="10">Hammer Surge</text>

          <circle cx="200" cy="24" r="5" fill="#f43f5e" />
          <text x="212" y="28" fill="#94a3b8" fontSize="10">Depressurized</text>
        </g>

        {/* Scale & North Arrow */}
        <g transform="translate(930, 40)">
          <polygon points="0,-18 5,-4 0,-7 -5,-4" fill="#38bdf8" />
          <polygon points="0,-7 5,-4 0,10 -5,-4" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
          <text x="0" y="-22" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">N</text>
        </g>
      </svg>
    </div>
  );
}
