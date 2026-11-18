'use client';

import React from 'react';
import {
  FileText,
  ShieldAlert,
  Coins,
  Clock,
  Printer,
  BookOpen,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Dossier, SignedDossier, SignDossierRequest } from '@/types/dossiers.types';
import { Button } from '@/components/ui/button';
import { FinancialTable } from './financial-table';
import { SignatureBlock } from './signature-block';

export interface DossierViewerProps {
  dossier: Dossier;
  signedRecord?: SignedDossier | null;
  onSignDossier?: (req: SignDossierRequest) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DossierViewer({
  dossier,
  signedRecord,
  onSignDossier,
  isLoading = false,
  className = '',
}: DossierViewerProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <article
      className={`space-y-6 text-left ${className}`}
      data-testid={`dossier-viewer-${dossier.code}`}
    >
      {/* Dossier Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500 text-slate-950">
                {dossier.code}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Scope: {dossier.wardScope}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {dossier.title}
            </h1>
            <p className="text-sm text-cyan-400 font-medium mt-0.5">
              {dossier.subtitle}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            className="self-start sm:self-auto flex items-center gap-2 text-xs"
            data-testid="print-dossier-btn"
          >
            <Printer size={14} />
            <span>Print Dossier</span>
          </Button>
        </div>

        {/* Executive Summary */}
        <div className="mt-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Executive Summary
          </h3>
          <p className="text-slate-200 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {dossier.summary}
          </p>
        </div>

        {/* Financial Highlights Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total CAPEX</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {formatCurrency(dossier.capexZar)}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">OPEX / Month</span>
            <span className="text-base font-bold text-cyan-400 font-mono">
              {formatCurrency(dossier.opexZarPerMonth)}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Savings / Month</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {formatCurrency(dossier.projectedSavingsZarPerMonth)}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Payback Period</span>
            <span className="text-base font-bold text-white font-mono">
              {dossier.paybackMonths} months
            </span>
          </div>
        </div>
      </div>

      {/* Sections */}
      {dossier.sections.map((section, idx) => (
        <section
          key={idx}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-3"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xs font-mono text-amber-500 font-normal">
              0{idx + 1}.
            </span>
            <span>{section.title}</span>
          </h2>
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {section.content}
          </div>

          {section.highlights && section.highlights.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-cyan-400 block mb-2">
                Key Technical Directives:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {section.highlights.map((h, hIdx) => (
                  <li
                    key={hIdx}
                    className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800"
                  >
                    <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}

      {/* Financial Table */}
      {dossier.financials && dossier.financials.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Coins size={18} className="text-amber-500" />
            <span>Line-Item CAPEX Expenditure Framework</span>
          </div>
          <FinancialTable
            rows={dossier.financials}
            totalCapexZar={dossier.capexZar}
          />
        </section>
      )}

      {/* Risk Matrix */}
      {dossier.risks && dossier.risks.length > 0 && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ShieldAlert size={18} className="text-rose-400" />
            <span>Risk Assessment & Mitigation Matrix</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dossier.risks.map((risk, rIdx) => {
              const isCritical = risk.severity === 'CRITICAL' || risk.severity === 'HIGH';
              return (
                <div
                  key={rIdx}
                  className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      {risk.risk}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        isCritical
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Mitigation: </strong>
                    {risk.mitigation}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Scripture & Ethical Anchorage */}
      <section className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <BookOpen size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Ethical Anchorage & Civic Covenant
            </span>
            <blockquote className="text-xs italic text-slate-300 leading-relaxed">
              &ldquo;For I will pour water on the thirsty land, and streams on the dry ground; I will pour my Spirit upon your offspring, and my blessing on your descendants.&rdquo;
              <footer className="mt-1 font-semibold text-amber-300 not-italic">
                — Isaiah 44:3 · Stewardship of Matjhabeng&apos;s Water Heritage
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* LOI Signing Block */}
      {onSignDossier && (
        <SignatureBlock
          dossierCode={dossier.code}
          signedRecord={signedRecord}
          onSign={onSignDossier}
          isLoading={isLoading}
        />
      )}
    </article>
  );
}
