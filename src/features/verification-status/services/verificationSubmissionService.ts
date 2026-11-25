export interface VerificationSubmissionResult {
  success: boolean;
  reference: string;
  submittedAt: string;
}

export interface SubmitVerificationOptions {
  simulateFailure?: boolean;
}

const MOCK_API_DELAY = 2000;

export async function submitVerification(
  options: SubmitVerificationOptions = {},
): Promise<VerificationSubmissionResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_API_DELAY);
  });

  if (options.simulateFailure) {
    throw new Error(
      'We could not submit your verification. Please try again.',
    );
  }

  return {
    success: true,
    reference: `KYC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
  };
}