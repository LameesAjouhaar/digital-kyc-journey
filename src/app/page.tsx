
'use client';

import { KycWelcome } from '@/features/kyc-session/components/KycWelcome';
import { DeviceSelection } from '@/features/device-selection/components/DeviceSelection';
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
import { useAppSelector } from '@/store/hooks';

export default function Home() {
  const currentStep = useAppSelector(
    (state) => state.kycWorkflow.currentStep,
  );

  switch (currentStep) {
    case 'idle':
    case 'error':
      return <KycWelcome />;

    case 'device-selection':
      return <DeviceSelection />;

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

    default:
      return (
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-slate-600">
            Verification in progress...
          </p>
        </main>
      );
  }
}
