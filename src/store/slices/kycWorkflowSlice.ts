
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { DeviceType } from '@/features/device-selection/types/device.types';

import type {
  KycStep,
  KycWorkflowState,
  VerificationSubmission,
} from '@/features/kyc-session/types/kyc.types';

interface SessionCreatedPayload {
  id: string;
  expiresAt: string;
}

const initialState: KycWorkflowState = {
  currentStep: 'idle',
  previousStep: null,
  errorMessage: null,
  sessionId: null,
  sessionExpiresAt: null,
  selectedDevice: null,
  submission: null,
};

const allowedTransitions: Record<KycStep, KycStep[]> = {
  idle: ['device-selection'],
  'device-selection': ['document-upload'],
  'document-upload': ['document-validation'],
  'document-validation': ['selfie-capture'],
  'selfie-capture': ['liveness-check'],
  'liveness-check': ['face-match'],
  'face-match': ['review'],
  review: ['processing'],
  processing: ['complete'],
  complete: [],
  error: ['document-upload', 'selfie-capture', 'review'],
  'session-expired': [],
};

const kycWorkflowSlice = createSlice({
  name: 'kycWorkflow',
  initialState,
  reducers: {
    transitionTo: (state, action: PayloadAction<KycStep>) => {
      if (
        state.currentStep === 'complete' ||
        state.currentStep === 'session-expired'
      ) {
        return;
      }

      const nextStep = action.payload;

      if (nextStep === 'error') {
        state.previousStep = state.currentStep;
        state.currentStep = 'error';
        return;
      }

      if (allowedTransitions[state.currentStep].includes(nextStep)) {
        state.previousStep = state.currentStep;
        state.currentStep = nextStep;
        state.errorMessage = null;
      }
    },

    setWorkflowError: (state, action: PayloadAction<string>) => {
      if (
        state.currentStep === 'complete' ||
        state.currentStep === 'session-expired'
      ) {
        return;
      }

      state.previousStep = state.currentStep;
      state.currentStep = 'error';
      state.errorMessage = action.payload;
    },

    resetWorkflow: () => initialState,

    sessionCreated: (
      state,
      action: PayloadAction<SessionCreatedPayload>,
    ) => {
      if (state.currentStep !== 'idle' && state.currentStep !== 'error') {
        return;
      }

      state.sessionId = action.payload.id;
      state.sessionExpiresAt = action.payload.expiresAt;
      state.previousStep = state.currentStep;
      state.currentStep = 'device-selection';
      state.errorMessage = null;

      // Clear data belonging to any previous session.
      state.selectedDevice = null;
      state.submission = null;
    },

    selectDevice: (state, action: PayloadAction<DeviceType>) => {
      if (state.currentStep !== 'device-selection') {
        return;
      }

      state.selectedDevice = action.payload;

      if (action.payload === 'current') {
        state.previousStep = state.currentStep;
        state.currentStep = 'document-upload';
      }
    },

    setSubmission: (
      state,
      action: PayloadAction<VerificationSubmission>,
    ) => {
      if (state.currentStep !== 'processing') {
        return;
      }

      state.submission = action.payload;
    },

    sessionExpired: (state) => {
      if (
        state.currentStep === 'idle' ||
        state.currentStep === 'complete' ||
        state.currentStep === 'session-expired'
      ) {
        return;
      }

      state.previousStep = state.currentStep;
      state.currentStep = 'session-expired';
      state.errorMessage =
        'Your verification session has expired. Please start a new verification.';
    },
  },
});

export const {
  transitionTo,
  setWorkflowError,
  resetWorkflow,
  sessionCreated,
  selectDevice,
  setSubmission,
  sessionExpired,
} = kycWorkflowSlice.actions;

export default kycWorkflowSlice.reducer;
