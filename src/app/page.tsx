
'use client';

import { KycWelcome } from '@/features/kyc-session/components/KycWelcome';
import { useAppSelector } from '@/store/hooks';

export default function Home() {
  const currentStep = useAppSelector(
    (state) => state.kycWorkflow.currentStep,
  );

  const sessionId = useAppSelector(
    (state) => state.kycWorkflow.sessionId,
  );

  if (currentStep === 'idle' || currentStep === 'error') {
    return <KycWelcome />;
  }

  if (currentStep === 'device-selection') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Your session is ready
          </h1>

          <p className="mt-3 text-slate-600">
            Your verification session has been created successfully.
          </p>

          <p className="mt-4 break-all rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            Session ID: {sessionId}
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Device selection is the next step in your verification journey.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-slate-600">Verification in progress...</p>
    </main>
  );
}
