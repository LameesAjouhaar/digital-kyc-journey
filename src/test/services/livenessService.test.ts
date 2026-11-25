
import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyLiveness } from '@/features/liveness-verification/services/livenessService';

describe('verifyLiveness', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a successful liveness result', async () => {
    vi.useFakeTimers();

    const resultPromise = verifyLiveness();

    await vi.advanceTimersByTimeAsync(2000);

    await expect(resultPromise).resolves.toEqual({
      success: true,
      message: 'Liveness verification completed successfully.',
      confidence: 98.5,
    });
  });

  it('returns a failed result when liveness verification is unsuccessful', async () => {
    vi.useFakeTimers();

    const resultPromise = verifyLiveness({
      simulateFailure: true,
    });

    await vi.advanceTimersByTimeAsync(2000);

    await expect(resultPromise).resolves.toEqual({
      success: false,
      message:
        'Liveness verification was unsuccessful. Please try capturing your selfie again.',
      confidence: 42.5,
    });
  });

  it('waits for the simulated API response', async () => {
    vi.useFakeTimers();

    const resultPromise = verifyLiveness();

    await vi.advanceTimersByTimeAsync(1999);

    expect(vi.getTimerCount()).toBe(1);

    await vi.advanceTimersByTimeAsync(1);

    await expect(resultPromise).resolves.toMatchObject({
      success: true,
    });
  });
});
