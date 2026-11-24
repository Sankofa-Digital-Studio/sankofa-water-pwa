import Link from 'next/link';
import { ArrowDown, ArrowRight, Droplets, MapPin, ClipboardCheck, ChartNoAxesCombined } from 'lucide-react';
import { PilotSimulatorCard } from '@/components/pilot/pilot-simulator-card';

export const metadata = {
  title: 'Municipal Water Loss Pilot',
  description: 'Walk through a simulated water network incident and evaluate a supervised municipal pilot in Matjhabeng.',
};

import { WorkflowCards } from '@/components/ui/workflow-cards';

const workflow = [
  { title: 'Triage a pressure event', body: 'Review a simulated pressure anomaly on the network map and decide whether it warrants a crew visit.', href: '/map', action: 'Open demo map', icon: MapPin },
  { title: 'Record the field outcome', body: 'A technician records arrival, work performed and closeout evidence for supervisor review.', href: '/field', action: 'Open technician workspace', icon: ClipboardCheck },
  { title: 'Review the business case', body: 'Vary the assumptions behind the savings model and identify which inputs the pilot needs to measure.', href: '/dashboard', action: 'Explore the financial model', icon: ChartNoAxesCombined },
];

export default function PilotHome() {
  return (
    <div className="space-y-12 pb-12 sm:space-y-16">
      <section className="relative isolate grid gap-10 overflow-hidden rounded-3xl border border-cyan-900/70 bg-gradient-to-br from-[#102b35] via-[#0b171e] to-slate-950 px-6 py-10 sm:px-12 sm:py-16 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-800 bg-cyan-950 px-3 py-1.5 text-xs font-semibold text-cyan-200">
            <Droplets size={15} aria-hidden="true" /> Matjhabeng pilot proposal
          </p>
          <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">From pressure alert to verified repair.</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
            Sankofa Water gives municipal teams one workflow to investigate suspected water losses, record field evidence and review response performance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pilot-simulator" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 font-bold text-slate-950 hover:bg-cyan-200">Run the pilot demo <ArrowDown size={17} aria-hidden="true" /></a>
            <a href="#pilot-scope" className="inline-flex min-h-12 items-center rounded-xl border border-slate-600 px-5 font-semibold text-white hover:bg-slate-800">Review pilot scope</a>
          </div>
        </div>
        <div className="self-center rounded-2xl border border-cyan-800/60 bg-slate-950/70 p-5 sm:p-7">
          <h2 className="text-lg font-bold text-white">What the pilot must prove</h2>
          <dl className="mt-2 divide-y divide-slate-800">
            <div className="py-4"><dt className="font-semibold text-cyan-200">Alerts operators can act on</dt><dd className="mt-1 text-sm text-slate-300">Measure actionable alerts and false alarms against supervisor review.</dd></div>
            <div className="py-4"><dt className="font-semibold text-cyan-200">Repairs supervisors can verify</dt><dd className="mt-1 text-sm text-slate-300">Measure response times and the share of closeouts with accepted evidence.</dd></div>
            <div className="pt-4"><dt className="font-semibold text-cyan-200">Economics grounded in field data</dt><dd className="mt-1 text-sm text-slate-300">Record installation and support costs, then compare outcomes with the baseline.</dd></div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="workflow-title">
        <h2 id="workflow-title" className="mb-5 text-2xl font-bold text-white">Walk through an incident</h2>
        <WorkflowCards steps={workflow.map(({ title, body, href, action, icon }) => ({
          title,
          description: body,
          icon,
          action: (
            <Link href={href} className="inline-flex min-h-11 items-center gap-2 font-semibold text-cyan-200 hover:underline">
              {action}<ArrowRight size={16} aria-hidden="true" />
            </Link>
          ),
        }))} />
      </section>

      <section id="pilot-simulator" aria-labelledby="demo-title" className="space-y-4 scroll-mt-32">
        <div>
          <h2 id="demo-title" className="text-2xl font-bold text-white">Supervised pilot demo</h2>
          <p className="mt-2 text-slate-300">This walkthrough uses simulated incidents and modelled savings.</p>
        </div>
        <PilotSimulatorCard />
      </section>

      <section id="pilot-scope" aria-labelledby="scope-title" className="scroll-mt-32 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-9">
        <h2 id="scope-title" className="text-2xl font-bold text-white">Proposed first deployment</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">Start with one agreed network segment, a municipal control-room lead, and a field supervisor. Agree on the baseline period, measurement method and success thresholds before installation. Keep dispatch decisions with the municipal team.</p>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">Hardware commissioning, municipal approval and on-device workflow validation are pending. Use measured detection quality, repair evidence and full delivery costs to decide whether to expand.</p>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">Compare the pilot with the existing dispatch workflow on the same network segment. Record whether crews respond sooner, whether supervisors can accept more closeouts on first review, and how much staff time each case consumes.</p>
        <Link href="/architecture" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-cyan-200 hover:underline">Review technical design <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}

