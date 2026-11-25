
import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyFaceMatch } from '@/features/face-matching/services/faceMatchService';

describe('verifyFaceMatch', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a successful face match result', async () => {
    vi.useFakeTimers();

    const resultPromise = verifyFaceMatch();

    await vi.advanceTimersByTimeAsync(2000);

    await expect(resultPromise).resolves.toEqual({
      matched: true,
      confidence: 97.8,
      message: 'Your selfie successfully matched your identity document.',
    });
  });

  it('returns an unsuccessful result when faces do not match', async () => {
    vi.useFakeTimers();

    const resultPromise = verifyFaceMatch({
      simulateFailure: true,
    });

    await vi.advanceTimersByTimeAsync(2000);

    await expect(resultPromise).resolves.toEqual({
      matched: false,
      confidence: 42.5,
      message:
        'We could not match your selfie with your identity document. Please try again.',
    });
  });

  it('waits for the simulated API response', async () => {
    vi.useFakeTimers();

    const resultPromise = verifyFaceMatch();

    await vi.advanceTimersByTimeAsync(1999);

    expect(vi.getTimerCount()).toBe(1);

    await vi.advanceTimersByTimeAsync(1);

    await expect(resultPromise).resolves.toMatchObject({
      matched: true,
    });
  });
});
