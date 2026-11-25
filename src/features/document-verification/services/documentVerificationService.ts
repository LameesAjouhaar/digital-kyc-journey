
import type {
  DocumentType,
  DocumentValidationResult,
} from '../types/document.types';

export interface DocumentValidationOptions {
  simulateFailure?: boolean;
}

const MOCK_API_DELAY = 1000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function validateDocument(
  file: File,
  documentType: DocumentType,
  options: DocumentValidationOptions = {},
): Promise<DocumentValidationResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_API_DELAY);
  });

  if (options.simulateFailure) {
    return {
      valid: false,
      message:
        'We could not validate this document. Please upload a clearer image and try again.',
      documentType,
      fileName: file.name,
    };
  }

  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      message: 'Please upload a valid image file.',
      documentType,
      fileName: file.name,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: 'The file exceeds the maximum allowed size of 10MB.',
      documentType,
      fileName: file.name,
    };
  }

  return {
    valid: true,
    message: 'Your document has been validated successfully.',
    documentType,
    fileName: file.name,
  };
}
