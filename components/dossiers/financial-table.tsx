import React from 'react';
import { FinancialTable as FinancialTableRow } from '@/types/dossiers.types';

export interface FinancialTableProps {
  rows: FinancialTableRow[];
  totalCapexZar?: number;
  className?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FinancialTable({
  rows,
  totalCapexZar,
  className = '',
}: FinancialTableProps) {
  const calculatedTotal = rows.reduce((sum, r) => sum + r.amountZar, 0);
  const total = totalCapexZar !== undefined ? totalCapexZar : calculatedTotal;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-md ${className}`}
      data-testid="dossier-financial-table"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider">
              <th scope="col" className="px-4 py-3">Category</th>
              <th scope="col" className="px-4 py-3">Line Description</th>
              <th scope="col" className="px-4 py-3 text-right">CAPEX Allocation (ZAR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-800/40 transition-colors text-slate-300"
              >
                <td className="px-4 py-3 font-medium text-amber-400 whitespace-nowrap">
                  {row.category}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {row.description}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-white whitespace-nowrap">
                  {formatCurrency(row.amountZar)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-700 bg-slate-950 text-white font-bold">
              <td colSpan={2} className="px-4 py-3 uppercase tracking-wider text-slate-300">
                Total Budget Requirement
              </td>
              <td className="px-4 py-3 text-right font-mono text-base text-amber-400 whitespace-nowrap">
                {formatCurrency(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
