
'use client';

import { useEffect, useRef } from 'react';
import {
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetWorkflow } from '@/store/slices/kycWorkflowSlice';

export function VerificationComplete() {
  const dispatch = useAppDispatch();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const submission = useAppSelector(
    (state) => state.kycWorkflow.submission,
  );

  const submittedAt = submission?.submittedAt
    ? new Date(submission.submittedAt)
    : null;

  const formattedDate =
    submittedAt && !Number.isNaN(submittedAt.getTime())
      ? new Intl.DateTimeFormat('en-ZA', {
          dateStyle: 'long',
          timeStyle: 'short',
        }).format(submittedAt)
      : null;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function handleStartAgain() {
    dispatch(resetWorkflow());
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section
        aria-labelledby="verification-complete-heading"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10"
      >
        <div
          role="status"
          aria-live="polite"
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50"
        >
          <CheckCircle2
            className="h-11 w-11 text-green-600"
            aria-hidden="true"
          />
          <span className="sr-only">
            Verification successfully submitted
          </span>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-700">
          Verification submitted
        </p>

        <h1
          id="verification-complete-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 text-3xl font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-4"
        >
          You're all done!
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Your identity verification has been successfully submitted.
          We'll review your information and update you on the outcome.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left">
          <div className="flex items-center gap-3">
            <FileCheck2
              className="h-5 w-5 text-slate-600"
              aria-hidden="true"
            />
            <h2 className="text-sm font-medium text-slate-900">
              Submission details
            </h2>
          </div>

          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-xs text-slate-500">
                Reference number
              </dt>
              <dd className="mt-1 break-all font-semibold text-slate-900">
                {submission?.reference ?? 'Unavailable'}
              </dd>
            </div>

            {formattedDate && (
              <div>
                <dt className="text-xs text-slate-500">
                  Submitted on
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {formattedDate}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-left">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
            aria-hidden="true"
          />
          <p className="text-xs leading-5 text-blue-900">
            Your information has been securely submitted. Keep your reference
            number for future enquiries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAgain}
          className="mt-8 min-h-12 w-full rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
        >
          Start a new verification
        </button>
      </section>
    </main>
  );
}
