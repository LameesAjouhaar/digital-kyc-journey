
'use client';

import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  UserRoundCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ScanFace,
} from 'lucide-react';

import { useAppDispatch } from '@/store/hooks';
import { transitionTo } from '@/store/slices/kycWorkflowSlice';
import { verifyFaceMatch } from '../services/faceMatchService';

export function FaceMatching() {
  const dispatch = useAppDispatch();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const faceMatchMutation = useMutation({
    mutationFn: verifyFaceMatch,
  });

  const isMatched = faceMatchMutation.data?.matched === true;
  const isFailed = faceMatchMutation.data?.matched === false;

  const errorMessage = isFailed
    ? faceMatchMutation.data?.message
    : faceMatchMutation.isError
      ? 'We could not connect to the face matching service. Please check your connection and try again.'
      : null;

  useEffect(() => {
    headingRef.current?.focus();
  }, [isMatched, isFailed, faceMatchMutation.isError]);

  const handleStartMatching = () => {
    if (faceMatchMutation.isPending) return;

    faceMatchMutation.mutate();
  };

  const handleContinue = () => {
    if (isMatched) {
      dispatch(transitionTo('review'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section
        aria-labelledby="face-matching-heading"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <span className="text-sm font-medium text-blue-700">
          Step 6 of your verification
        </span>

        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          {isMatched ? (
            <UserRoundCheck size={34} aria-hidden="true" />
          ) : (
            <ScanFace size={34} aria-hidden="true" />
          )}
        </div>

        <h1
          id="face-matching-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 text-2xl font-bold text-slate-900 focus-visible:outline-none"
        >
          {isMatched
            ? 'Identity match successful'
            : 'Confirm your identity'}
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          {isMatched
            ? 'Your selfie has successfully matched the photograph on your identity document.'
            : 'We will compare your selfie with the photograph on your identity document to confirm your identity.'}
        </p>

        {!isMatched && (
          <div className="mt-8 rounded-xl bg-slate-50 p-5 text-left">
            <p className="font-semibold text-slate-900">
              What happens next?
            </p>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <ScanFace size={19} aria-hidden="true" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Facial comparison
                  </p>

                  <p className="text-xs text-slate-500">
                    Compare the selfie with your document photograph.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <ShieldCheck size={19} aria-hidden="true" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Match assessment
                  </p>

                  <p className="text-xs text-slate-500">
                    Generate a simulated confidence score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {faceMatchMutation.isPending && (
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
              Comparing facial features...
            </p>

            <p className="mt-1 text-xs text-blue-600">
              Please wait while we process your verification.
            </p>
          </div>
        )}

        {isMatched && faceMatchMutation.data && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={22}
                className="text-emerald-600"
                aria-hidden="true"
              />

              <div>
                <p className="font-semibold text-emerald-900">
                  Face match confirmed
                </p>

                <p className="mt-1 text-sm text-emerald-700">
                  Simulated confidence score:{' '}
                  {faceMatchMutation.data.confidence}%
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
          {isMatched ? (
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Continue to review
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartMatching}
              disabled={faceMatchMutation.isPending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {faceMatchMutation.isPending
                ? 'Matching...'
                : isFailed || faceMatchMutation.isError
                  ? 'Try again'
                  : 'Start face matching'}

              {!faceMatchMutation.isPending &&
                (isFailed || faceMatchMutation.isError ? (
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
