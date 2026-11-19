'use client';

import React from 'react';
import { FileText, Shield, Sparkles, Building, Landmark } from 'lucide-react';
import { Dossier } from '@/types/dossiers.types';

export interface DossierSelectorProps {
  dossiers: Array<Pick<Dossier, 'id' | 'code' | 'title' | 'wardScope'>>;
  selectedCode: string;
  onSelectCode: (code: string) => void;
  className?: string;
}

const DOSSIER_ICONS: Record<string, React.ReactNode> = {
  DOS_01: <Building size={16} className="text-amber-400" />,
  DOS_02: <Shield size={16} className="text-cyan-400" />,
  DOS_03: <Sparkles size={16} className="text-emerald-400" />,
  DOS_04: <Landmark size={16} className="text-indigo-400" />,
  DOS_05: <FileText size={16} className="text-rose-400" />,
};

export function DossierSelector({
  dossiers,
  selectedCode,
  onSelectCode,
  className = '',
}: DossierSelectorProps) {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${className}`}
      data-testid="dossier-selector"
      role="tablist"
      aria-label="Water Strategy Dossiers"
    >
      {dossiers.map((d) => {
        const isSelected = selectedCode === d.code;
        const icon = DOSSIER_ICONS[d.code] || <FileText size={16} className="text-slate-400" />;

        return (
          <button
            key={d.code}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCode(d.code)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              isSelected
                ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            data-testid={`dossier-tab-${d.code}`}
          >
            {icon}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-amber-400 text-[11px]">{d.code}</span>
                <span className="whitespace-nowrap">{d.title}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal">
                {d.wardScope}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
