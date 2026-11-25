
import type { FaceMatchResult } from '../types/faceMatch.types';

export interface FaceMatchOptions {
  simulateFailure?: boolean;
}

const MOCK_API_DELAY = 2000;

export async function verifyFaceMatch(
  options: FaceMatchOptions = {},
): Promise<FaceMatchResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_API_DELAY);
  });

  if (options.simulateFailure) {
    return {
      matched: false,
      confidence: 42.5,
      message:
        'We could not match your selfie with your identity document. Please try again.',
    };
  }

  return {
    matched: true,
    confidence: 97.8,
    message:
      'Your selfie successfully matched your identity document.',
  };
}
