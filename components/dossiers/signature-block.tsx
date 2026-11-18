'use client';

import React, { useState } from 'react';
import { PenTool, CheckCircle2, ShieldCheck, Hash, UserCheck } from 'lucide-react';
import { SignDossierRequest, SignedDossier } from '@/types/dossiers.types';
import { Button } from '@/components/ui/button';

export interface SignatureBlockProps {
  dossierCode: string;
  signedRecord?: SignedDossier | null;
  onSign: (request: SignDossierRequest) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

export function SignatureBlock({
  dossierCode,
  signedRecord,
  onSign,
  isLoading = false,
  className = '',
}: SignatureBlockProps) {
  const [formData, setFormData] = useState<SignDossierRequest>({
    dossierCode,
    signatoryName: '',
    signatoryTitle: '',
    signatoryEmail: '',
    department: 'Infrastructure & Water Services',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.signatoryName.trim()) {
      setError('Signatory name is required.');
      return;
    }
    if (!formData.signatoryEmail.trim()) {
      setError('Official email address is required.');
      return;
    }

    try {
      await onSign({
        ...formData,
        dossierCode,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to record cryptographic signature.');
      }
    }
  };

  if (signedRecord) {
    return (
      <div
        className={`bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-6 shadow-xl text-left space-y-4 ${className}`}
        data-testid="signed-record-banner"
      >
        <div className="flex items-center gap-3 text-emerald-400">
          <CheckCircle2 size={24} />
          <div>
            <h4 className="font-bold text-base text-white">
              Letter of Intent Formally Executed
            </h4>
            <p className="text-xs text-emerald-300/80">
              Cryptographically timestamped and registered under POPIA-compliant SHA-256 hash.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-500/20 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Signatory</span>
            <span className="font-bold text-white">{signedRecord.signatoryName}</span>
            <span className="text-slate-400 block text-[11px]">{signedRecord.signatoryTitle} ({signedRecord.department})</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">Reference Code</span>
            <span className="font-mono font-bold text-amber-400">{signedRecord.referenceCode}</span>
            <span className="text-slate-500 block text-[10px]">
              Executed: {new Date(signedRecord.signedAt).toLocaleString('en-ZA')}
            </span>
          </div>

          <div className="sm:col-span-2">
            <span className="text-slate-400 block text-[10px]">SHA-256 Audit Digest</span>
            <span className="font-mono text-[10px] text-cyan-400 break-all">
              {signedRecord.ipHash}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl ${className}`}
      data-testid="signature-block"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800 text-white font-bold text-base">
        <PenTool size={18} className="text-amber-500" />
        <span>Execute Letter of Intent (LOI)</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={formData.signatoryName}
              onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
              placeholder="e.g. Adv. T. Mokwena"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              data-testid="input-signatory-name"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Official Title / Capacity *
            </label>
            <input
              type="text"
              required
              value={formData.signatoryTitle}
              onChange={(e) => setFormData({ ...formData, signatoryTitle: e.target.value })}
              placeholder="e.g. Chief Financial Officer / Municipal Manager"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              data-testid="input-signatory-title"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.signatoryEmail}
              onChange={(e) => setFormData({ ...formData, signatoryEmail: e.target.value })}
              placeholder="e.g. mokwena@matjhabeng.gov.za"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              data-testid="input-signatory-email"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Department / Entity
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              data-testid="input-department"
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          By signing, you formally register municipal interest in deploying the Sankofa Digital Matjhabeng Water solution. Execution generates a POPIA-compliant cryptographic audit record.
        </p>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="w-full font-bold flex items-center justify-center gap-2"
          data-testid="submit-signature-btn"
        >
          <ShieldCheck size={16} />
          <span>Authorize & Sign Letter of Intent</span>
        </Button>
      </form>
    </div>
  );
}
