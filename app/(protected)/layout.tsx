import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import {
  Wrench,
  FileCheck2,
  MapPin,
  ShieldCheck,
  LogOut,
  User,
  ArrowLeft,
  Activity,
} from 'lucide-react';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail = 'operator@matjhabeng.gov.za';
  let isAuthenticated = false;

  try {
    const supabase = await createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      isAuthenticated = true;
      userEmail = session.user.email || userEmail;
    } else if (
      process.env.NODE_ENV !== 'test' &&
      process.env.NEXT_PUBLIC_ALLOW_DEMO !== 'true'
    ) {
      redirect('/auth/login');
    }
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    // If env vars are completely missing or auth check fails in strict mode
    if (process.env.NODE_ENV !== 'test' && process.env.NEXT_PUBLIC_ALLOW_DEMO !== 'true') {
      redirect('/auth/login');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Protected Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left Brand & Back Link */}
            <div className="flex items-center gap-4">
              <Link
                href="/map"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Public GIS</span>
              </Link>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow">
                  S
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="font-extrabold text-sm text-white">
                    Sankofa Ops Field Suite
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                    Cryptographic Attestation
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Nav Links */}
            <nav className="flex items-center gap-1 text-xs font-medium">
              <Link
                href="/field"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              >
                <Wrench size={14} className="text-amber-400" />
                <span>Field PWA</span>
              </Link>

              <Link
                href="/dossiers"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              >
                <FileCheck2 size={14} className="text-purple-400" />
                <span>Stakeholder Dossiers</span>
              </Link>
            </nav>

            {/* Right User & Logout */}
            <div className="flex items-center gap-3 text-xs">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <User size={13} className="text-amber-400" />
                <span className="font-mono text-[11px] truncate max-w-[160px]">
                  {userEmail}
                </span>
              </div>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-slate-300 transition-colors font-medium text-xs"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Protected Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Protected Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Anti-Ghost-Work Cryptographic Audit Active</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-400">PostGIS Geofence: 15.0m</span>
          </div>
          <span className="text-[11px] text-slate-600">
            Internal Operations — Matjhabeng Water Loss Recovery
          </span>
        </div>
      </footer>
    </div>
  );
}
