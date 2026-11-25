
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { store } from '@/store/store';
import {
  resetWorkflow,
  selectDevice,
  sessionCreated,
} from '@/store/slices/kycWorkflowSlice';

import { validateDocument } from '@/features/document-verification/services/documentVerificationService';
import { uploadDocument } from '@/features/document-verification/services/documentUploadService';
import type { DocumentValidationResult } from '@/features/document-verification/types/document.types';
import { DocumentUpload } from '@/features/document-verification/components/DocumentUpload';

vi.mock(
  '@/features/document-verification/services/documentVerificationService',
  () => ({
    validateDocument: vi.fn(),
  }),
);

vi.mock(
  '@/features/document-verification/services/documentUploadService',
  () => ({
    uploadDocument: vi.fn(),
  }),
);

describe('DocumentUpload', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(() => 'blob:mock-preview'),
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });

    store.dispatch(resetWorkflow());

    store.dispatch(
      sessionCreated({
        id: 'test-session-123',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      }),
    );

    store.dispatch(selectDevice('current'));

    vi.mocked(uploadDocument).mockResolvedValue({
      success: true,
      uploadId: 'test-upload-123',
      sessionId: 'test-session-123',
      fileName: 'passport.png',
      fileSize: 10,
      contentType: 'image/png',
      uploadedAt: new Date().toISOString(),
    });

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DocumentUpload />
        </QueryClientProvider>
      </Provider>,
    );
  };

  const uploadFile = async () => {
    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', { name: /passport/i }),
    );

    const file = new File(['test image'], 'passport.png', {
      type: 'image/png',
    });

    await user.upload(
      screen.getByLabelText(/choose a document image/i),
      file,
    );

    return user;
  };

  it('advances to document validation when the document is valid', async () => {
    vi.mocked(validateDocument).mockResolvedValue({
      valid: true,
      message: 'Your document has been validated successfully.',
      documentType: 'passport',
      fileName: 'passport.png',
    });

    renderComponent();

    const user = await uploadFile();

    await user.click(
      screen.getByRole('button', { name: /validate document/i }),
    );

    await waitFor(() => {
      expect(store.getState().kycWorkflow.currentStep).toBe(
        'document-validation',
      );
    });
  });

  it('displays a validation error and stays on the upload screen when the document is rejected', async () => {
    const rejectedResult: DocumentValidationResult = {
      valid: false,
      message: 'The document image is unclear. Please try again.',
      documentType: 'passport',
      fileName: 'passport.png',
    };

    vi.mocked(validateDocument).mockResolvedValue(rejectedResult);

    renderComponent();

    const user = await uploadFile();

    await user.click(
      screen.getByRole('button', { name: /validate document/i }),
    );

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(rejectedResult.message);

    expect(store.getState().kycWorkflow.currentStep).toBe(
      'document-upload',
    );
  });

  it('displays a connection error when document validation fails unexpectedly', async () => {
    vi.mocked(validateDocument).mockRejectedValue(
      new Error('Network request failed'),
    );

    renderComponent();

    const user = await uploadFile();

    await user.click(
      screen.getByRole('button', { name: /validate document/i }),
    );

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'We could not validate your document because of a connection issue. Please try again.',
    );

    expect(store.getState().kycWorkflow.currentStep).toBe(
      'document-upload',
    );
  });

  it('allows the user to retry validation after an unsuccessful attempt', async () => {
    vi.mocked(validateDocument)
      .mockResolvedValueOnce({
        valid: false,
        message: 'The document image is unclear. Please try again.',
        documentType: 'passport',
        fileName: 'passport.png',
      })
      .mockResolvedValueOnce({
        valid: true,
        message: 'Your document has been validated successfully.',
        documentType: 'passport',
        fileName: 'passport.png',
      });

    renderComponent();

    const user = await uploadFile();

    const validateButton = screen.getByRole('button', {
      name: /validate document/i,
    });

    await user.click(validateButton);

    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.click(validateButton);

    await waitFor(() => {
      expect(store.getState().kycWorkflow.currentStep).toBe(
        'document-validation',
      );
    });

    expect(validateDocument).toHaveBeenCalledTimes(2);
  });
});
