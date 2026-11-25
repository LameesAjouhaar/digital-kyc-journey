
export interface DocumentUploadResult {
  success: boolean;
  uploadId: string;
  sessionId: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

export interface DocumentUploadOptions {
  simulateFailure?: boolean;
}

const MOCK_API_DELAY = 1200;

export async function uploadDocument(
  file: File,
  sessionId: string,
  options: DocumentUploadOptions = {},
): Promise<DocumentUploadResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_API_DELAY);
  });

  if (!sessionId) {
    throw new Error('A valid verification session is required.');
  }

  if (!file || file.size === 0) {
    throw new Error('Please select a document to upload.');
  }

  if (options.simulateFailure) {
    throw new Error(
      'We could not upload your document. Please check your connection and try again.',
    );
  }

  return {
    success: true,
    uploadId: crypto.randomUUID(),
    sessionId,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
    uploadedAt: new Date().toISOString(),
  };
}
