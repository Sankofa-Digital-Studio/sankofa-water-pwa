import type { ComponentType, ReactNode } from 'react';

export interface WorkflowStep {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; size?: number; 'aria-hidden'?: boolean }>;
  action: ReactNode;
}

export function WorkflowCards({ steps }: { steps: readonly WorkflowStep[] }) {
  return (
    <ol className="grid list-none gap-4 md:grid-cols-3">
      {steps.map(({ title, description, icon: Icon, action }) => (
        <li key={title} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <Icon className="mb-4 text-cyan-300" size={22} aria-hidden />
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mb-4 mt-2 flex-1 text-sm leading-relaxed text-slate-300">{description}</p>
          <div>{action}</div>
        </li>
      ))}
    </ol>
  );
}

