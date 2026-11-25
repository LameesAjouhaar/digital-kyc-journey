
'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Camera,
  ShieldCheck,
  ScanFace,
  ArrowRight,
  LockKeyhole,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { transitionTo } from '@/store/slices/kycWorkflowSlice';

const verificationSteps = [
  {
    title: 'Identity document',
    description: 'Your identity document was validated.',
    icon: FileText,
  },
  {
    title: 'Selfie capture',
    description: 'Your selfie was captured successfully.',
    icon: Camera,
  },
  {
    title: 'Liveness verification',
    description: 'Your liveness check was successful.',
    icon: ShieldCheck,
  },
  {
    title: 'Face matching',
    description: 'Your identity photograph was matched.',
    icon: ScanFace,
  },
];

export function VerificationReview() {
  const dispatch = useAppDispatch();

  const currentStep = useAppSelector(
    (state) => state.kycWorkflow.currentStep,
  );

  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = () => {
    if (!confirmed || currentStep !== 'review') return;

    dispatch(transitionTo('processing'));
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10">
          <span className="text-sm font-medium text-blue-700">
            Final step
          </span>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Review your verification
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            You're almost done! Review the completed verification
            steps below before submitting your information.
          </p>
        </header>

        <section
          aria-labelledby="verification-summary-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="verification-summary-heading"
              className="font-semibold text-slate-900"
            >
              Verification summary
            </h2>

            <span
              role="status"
              aria-label="4 of 4 verification steps completed"
              className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
            >
              4 of 4 completed
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {verificationSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={21} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">
                      {step.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {step.description}
                    </p>
                  </div>

                  <CheckCircle2
                    size={21}
                    className="shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>

          <div
            className="my-8 border-t border-slate-100"
            aria-hidden="true"
          />

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <LockKeyhole
                size={20}
                className="mt-0.5 shrink-0 text-blue-700"
                aria-hidden="true"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Your information is protected
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Your information will be handled securely as part
                  of the identity verification process.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="verification-confirmation"
              className="flex cursor-pointer items-start gap-3"
            >
              <input
                id="verification-confirmation"
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                aria-describedby="verification-confirmation-description"
                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              />

              <span
                id="verification-confirmation-description"
                className="text-sm leading-6 text-slate-600"
              >
                I confirm that the information I have provided is
                accurate and that I wish to submit my identity
                verification.
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!confirmed || currentStep !== 'review'}
            aria-disabled={!confirmed || currentStep !== 'review'}
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit verification
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
      </div>
    </main>
  );
}
