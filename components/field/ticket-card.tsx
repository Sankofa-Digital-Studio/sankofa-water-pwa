'use client';

import React from 'react';
import { Wrench, MapPin, Droplets, Calendar, ShieldCheck } from 'lucide-react';
import { RepairTicket, TicketStatus } from '@/types/tickets.types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GeofenceAlert } from './geofence-alert';
import { StageAdvanceButton } from './stage-advance-button';

export interface TicketCardProps {
  ticket: RepairTicket;
  currentGpsDistanceMeters: number;
  onAdvanceStage: (ticketId: string, stageNum: 1 | 2 | 3) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

function getStageIndex(status: TicketStatus): number {
  switch (status) {
    case 'OPEN':
      return 0;
    case 'STAGE_1_EXCAVATED':
      return 1;
    case 'STAGE_2_REPAIRED':
      return 2;
    case 'AUTHORIZED_FOR_PAYMENT':
    case 'CLOSED':
      return 3;
    default:
      return 0;
  }
}

const STAGE_NAMES = [
  'Open Dispatch',
  'Excavation & Shoring',
  'Pipe Replacement & Sleeve',
  'Hydrostatic Pressure & Signoff',
];

export function TicketCard({
  ticket,
  currentGpsDistanceMeters,
  onAdvanceStage,
  isLoading = false,
  className = '',
}: TicketCardProps) {
  const stageNum = getStageIndex(ticket.status);
  const isGeofenceOk = currentGpsDistanceMeters <= 15.0;

  const handleAdvance = (stage: 1 | 2 | 3) => {
    onAdvanceStage(ticket.id, stage);
  };

  return (
    <Card
      className={`border-slate-800 bg-slate-900/90 shadow-xl space-y-4 ${className}`}
      data-testid={`ticket-card-${ticket.id}`}
    >
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex items-start justify-between w-full">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                #{ticket.id.slice(0, 8)}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {ticket.source}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
              <Wrench size={16} className="text-cyan-400" />
              <span>{ticket.pipeSpec}</span>
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-cyan-400">
              Ward {ticket.wardId}
            </span>
            <p className="text-[11px] text-slate-400">{ticket.suburb}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <Droplets size={14} className="text-cyan-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Est. Leak Rate</span>
              <span className="font-mono font-bold text-slate-200">
                {ticket.estimatedFlowKlHr} kL/hr
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <MapPin size={14} className="text-rose-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">GPS Proximity</span>
              <span
                className={`font-mono font-bold ${
                  isGeofenceOk ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {currentGpsDistanceMeters.toFixed(1)}m away
              </span>
            </div>
          </div>
        </div>

        {/* 3-Stage Progress Gauge */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Resolution Progress</span>
            <span className="font-mono text-amber-400 font-bold">
              Stage {stageNum} of 3 ({STAGE_NAMES[stageNum]})
            </span>
          </div>
          <ProgressBar
            value={stageNum}
            max={3}
            colorVariant={stageNum === 3 ? 'success' : 'primary'}
            size="md"
          />
        </div>

        {/* Geofence Alert (shown if outside 15m and stage incomplete) */}
        {!isGeofenceOk && stageNum < 3 && (
          <GeofenceAlert
            distanceMeters={currentGpsDistanceMeters}
            thresholdMeters={15}
          />
        )}

        {/* 3 Stage Buttons */}
        <div className="space-y-2 pt-1">
          {stageNum < 1 && (
            <StageAdvanceButton
              currentStage={stageNum}
              targetStage={1}
              stageName="Excavation & Shoring"
              gpsDistanceMeters={currentGpsDistanceMeters}
              isLoading={isLoading}
              onAdvance={handleAdvance}
            />
          )}

          {stageNum === 1 && (
            <StageAdvanceButton
              currentStage={stageNum}
              targetStage={2}
              stageName="Pipe Replacement & Sleeve"
              gpsDistanceMeters={currentGpsDistanceMeters}
              isLoading={isLoading}
              onAdvance={handleAdvance}
            />
          )}

          {stageNum === 2 && (
            <StageAdvanceButton
              currentStage={stageNum}
              targetStage={3}
              stageName="Hydrostatic Signoff (Payment Auth)"
              gpsDistanceMeters={currentGpsDistanceMeters}
              isLoading={isLoading}
              onAdvance={handleAdvance}
            />
          )}

          {stageNum === 3 && (
            <div
              className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold"
              data-testid="ticket-completed-banner"
            >
              <ShieldCheck size={18} />
              <span>Full 3-Stage PostGIS Audit Complete — Authorized for Payment</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
