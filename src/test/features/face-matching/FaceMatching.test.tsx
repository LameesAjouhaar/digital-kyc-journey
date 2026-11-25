
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
import { verifyFaceMatch } from '@/features/face-matching/services/faceMatchService';
import { FaceMatching } from '@/features/face-matching/components/FaceMatching';

vi.mock('@/features/face-matching/services/faceMatchService', () => ({
  verifyFaceMatch: vi.fn(),
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
  store.dispatch(transitionTo('face-match'));

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
        <FaceMatching />
      </QueryClientProvider>
    </Provider>,
  );

  return { store, user };
}

describe('FaceMatching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays a successful face match and allows continuation', async () => {
    vi.mocked(verifyFaceMatch).mockResolvedValue({
      matched: true,
      confidence: 97.8,
      message: 'Your selfie successfully matched your identity document.',
    });

    const { store, user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /start face matching/i }),
    );

    expect(
      await screen.findByText('Face match confirmed'),
    ).toBeInTheDocument();

    expect(screen.getByText(/97.8%/)).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /continue to review/i }),
    );

    expect(store.getState().kycWorkflow.currentStep).toBe('review');
  });

  it('displays an unsuccessful match message and allows retrying', async () => {
    vi.mocked(verifyFaceMatch).mockResolvedValue({
      matched: false,
      confidence: 42.5,
      message:
        'We could not match your selfie with your identity document. Please try again.',
    });

    const { user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /start face matching/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'We could not match your selfie with your identity document. Please try again.',
    );

    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /continue to review/i }),
    ).not.toBeInTheDocument();
  });

  it('displays a connection error when the matching request fails', async () => {
    vi.mocked(verifyFaceMatch).mockRejectedValue(
      new Error('Network unavailable'),
    );

    const { user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /start face matching/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'We could not connect to the face matching service. Please check your connection and try again.',
    );

    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it('allows an unsuccessful match to be retried successfully', async () => {
    vi.mocked(verifyFaceMatch)
      .mockResolvedValueOnce({
        matched: false,
        confidence: 42.5,
        message: 'Face matching was unsuccessful.',
      })
      .mockResolvedValueOnce({
        matched: true,
        confidence: 97.8,
        message: 'Your selfie successfully matched your identity document.',
      });

    const { store, user } = renderComponent();

    await user.click(
      screen.getByRole('button', { name: /start face matching/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Face matching was unsuccessful.',
    );

    await user.click(
      screen.getByRole('button', { name: /try again/i }),
    );

    expect(
      await screen.findByText('Face match confirmed'),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /continue to review/i }),
    );

    await waitFor(() => {
      expect(store.getState().kycWorkflow.currentStep).toBe('review');
    });

    expect(verifyFaceMatch).toHaveBeenCalledTimes(2);
  });
});
