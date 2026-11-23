
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
  | 'error';

export interface KycWorkflowState {
  currentStep: KycStep;
  previousStep: KycStep | null;
  errorMessage: string | null;
  sessionId: string | null;
}
