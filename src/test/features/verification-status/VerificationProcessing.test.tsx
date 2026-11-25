import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerificationProcessing } from '@/features/verification-status/components/VerificationProcessing';
import { useSubmitVerification } from '@/features/verification-status/hooks/useSubmitVerification';

vi.mock('@/features/verification-status/hooks/useSubmitVerification', () => ({
  useSubmitVerification: vi.fn(),
}));

const mockedUseSubmitVerification = vi.mocked(useSubmitVerification);

describe('VerificationProcessing', () => {
  const mutate = vi.fn();

  beforeEach(() => {
    mutate.mockClear();

    mockedUseSubmitVerification.mockReturnValue({
      mutate,
      isPending: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useSubmitVerification>);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('automatically starts the submission when the screen loads', () => {
    render(<VerificationProcessing />);

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('heading', {
        name: /submitting your verification/i,
      }),
    ).toBeInTheDocument();
  });

  it('displays an error when submission fails', () => {
    mockedUseSubmitVerification.mockReturnValue({
      mutate,
      isPending: false,
      isError: true,
      error: new Error(
        'We could not submit your verification. Please try again.',
      ),
    } as unknown as ReturnType<typeof useSubmitVerification>);

    render(<VerificationProcessing />);

    expect(
      screen.getByRole('heading', {
        name: /submission unsuccessful/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'We could not submit your verification. Please try again.',
      ),
    ).toBeInTheDocument();
  });

  it('retries the submission when the retry button is clicked', async () => {
    const user = userEvent.setup();

    mockedUseSubmitVerification.mockReturnValue({
      mutate,
      isPending: false,
      isError: true,
      error: new Error('Submission failed.'),
    } as unknown as ReturnType<typeof useSubmitVerification>);

    render(<VerificationProcessing />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(mutate).toHaveBeenCalledTimes(2);
  });
});