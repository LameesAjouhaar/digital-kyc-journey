import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import reducer, {
  sessionCreated,
  selectDevice,
} from '@/store/slices/kycWorkflowSlice';

import { SessionExpiryMonitor } from '@/features/kyc-session/components/SessionExpiryMonitor';

function createTestStore(expiresAt: string) {
  const store = configureStore({
    reducer: {
      kycWorkflow: reducer,
    },
  });

  store.dispatch(
    sessionCreated({
      id: 'test-session-123',
      expiresAt,
    }),
  );

  store.dispatch(selectDevice('current'));

  return store;
}

describe('SessionExpiryMonitor', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

 it('expires the session when its expiry timestamp has passed', async () => {
  const store = createTestStore(
    new Date(Date.now() - 1000).toISOString(),
  );


    render(
      <Provider store={store}>
        <SessionExpiryMonitor />
      </Provider>,
    );

    await waitFor(() => {
      expect(store.getState().kycWorkflow.currentStep).toBe(
        'session-expired',
      );
    });
  });

  it('expires an active session when the timer reaches its expiry time', async () => {
    vi.useFakeTimers();

    const now = new Date('2026-11-24T10:00:00.000Z');

    vi.setSystemTime(now);

    const expiresAt = new Date(
      now.getTime() + 2000,
    ).toISOString();

    const store = createTestStore(expiresAt);

    render(
      <Provider store={store}>
        <SessionExpiryMonitor />
      </Provider>,
    );

    expect(store.getState().kycWorkflow.currentStep).toBe(
      'document-upload',
    );

    await vi.advanceTimersByTimeAsync(2000);

    expect(store.getState().kycWorkflow.currentStep).toBe(
      'session-expired',
    );
  });

  it('does not expire a completed workflow', () => {
   const store = createTestStore(
  new Date(Date.now() - 1000).toISOString(),
);

    store.dispatch({
      type: 'kycWorkflow/transitionTo',
      payload: 'document-validation',
    });

    store.dispatch({
      type: 'kycWorkflow/transitionTo',
      payload: 'selfie-capture',
    });

    store.dispatch({
      type: 'kycWorkflow/transitionTo',
      payload: 'liveness-check',
    });

    store.dispatch({
      type: 'kycWorkflow/transitionTo',
      payload: 'face-match',
    });

    store.dispatch({
      type: 'kycWorkflow/transitionTo',
      payload: 'review',
    });

    store.dispatch({
      type: 'kycWorkflow/transitionTo',
      payload: 'processing',
    });

    store.dispatch({
      type: 'kycWorkflow/transitionTo',
      payload: 'complete',
    });

    render(
      <Provider store={store}>
        <SessionExpiryMonitor />
      </Provider>,
    );

    expect(store.getState().kycWorkflow.currentStep).toBe('complete');
  });
});