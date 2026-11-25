
export interface LivenessResult {
  success: boolean;
  message: string;
  confidence: number;
}

export interface LivenessOptions {
  simulateFailure?: boolean;
}

const MOCK_API_DELAY = 2000;

export async function verifyLiveness(
  options: LivenessOptions = {},
): Promise<LivenessResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_API_DELAY);
  });

  if (options.simulateFailure) {
    return {
      success: false,
      message:
        'Liveness verification was unsuccessful. Please try capturing your selfie again.',
      confidence: 42.5,
    };
  }

  return {
    success: true,
    message: 'Liveness verification completed successfully.',
    confidence: 98.5,
  };
}
