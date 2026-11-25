
'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  FileText,
  Upload,
  AlertCircle,
  ArrowRight,
  X,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { transitionTo } from '@/store/slices/kycWorkflowSlice';

import { validateDocument } from '../services/documentVerificationService';
import type { DocumentType } from '../types/document.types';
import { uploadDocument } from '../services/documentUploadService';

const documentOptions: {
  type: DocumentType;
  title: string;
  description: string;
}[] = [
  {
    type: 'passport',
    title: 'Passport',
    description: 'A valid government-issued passport.',
  },
  {
    type: 'national-id',
    title: 'National ID',
    description: 'Your national identity document.',
  },
  {
    type: 'drivers-licence',
    title: "Driver's Licence",
    description: 'A valid driving licence.',
  },
];

export function DocumentUpload() {
  const dispatch = useAppDispatch();

  const sessionId = useAppSelector(
    (state) => state.kycWorkflow.sessionId,
  );

  const [documentType, setDocumentType] =
    useState<DocumentType | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(
    null,
  );

  const previewUrlRef = useRef<string | null>(null);

  const validationMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      if (!documentType) {
        throw new Error('Please select a document type.');
      }

      if (!sessionId) {
        throw new Error('Your verification session could not be found.');
      }

      await uploadDocument(selectedFile, sessionId);

      return validateDocument(selectedFile, documentType);
    },

    onSuccess: (result) => {
      if (!result.valid) {
        setValidationError(result.message);
        return;
      }

      setValidationError(null);
      dispatch(transitionTo('document-validation'));
    },

    onError: (error) => {
      const message =
        error instanceof Error ? error.message : '';

      setValidationError(
        message.startsWith('We could not upload') ||
          message.includes('verification session') ||
          message.includes('select a document')
          ? message
          : 'We could not validate your document because of a connection issue. Please try again.',
      );
    },
  });

  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    validationMutation.reset();
    setValidationError(null);
    setFile(selectedFile);

    clearPreview();

    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    }

    // Allows selecting the same file again after removing it.
    event.target.value = '';
  };

  const handleDocumentTypeChange = (type: DocumentType) => {
    setDocumentType(type);
    setFile(null);
    clearPreview();
    setValidationError(null);
    validationMutation.reset();
  };

  const handleSubmit = () => {
    if (!file || !documentType || validationMutation.isPending) return;

    setValidationError(null);
    validationMutation.mutate(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
    clearPreview();
    setValidationError(null);
    validationMutation.reset();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <span className="text-sm font-medium text-blue-700">
            Step 2 of your verification
          </span>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Verify your identity
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Select your identity document and upload a clear image
            so we can verify your details.
          </p>
        </div>

        <section
          aria-labelledby="document-upload-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <div
            role="group"
            aria-labelledby="document-type-heading"
          >
            <h2
              id="document-type-heading"
              className="font-semibold text-slate-900"
            >
              1. Select your document
            </h2>

            <div className="mt-4 grid gap-3">
              {documentOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => handleDocumentTypeChange(option.type)}
                  aria-pressed={documentType === option.type}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                    documentType === option.type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <FileText
                    size={22}
                    className="shrink-0 text-blue-700"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="font-medium text-slate-900">
                      {option.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="my-8 border-t border-slate-100" />

          <h2
            id="document-upload-heading"
            className="font-semibold text-slate-900"
          >
            2. Upload your document
          </h2>

          <label
            htmlFor="document-upload"
            className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 px-5 py-10 text-center transition hover:border-blue-500 hover:bg-blue-50/50 has-[:focus-visible]:border-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600"
          >
            <Upload
              size={28}
              className="text-blue-700"
              aria-hidden="true"
            />

            <span className="mt-3 font-medium text-slate-900">
              Choose a document image
            </span>

            <span
              id="document-upload-help"
              className="mt-2 text-sm text-slate-500"
            >
              PNG, JPG or WEBP · Maximum 10 MB
            </span>

            <input
              id="document-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              aria-describedby="document-upload-help"
              className="sr-only"
            />
          </label>

          {file && (
            <div
              className="mt-5 rounded-xl border border-slate-200 p-4"
              aria-label="Selected document"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText
                    size={22}
                    className="shrink-0 text-blue-700"
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label="Remove uploaded document"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview of the uploaded identity document"
                  className="mt-4 max-h-64 w-full rounded-lg border border-slate-200 object-contain"
                />
              )}
            </div>
          )}

          {validationError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle
                size={19}
                className="shrink-0"
                aria-hidden="true"
              />

              <p>{validationError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !documentType ||
              !file ||
              validationMutation.isPending
            }
            aria-busy={validationMutation.isPending}
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-live="polite">
              {validationMutation.isPending
                ? 'Uploading and validating document...'
                : 'Validate document'}
            </span>

            {!validationMutation.isPending && (
              <ArrowRight size={18} aria-hidden="true" />
            )}
          </button>
        </section>
      </div>
    </main>
  );
}
