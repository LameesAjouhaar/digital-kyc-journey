
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  KycStep,
  KycWorkflowState,
} from '@/features/kyc-session/types/kyc.types';

const initialState: KycWorkflowState = {
  currentStep: 'idle',
  previousStep: null,
  errorMessage: null,
  sessionId: null,
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
};

const kycWorkflowSlice = createSlice({
  name: 'kycWorkflow',
  initialState,
  reducers: {
    transitionTo: (state, action: PayloadAction<KycStep>) => {
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
      state.previousStep = state.currentStep;
      state.currentStep = 'error';
      state.errorMessage = action.payload;
    },

    resetWorkflow: () => initialState,

sessionCreated: (state, action: PayloadAction<string>) => {
   if (state.currentStep !== 'idle' && state.currentStep !== 'error') {
    return;
  }

  state.sessionId = action.payload;
  state.previousStep = state.currentStep;
  state.currentStep = 'device-selection';
  state.errorMessage = null;

    },

  },
  
});



export const {
  transitionTo,
  setWorkflowError,
  resetWorkflow,
  sessionCreated,
} = kycWorkflowSlice.actions;

export default kycWorkflowSlice.reducer;
