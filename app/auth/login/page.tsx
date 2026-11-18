'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowLeft,
  Wrench,
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/field';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      setMessage('Authentication successful. Redirecting...');
      router.push(redirectTo);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your municipal email.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createBrowserClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}${redirectTo}`,
        },
      });

      if (otpError) {
        throw otpError;
      }

      setMessage('Magic link sent to your inbox. Check your municipal email.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to send magic link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo bypass for local developer testing / automated Playwright runs
  const handleDemoSignIn = () => {
    setIsLoading(true);
    setMessage('Entering demo mode as Field Technician...');
    setTimeout(() => {
      router.push(redirectTo);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Return to Public Wiki</span>
          </Link>

          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            S
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            Sankofa Municipal Portal
          </h1>
          <p className="text-xs text-slate-400">
            Internal Operations: Matjhabeng Water Loss Recovery
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setIsMagicLink(false)}
              className={`flex-1 pb-1 text-xs font-semibold text-center border-b-2 transition-colors ${
                !isMagicLink
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Password Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsMagicLink(true)}
              className={`flex-1 pb-1 text-xs font-semibold text-center border-b-2 transition-colors ${
                isMagicLink
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Magic Link OTP
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          {!isMagicLink ? (
            <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300" htmlFor="email">
                  Municipal Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="technician@matjhabeng.gov.za"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold text-xs"
              >
                <span>Sign In to Field Suite</span>
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300" htmlFor="magic-email">
                  Municipal Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    id="magic-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="official@matjhabeng.gov.za"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold text-xs"
              >
                <span>Send Passwordless Magic Link</span>
                <Mail size={14} className="ml-1" />
              </Button>
            </form>
          )}

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block text-center font-mono">
              Testing & Evaluation
            </span>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-medium text-amber-400 flex items-center justify-center gap-2 transition-colors"
            >
              <Wrench size={13} />
              <span>Continue with Field Technician Demo Access</span>
            </button>
          </div>
        </div>

        {/* Security & POPIA notice */}
        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          Authorized personnel only. Access logs are cryptographically hashed and retained under POPIA Section 19 security safeguards.
        </p>
      </div>
    </div>
  );
}
