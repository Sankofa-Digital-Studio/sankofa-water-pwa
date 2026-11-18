'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Users,
  Search,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { SdbipKpiBar } from '@/components/civic/sdbip-kpi-bar';
import { PetitionCard } from '@/components/civic/petition-card';

const MUNICIPAL_KPIS = [
  {
    kpiCode: 'SDBIP-WAT-01',
    title: 'Burst Pipe Response Time (< 24 Hours from Report)',
    municipalPercent: 88,
    citizenVerifiedPercent: 41,
    targetPercent: 85,
  },
  {
    kpiCode: 'SDBIP-WAT-02',
    title: 'Continuous Water Supply Reliability (> 95% Uptime in Welkom)',
    municipalPercent: 92,
    citizenVerifiedPercent: 63,
    targetPercent: 95,
  },
  {
    kpiCode: 'SDBIP-WAT-03',
    title: 'Non-Revenue Water Reduction to Sub-40% Target',
    municipalPercent: 54,
    citizenVerifiedPercent: 36,
    targetPercent: 40,
  },
  {
    kpiCode: 'SDBIP-WAT-04',
    title: 'Water Quality Compliance (SANS 241 Potable Testing)',
    municipalPercent: 98,
    citizenVerifiedPercent: 89,
    targetPercent: 99,
  },
];

const CIVIC_PETITIONS = [
  {
    id: 'PET-2024-W31-01',
    title: 'Ward 31 Emergency Replacement of Asbestos-Cement Trunk Mains',
    wardId: 31,
    demandsSummary:
      'Urgent capital expenditure reallocation to replace 40-year-old brittle AC piping along Stateway Avenue causing chronic basement flooding.',
    targetSignatures: 500,
    currentSignatures: 384,
  },
  {
    id: 'PET-2024-W05-02',
    title: 'Ward 5 Riebeeckstad Automatic Pressure Limiter Installation',
    wardId: 5,
    demandsSummary:
      'Mandatory installation of surge-relief PRVs to protect residential plumbing from 8.5 bar nighttime pressure surges.',
    targetSignatures: 250,
    currentSignatures: 219,
  },
];

export default function SlaPortalPage() {
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  const handleAuditClick = (kpiCode: string) => {
    setAuditNotice(
      `Discrepancy Audit Triggered for ${kpiCode}: Requesting cross-examination of municipal SCADA logs against citizen IoT telemetry under Section 32 of PAIA.`
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
            Civic Oversight & SDBIP Audit
          </span>
          <span className="text-xs text-slate-400 font-mono">
            MFMA Sec 53 Reconciliation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Municipal Service Level Agreement (SLA) Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-3xl">
          Independent cross-verification between Matjhabeng municipal reported performance indicators 
          and IoT sensor telemetry verified by local citizens.
        </p>
      </div>

      {auditNotice && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0 text-amber-400" />
          <span>{auditNotice}</span>
        </div>
      )}

      {/* SDBIP KPIs Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck size={18} className="text-cyan-400" />
          <span>Service Delivery & Budget Implementation Plan (SDBIP) Audit</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MUNICIPAL_KPIS.map((kpi) => (
            <SdbipKpiBar
              key={kpi.kpiCode}
              kpiCode={kpi.kpiCode}
              title={kpi.title}
              municipalPercent={kpi.municipalPercent}
              citizenVerifiedPercent={kpi.citizenVerifiedPercent}
              targetPercent={kpi.targetPercent}
              onAuditClick={handleAuditClick}
            />
          ))}
        </div>
      </div>

      {/* Civic Petitions & Ward Petitions */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users size={18} className="text-purple-400" />
          <span>Community Water Petitions & Infrastructure Demands</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CIVIC_PETITIONS.map((pet) => (
            <PetitionCard
              key={pet.id}
              id={pet.id}
              title={pet.title}
              wardId={pet.wardId}
              demandsSummary={pet.demandsSummary}
              targetSignatures={pet.targetSignatures}
              currentSignatures={pet.currentSignatures}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
