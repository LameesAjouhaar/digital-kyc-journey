
import { configureStore } from '@reduxjs/toolkit';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import kycWorkflowReducer, {
  sessionCreated,
  transitionTo,
} from '@/store/slices/kycWorkflowSlice';
import { submitVerification } from '@/features/verification-status/services/verificationSubmissionService';
import { useSubmitVerification } from '@/features/verification-status/hooks/useSubmitVerification';

vi.mock(
  '@/features/verification-status/services/verificationSubmissionService',
  () => ({
    submitVerification: vi.fn(),
  }),
);

function createTestStore() {
  const store = configureStore({
    reducer: {
      kycWorkflow: kycWorkflowReducer,
    },
  });

  store.dispatch(
    sessionCreated({
      id: 'test-session',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }),
  );

  store.dispatch(transitionTo('document-upload'));
  store.dispatch(transitionTo('document-validation'));
  store.dispatch(transitionTo('selfie-capture'));
  store.dispatch(transitionTo('liveness-check'));
  store.dispatch(transitionTo('face-match'));
  store.dispatch(transitionTo('review'));
  store.dispatch(transitionTo('processing'));

  return store;
}

function renderSubmitVerificationHook() {
  const store = createTestStore();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );

  const hook = renderHook(() => useSubmitVerification(), { wrapper });

  return { ...hook, store, queryClient };
}

describe('useSubmitVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves the submission and completes the workflow after success', async () => {
    vi.mocked(submitVerification).mockResolvedValue({
      success: true,
      reference: 'KYC-12345678',
      submittedAt: '2026-11-24T10:00:00.000Z',
    });

    const { result, store } = renderSubmitVerificationHook();

    await act(async () => {
      await result.current.mutateAsync();
    });

    await waitFor(() => {
      expect(store.getState().kycWorkflow.currentStep).toBe('complete');
    });

    expect(store.getState().kycWorkflow.submission).toEqual({
      reference: 'KYC-12345678',
      submittedAt: '2026-11-24T10:00:00.000Z',
    });

    expect(result.current.isSuccess).toBe(true);
  });

  it('keeps the workflow in processing when submission fails', async () => {
  vi.mocked(submitVerification).mockRejectedValue(
    new Error('Submission failed.'),
  );

  const { result, store } = renderSubmitVerificationHook();

  await act(async () => {
    await expect(result.current.mutateAsync()).rejects.toThrow(
      'Submission failed.',
    );
  });

  expect(store.getState().kycWorkflow.currentStep).toBe('processing');
  expect(store.getState().kycWorkflow.submission).toBeNull();

  await waitFor(() => {
    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe('Submission failed.');
  });
});

  it('allows submission to succeed after an earlier failure', async () => {
    vi.mocked(submitVerification)
      .mockRejectedValueOnce(new Error('Network unavailable.'))
      .mockResolvedValueOnce({
        success: true,
        reference: 'KYC-87654321',
        submittedAt: '2026-11-24T11:00:00.000Z',
      });

    const { result, store } = renderSubmitVerificationHook();

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow(
        'Network unavailable.',
      );
    });

    expect(store.getState().kycWorkflow.currentStep).toBe('processing');

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(store.getState().kycWorkflow.currentStep).toBe('complete');

    expect(store.getState().kycWorkflow.submission?.reference).toBe(
      'KYC-87654321',
    );

    expect(submitVerification).toHaveBeenCalledTimes(2);
  });
});
