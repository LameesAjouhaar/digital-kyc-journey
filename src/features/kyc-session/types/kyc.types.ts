import type { DeviceType } from '@/features/device-selection/types/device.types';



export type KycStep =
  | 'idle'
  | 'device-selection'
  | 'document-upload'
  | 'document-validation'
  | 'selfie-capture'
  | 'liveness-check'
  | 'face-match'
  | 'review'
  | 'processing'
  | 'complete'
  | 'error'
  | 'session-expired';


export interface KycWorkflowState {
  currentStep: KycStep;
  previousStep: KycStep | null;
  errorMessage: string | null;
  sessionId: string | null;
  sessionExpiresAt: string | null;
  selectedDevice: DeviceType | null;
  submission: VerificationSubmission | null;
}

export interface VerificationSubmission {
  reference: string;
  submittedAt: string;
}
