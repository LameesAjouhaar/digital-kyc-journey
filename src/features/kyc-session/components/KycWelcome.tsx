
'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';

import { KycRequirements } from './KycRequirements';
import { useCreateKycSession } from '../hooks/useCreateKycSession';
import { useAppSelector } from '@/store/hooks';

export function KycWelcome() {
  const createSession = useCreateKycSession();

  const errorMessage = useAppSelector(
    (state) => state.kycWorkflow.errorMessage,
  );

  const handleStartVerification = () => {
    createSession.mutate();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 flex items-center gap-3">
          <div className="rounded-xl bg-blue-700 p-2.5 text-white">
            <ShieldCheck size={25} aria-hidden="true" />
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Digital Verification
          </span>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <section>
            <span className="mb-5 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              Secure identity verification
            </span>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Verify your identity, simply and securely.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
              Complete your identity verification online. You can use your
              current device or switch to your mobile phone when you need
              to capture your documents and selfie.
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleStartVerification}
                disabled={createSession.isPending}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createSession.isPending
                  ? 'Starting verification...'
                  : 'Start verification'}

                {!createSession.isPending && (
                  <ArrowRight size={18} aria-hidden="true" />
                )}
              </button>

              <p className="mt-3 text-sm text-slate-500">
                Your information will be handled securely.
              </p>

              {errorMessage && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {errorMessage}
                </p>
              )}
            </div>
          </section>

          <KycRequirements />
        </div>
      </div>
    </main>
  );
}
