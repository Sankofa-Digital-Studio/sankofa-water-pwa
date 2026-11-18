import React from 'react';
import Link from 'next/link';
import {
  Activity,
  MapPin,
  TrendingUp,
  Wrench,
  FileCheck2,
  Cpu,
  BookOpen,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { href: '/', label: 'Architecture', icon: Cpu, exact: true },
  { href: '/map', label: 'GIS Command Center', icon: MapPin },
  { href: '/dashboard', label: 'Financial ROI', icon: TrendingUp },
  { href: '/field', label: 'Field PWA', icon: Wrench, protectedBadge: true },
  { href: '/sla', label: 'SLA Portal', icon: ShieldCheck },
  { href: '/critic', label: 'Critic Loop', icon: Activity },
  { href: '/dossiers', label: 'Dossiers', icon: FileCheck2, protectedBadge: true },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Proverbs 27:23 Scripture Ticker Bar */}
      <aside
        aria-label="Scripture banner"
        className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4"
      >
        <div className="flex items-center gap-2 mx-auto">
          <BookOpen size={14} className="text-amber-400 shrink-0" />
          <span className="font-serif italic font-medium">
            &ldquo;Be diligent to know the state of your flocks, and look well to your herds; for riches do not endure forever, nor a crown to all generations.&rdquo;
          </span>
          <span className="font-semibold text-amber-400 font-mono text-[11px] uppercase tracking-wider">
            — Proverbs 27:23–24
          </span>
        </div>
      </aside>

      {/* Main Public Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    Sankofa Water
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                    Matjhabeng Non-Revenue Water
                  </span>
                </div>
              </Link>
            </div>

            {/* 7-Tab Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-xs"
                  >
                    <Icon size={14} className="text-amber-500/80" />
                    <span>{item.label}</span>
                    {item.protectedBadge && (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-mono">
                        auth
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Status Pill & Auth CTA */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>10 Nodes Active</span>
              </div>
              <Link
                href="/auth/login"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Row */}
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-900 scrollbar-none text-xs">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 hover:text-white whitespace-nowrap shrink-0 border border-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Sankofa Digital Water</span>
            <span className="text-slate-600">|</span>
            <span>Matjhabeng Non-Revenue Water PWA</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-amber-400">Target NRW: 64.2% → 38.0%</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Free State, South Africa</span>
            <Link href="/auth/login" className="hover:text-slate-300 transition-colors">
              Technician Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
