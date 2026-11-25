
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

import { DocumentUpload } from '@/features/document-verification/components/DocumentUpload';
import { DocumentValidation } from '@/features/document-verification/components/DocumentValidation';
import { SelfieCapture } from '@/features/selfie-verification/components/SelfieCapture';
import { LivenessVerification } from '@/features/liveness-verification/components/LivenessVerification';
import { FaceMatching } from '@/features/face-matching/components/FaceMatching';
import { VerificationReview } from '@/features/review/components/VerificationReview';
import {
  VerificationProcessing,
} from '@/features/verification-status/components/VerificationProcessing';
import {
  VerificationComplete,
} from '@/features/verification-status/components/VerificationComplete';
import { SessionExpired } from '@/features/kyc-session/components/SessionExpired';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  sessionCreated,
  selectDevice,
} from '@/store/slices/kycWorkflowSlice';

function MobileVerificationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(
    (state) => state.kycWorkflow.currentStep,
  );

  const [sessionInitialised, setSessionInitialised] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    // Initialise this device's local workflow using the
    // session ID supplied by the QR code.
    dispatch(
  sessionCreated({
    id: sessionId,
    expiresAt: new Date(
      Date.now() + 15 * 60 * 1000,
    ).toISOString(),
  }),
);

    // Skip device selection because the user is already on mobile.
    dispatch(selectDevice('current'));

    setSessionInitialised(true);
  }, [dispatch, sessionId]);

  if (!sessionId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle
            size={36}
            className="mx-auto text-red-500"
            aria-hidden="true"
          />

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Invalid verification link
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            We couldn't find a verification session associated with
            this link. Please return to your original device and try again.
          </p>
        </section>
      </main>
    );
  }

  if (!sessionInitialised) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Preparing your mobile verification...
        </p>
      </main>
    );
  }

  switch (currentStep) {
    case 'document-upload':
      return <DocumentUpload />;

    case 'document-validation':
      return <DocumentValidation />;

    case 'selfie-capture':
      return <SelfieCapture />;

    case 'liveness-check':
      return <LivenessVerification />;

    case 'face-match':
      return <FaceMatching />;

    case 'review':
      return <VerificationReview />;

    case 'processing':
      return <VerificationProcessing />;

    case 'complete':
      return <VerificationComplete />;

    case 'session-expired':
      return <SessionExpired />;

    case 'error':
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle
              size={36}
              className="mx-auto text-red-500"
              aria-hidden="true"
            />
            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Verification error
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Something went wrong with your verification. Please try again.
            </p>
          </section>
        </main>
      );

    default:
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <ShieldCheck
              size={36}
              className="mx-auto text-blue-700"
              aria-hidden="true"
            />
            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Preparing verification
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Your mobile verification journey is being prepared.
            </p>
          </section>
        </main>
      );
  }
}

export default function MobileVerificationPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">
            Loading verification session...
          </p>
        </main>
      }
    >
      <MobileVerificationContent />
    </Suspense>
  );
}
