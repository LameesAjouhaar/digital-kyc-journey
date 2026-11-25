
'use client';

import { useEffect, useRef } from 'react';
import {
  ClockAlert,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetWorkflow } from '@/store/slices/kycWorkflowSlice';

export function SessionExpired() {
  const dispatch = useAppDispatch();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const previousStep = useAppSelector(
    (state) => state.kycWorkflow.previousStep,
  );

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function handleRestart() {
    dispatch(resetWorkflow());
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section
        aria-labelledby="session-expired-heading"
        className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <ClockAlert
            className="h-10 w-10 text-amber-600"
            aria-hidden="true"
          />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-amber-700">
          Session expired
        </p>

        <h1
          id="session-expired-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 text-2xl font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-4"
        >
          Your verification session has expired
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          For your security, verification sessions are only available for a
          limited time. Your session has expired before the verification
          could be completed.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-left">
          <ShieldAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-slate-500"
            aria-hidden="true"
          />

          <p className="text-xs leading-5 text-slate-600">
            Your previous verification session is no longer active.
            Please start a new session to continue.
          </p>
        </div>

        {previousStep && (
          <p className="mt-5 text-xs text-slate-400">
            Session expired during: {previousStep.replaceAll('-', ' ')}
          </p>
        )}

        <button
          type="button"
          onClick={handleRestart}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
        >
          <RefreshCw
            className="h-4 w-4"
            aria-hidden="true"
          />
          Start a new verification
        </button>
      </section>
    </main>
  );
}
