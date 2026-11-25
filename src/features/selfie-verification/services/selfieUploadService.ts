
export interface SelfieUploadResult {
  success: boolean;
  uploadId: string;
  sessionId: string;
  contentType: string;
  uploadedAt: string;
}

export interface SelfieUploadOptions {
  simulateFailure?: boolean;
}

const MOCK_API_DELAY = 1200;

export async function uploadSelfie(
  selfieData: string,
  sessionId: string,
  options: SelfieUploadOptions = {},
): Promise<SelfieUploadResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_API_DELAY);
  });

  if (!sessionId) {
    throw new Error('A valid verification session is required.');
  }

  if (!selfieData.startsWith('data:image/')) {
    throw new Error('Please provide a valid selfie image.');
  }

  if (options.simulateFailure) {
    throw new Error(
      'We could not upload your selfie. Please check your connection and try again.',
    );
  }

  return {
    success: true,
    uploadId: crypto.randomUUID(),
    sessionId,
    contentType: selfieData
      .slice(5, selfieData.indexOf(';')),
    uploadedAt: new Date().toISOString(),
  };
}
