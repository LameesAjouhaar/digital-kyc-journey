import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitVerification } from '@/features/verification-status/services/verificationSubmissionService';

describe('submitVerification', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('submits verification successfully', async () => {
    vi.useFakeTimers();

    const submissionPromise = submitVerification();

    await vi.advanceTimersByTimeAsync(2000);

    const result = await submissionPromise;

    expect(result.success).toBe(true);
    expect(result.reference).toMatch(/^KYC-[A-F0-9]{8}$/);
    expect(new Date(result.submittedAt).toString()).not.toBe('Invalid Date');
  });

  it('throws an error when submission fails', async () => {
    vi.useFakeTimers();

    const submissionPromise = submitVerification({
      simulateFailure: true,
    });

    const expectation = expect(submissionPromise).rejects.toThrow(
      'We could not submit your verification. Please try again.',
    );

    await vi.advanceTimersByTimeAsync(2000);

    await expectation;
  });
});