'use client';

import React, { useState } from 'react';
import { Users, FileText, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';

export interface PetitionCardProps {
  id: string;
  title: string;
  wardId: number;
  demandsSummary: string;
  targetSignatures: number;
  currentSignatures: number;
  hasUserSigned?: boolean;
  onSignPetition?: (petitionId: string, asWitness: boolean) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

export function PetitionCard({
  id,
  title,
  wardId,
  demandsSummary,
  targetSignatures,
  currentSignatures,
  hasUserSigned = false,
  onSignPetition,
  isLoading = false,
  className = '',
}: PetitionCardProps) {
  const [isWitness, setIsWitness] = useState(false);
  const [signed, setSigned] = useState(hasUserSigned);

  const pct = Math.min(100, (currentSignatures / (targetSignatures || 1)) * 100);

  const handleSign = async () => {
    if (onSignPetition) {
      await onSignPetition(id, isWitness);
    }
    setSigned(true);
  };

  return (
    <Card
      className={`border-slate-800 bg-slate-900 shadow-xl ${className}`}
      data-testid={`petition-card-${id}`}
    >
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex items-start justify-between w-full">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                Ward {wardId} Community Action
              </span>
              <span className="text-[11px] text-slate-400">Section 17 PAJA Petition</span>
            </div>
            <h3 className="text-base font-bold text-white">{title}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
            <Users size={14} className="text-cyan-400" />
            <span>{currentSignatures.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
          {demandsSummary}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Verified Citizen Signatures</span>
            <span className="font-mono text-cyan-400 font-bold">
              {currentSignatures} / {targetSignatures} ({pct.toFixed(0)}%)
            </span>
          </div>
          <ProgressBar
            value={currentSignatures}
            max={targetSignatures}
            colorVariant="secondary"
            size="sm"
          />
        </div>

        {/* Witness Toggle */}
        {!signed && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <label
              htmlFor={`witness-toggle-${id}`}
              className="flex items-center gap-2 cursor-pointer text-slate-300"
            >
              <HeartHandshake size={15} className="text-amber-400" />
              <span>Stand as Community Witness (Public Civic Record)</span>
            </label>
            <input
              id={`witness-toggle-${id}`}
              type="checkbox"
              checked={isWitness}
              onChange={(e) => setIsWitness(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/40"
              data-testid={`witness-toggle-${id}`}
            />
          </div>
        )}

        {/* Action Button */}
        {signed ? (
          <div
            className="flex items-center justify-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-bold"
            data-testid={`petition-signed-${id}`}
          >
            <CheckCircle2 size={16} />
            <span>Signature Cryptographically Recorded on Public Ledger</span>
          </div>
        ) : (
          <Button
            variant="primary"
            size="md"
            isLoading={isLoading}
            onClick={handleSign}
            className="w-full font-bold"
            data-testid={`sign-petition-btn-${id}`}
          >
            <FileText size={15} />
            <span>Sign Ward {wardId} Water Accountability Petition</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
