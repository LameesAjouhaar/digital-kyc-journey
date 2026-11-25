
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { VerificationComplete } from '@/features/verification-status/components/VerificationComplete';
import { store } from '@/store/store';

import {
  resetWorkflow,
  sessionCreated,
  setSubmission,
  transitionTo,
} from '@/store/slices/kycWorkflowSlice';

describe('VerificationComplete', () => {
  beforeEach(() => {
    store.dispatch(resetWorkflow());

    store.dispatch(
      sessionCreated({
        id: 'test-session-123',
        expiresAt: '2026-11-24T09:00:00.000Z',
      }),
    );

    const verificationSteps = [
      'document-upload',
      'document-validation',
      'selfie-capture',
      'liveness-check',
      'face-match',
      'review',
      'processing',
    ] as const;

    verificationSteps.forEach((step) => {
      store.dispatch(transitionTo(step));
    });

    store.dispatch(
      setSubmission({
        reference: 'KYC-AB12CD34',
        submittedAt: '2026-11-24T08:00:00.000Z',
      }),
    );

    store.dispatch(transitionTo('complete'));
  });

  function renderComponent() {
    return render(
      <Provider store={store}>
        <VerificationComplete />
      </Provider>,
    );
  }

  it('displays the successful verification message', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: /you're all done/i }),
    ).toBeInTheDocument();

   expect(
  screen.getByText(
    /your identity verification has been successfully submitted/i,
  ),
).toBeInTheDocument();

  });

  it('displays the submission reference number', () => {
    renderComponent();

    expect(screen.getByText('KYC-AB12CD34')).toBeInTheDocument();
  });

  it('displays the submission date', () => {
    renderComponent();

    expect(screen.getByText('Submitted on')).toBeInTheDocument();

    expect(
      screen.getByText(/24 November 2026/i),
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
    expect(store.getState().kycWorkflow.submission).toBeNull();
  });
});
