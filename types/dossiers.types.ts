// ============================================================
// Sankofa Digital Matjhabeng Water PWA — Dossier Types
// ============================================================

export interface DossierSection {
  title: string;
  content: string;
  highlights?: string[];
}

export interface FinancialTable {
  category: string;
  amountZar: number;
  description: string;
}

export interface RiskItem {
  risk: string;
  mitigation: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Dossier {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  wardScope: string;
  summary: string;
  sections: DossierSection[];
  financials: FinancialTable[];
  risks: RiskItem[];
  capexZar: number;
  opexZarPerMonth: number;
  projectedSavingsZarPerMonth: number;
  paybackMonths: number;
}

export interface SignedDossier {
  id: string;
  dossierCode: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryEmail: string;
  department: string;
  referenceCode: string;
  ipHash: string; // SHA-256 hash of IP (never raw IP for POPIA compliance)
  signedAt: string;
}

export interface SignDossierRequest {
  dossierCode: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryEmail: string;
  department: string;
}
