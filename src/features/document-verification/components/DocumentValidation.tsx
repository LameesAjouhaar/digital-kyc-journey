
'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

import { useAppDispatch } from '@/store/hooks';
import { transitionTo } from '@/store/slices/kycWorkflowSlice';

export function DocumentValidation() {
  const dispatch = useAppDispatch();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleContinue = () => {
    dispatch(transitionTo('selfie-capture'));
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section
        aria-labelledby="document-validation-heading"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2
            size={36}
            className="text-emerald-600"
            aria-hidden="true"
          />
        </div>

        <span
          role="status"
          aria-live="polite"
          className="mt-6 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
        >
          Document verified
        </span>

        <h1
          id="document-validation-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-2xl font-bold text-slate-900 focus-visible:outline-none"
        >
          Your document looks good!
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          We've successfully completed the initial validation
          of your identity document. You're ready for the next
          step.
        </p>

        <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-5 text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={21}
              className="text-emerald-600"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Document validation complete
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Your document passed the simulated validation checks.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Continue to selfie verification
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}
