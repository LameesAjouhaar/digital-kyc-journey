
'use client';

import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Activity,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import { useAppDispatch } from '@/store/hooks';
import { transitionTo } from '@/store/slices/kycWorkflowSlice';
import { verifyLiveness } from '../services/livenessService';

export function LivenessVerification() {
  const dispatch = useAppDispatch();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const livenessMutation = useMutation({
    mutationFn: verifyLiveness,
  });

  const handleStartCheck = () => {
    if (livenessMutation.isPending) return;

    livenessMutation.mutate();
  };

  const handleContinue = () => {
    if (livenessMutation.data?.success) {
      dispatch(transitionTo('face-match'));
    }
  };

  const isSuccessful = livenessMutation.data?.success === true;
  const isFailed = livenessMutation.data?.success === false;

  const errorMessage = isFailed
    ? livenessMutation.data?.message
    : livenessMutation.isError
      ? 'We could not connect to the verification service. Please check your connection and try again.'
      : null;

  useEffect(() => {
    headingRef.current?.focus();
  }, [isSuccessful, isFailed, livenessMutation.isError]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section
        aria-labelledby="liveness-heading"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <span className="text-sm font-medium text-blue-700">
          Step 5 of your verification
        </span>

        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          {isSuccessful ? (
            <CheckCircle2 size={34} aria-hidden="true" />
          ) : (
            <Activity size={34} aria-hidden="true" />
          )}
        </div>

        <h1
          id="liveness-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 text-2xl font-bold text-slate-900 focus-visible:outline-none"
        >
          {isSuccessful
            ? 'Liveness check complete'
            : 'Verify that you are present'}
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          {isSuccessful
            ? 'Your liveness check was completed successfully. You can continue to the next verification step.'
            : 'We will perform a quick simulated liveness check to confirm that your selfie represents a live person.'}
        </p>

        {!isSuccessful && (
          <div className="mt-8 rounded-xl bg-slate-50 p-5 text-left">
            <p className="font-semibold text-slate-900">
              Before you continue
            </p>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className="text-emerald-600"
                  aria-hidden="true"
                />
                Make sure your face is clearly visible.
              </li>

              <li className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className="text-emerald-600"
                  aria-hidden="true"
                />
                Ensure you have adequate lighting.
              </li>

              <li className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className="text-emerald-600"
                  aria-hidden="true"
                />
                Keep your face unobstructed.
              </li>
            </ul>
          </div>
        )}

        {livenessMutation.isPending && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5"
          >
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-blue-800">
              Performing liveness verification...
            </p>

            <p className="mt-1 text-xs text-blue-600">
              Please wait while we process your request.
            </p>
          </div>
        )}

        {isSuccessful && livenessMutation.data && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={22}
                className="text-emerald-600"
                aria-hidden="true"
              />

              <div>
                <p className="font-semibold text-emerald-900">
                  Liveness verified
                </p>

                <p className="mt-1 text-sm text-emerald-700">
                  Simulated confidence score:{' '}
                  {livenessMutation.data.confidence}%
                </p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700"
          >
            <AlertCircle
              size={19}
              className="shrink-0"
              aria-hidden="true"
            />

            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-8">
          {isSuccessful ? (
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Continue to face matching
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartCheck}
              disabled={livenessMutation.isPending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {livenessMutation.isPending
                ? 'Verifying...'
                : isFailed || livenessMutation.isError
                  ? 'Try again'
                  : 'Start liveness check'}

              {!livenessMutation.isPending &&
                (isFailed || livenessMutation.isError ? (
                  <RefreshCw size={18} aria-hidden="true" />
                ) : (
                  <ArrowRight size={18} aria-hidden="true" />
                ))}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
