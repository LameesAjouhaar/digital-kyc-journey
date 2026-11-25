import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import reducer, {
  sessionCreated,
  sessionExpired,
} from '@/store/slices/kycWorkflowSlice';

import { SessionExpired } from '@/features/kyc-session/components/SessionExpired';

describe('SessionExpired', () => {
  let store: ReturnType<typeof createStore>;

  function createStore() {
    return configureStore({
      reducer: {
        kycWorkflow: reducer,
      },
    });
  }

  beforeEach(() => {
    store = createStore();

    store.dispatch(
      sessionCreated({
        id: 'test-session-123',
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      }),
    );

    store.dispatch(sessionExpired());
  });

  function renderComponent() {
    return render(
      <Provider store={store}>
        <SessionExpired />
      </Provider>,
    );
  }

  it('displays the session expiry message', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', {
        name: /your verification session has expired/i,
      }),
    ).toBeInTheDocument();
  });

  it('displays the previous workflow step', () => {
    renderComponent();

    expect(
      screen.getByText(/session expired during: device selection/i),
    ).toBeInTheDocument();
  });

  it('resets the workflow when starting a new verification', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByRole('button', {
        name: /start a new verification/i,
      }),
    );

    expect(store.getState().kycWorkflow.currentStep).toBe('idle');
    expect(store.getState().kycWorkflow.sessionId).toBeNull();
    expect(store.getState().kycWorkflow.sessionExpiresAt).toBeNull();
  });
});