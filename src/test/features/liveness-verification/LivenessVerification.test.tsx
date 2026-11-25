
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import kycWorkflowReducer, {
  sessionCreated,
  transitionTo,
} from '@/store/slices/kycWorkflowSlice';
import { verifyLiveness } from '@/features/liveness-verification/services/livenessService';
import { LivenessVerification } from '@/features/liveness-verification/components/LivenessVerification';

vi.mock('@/features/liveness-verification/services/livenessService', () => ({
  verifyLiveness: vi.fn(),
}));

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

  return store;
}

function renderComponent() {
  const store = createTestStore();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LivenessVerification />
      </QueryClientProvider>
    </Provider>,
  );

  return { store, user };
}

describe('LivenessVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays a successful verification result and allows continuation', async () => {
    vi.mocked(verifyLiveness).mockResolvedValue({
      success: true,
      message: 'Liveness verification completed successfully.',
      confidence: 98.5,
    });

    const { store, user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /start liveness check/i }),
    );

    expect(
      await screen.findByText('Liveness verified'),
    ).toBeInTheDocument();

    expect(screen.getByText(/98.5%/)).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /continue to face matching/i }),
    );

    expect(store.getState().kycWorkflow.currentStep).toBe('face-match');
  });

  it('displays an unsuccessful verification message and allows retrying', async () => {
    vi.mocked(verifyLiveness).mockResolvedValue({
      success: false,
      message:
        'Liveness verification was unsuccessful. Please try capturing your selfie again.',
      confidence: 42.5,
    });

    const { user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /start liveness check/i }),
    );

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Liveness verification was unsuccessful. Please try capturing your selfie again.',
    );

    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /continue to face matching/i }),
    ).not.toBeInTheDocument();
  });

  it('displays a connection error when the verification request fails', async () => {
    vi.mocked(verifyLiveness).mockRejectedValue(
      new Error('Network unavailable'),
    );

    const { user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /start liveness check/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'We could not connect to the verification service. Please check your connection and try again.',
    );

    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it('allows a failed verification to be retried successfully', async () => {
    vi.mocked(verifyLiveness)
      .mockResolvedValueOnce({
        success: false,
        message: 'Liveness verification failed.',
        confidence: 42.5,
      })
      .mockResolvedValueOnce({
        success: true,
        message: 'Liveness verification completed successfully.',
        confidence: 98.5,
      });

    const { store, user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /start liveness check/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Liveness verification failed.',
    );

    await user.click(
      screen.getByRole('button', { name: /try again/i }),
    );

    expect(
      await screen.findByText('Liveness verified'),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /continue to face matching/i }),
    );

    await waitFor(() => {
      expect(store.getState().kycWorkflow.currentStep).toBe('face-match');
    });

    expect(verifyLiveness).toHaveBeenCalledTimes(2);
  });
});
