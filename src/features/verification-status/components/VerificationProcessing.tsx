
'use client';

import { useEffect, useRef } from 'react';
import {
  AlertCircle,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

import { useSubmitVerification } from '../hooks/useSubmitVerification';

export function VerificationProcessing() {
  const hasSubmitted = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useSubmitVerification();

  useEffect(() => {
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      mutate();
    }
  }, [mutate]);

  useEffect(() => {
    if (isError) {
      headingRef.current?.focus();
    }
  }, [isError]);

  function handleRetry() {
    if (isPending) return;

    mutate();
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <section
          role="alert"
          aria-labelledby="submission-error-heading"
          className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle
              className="h-8 w-8 text-red-600"
              aria-hidden="true"
            />
          </div>

          <h1
            id="submission-error-heading"
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-4"
          >
            Submission unsuccessful
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error instanceof Error
              ? error.message
              : 'Something went wrong while submitting your verification.'}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            disabled={isPending}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className="h-4 w-4"
              aria-hidden="true"
            />
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section
        aria-labelledby="submission-processing-heading"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          {isPending ? (
            <LoaderCircle
              className="h-8 w-8 animate-spin text-blue-600"
              aria-hidden="true"
            />
          ) : (
            <ShieldCheck
              className="h-8 w-8 text-blue-600"
              aria-hidden="true"
            />
          )}
        </div>

        <h1
          id="submission-processing-heading"
          className="text-2xl font-semibold text-slate-900"
        >
          Submitting your verification
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          We're securely submitting your information. This should only take a
          moment. Please don't close this page.
        </p>

        <div
          aria-hidden="true"
          className="mt-8 h-2 overflow-hidden rounded-full bg-slate-100"
        >
          <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" />
        </div>

        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-3 text-xs text-slate-500"
        >
          {isPending
            ? 'Processing your submission...'
            : 'Preparing submission...'}
        </p>
      </section>
    </main>
  );
}
