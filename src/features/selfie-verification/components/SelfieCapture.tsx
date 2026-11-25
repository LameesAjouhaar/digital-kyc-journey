
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  RefreshCw,
  Upload,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

import { useMutation } from '@tanstack/react-query';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { transitionTo } from '@/store/slices/kycWorkflowSlice';

import { uploadSelfie } from '../services/selfieUploadService';

import type { CameraStatus } from '../types/selfie.types';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
];

export function SelfieCapture() {
  const dispatch = useAppDispatch();

  const sessionId = useAppSelector(
    (state) => state.kycWorkflow.sessionId,
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cameraRequestRef = useRef(0);

  const [cameraStatus, setCameraStatus] =
    useState<CameraStatus>('idle');

  const [selfie, setSelfie] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    cameraRequestRef.current += 1;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const selfieUploadMutation = useMutation({
    mutationFn: (selfieData: string) => {
      if (!sessionId) {
        throw new Error('Your verification session could not be found.');
      }

      return uploadSelfie(selfieData, sessionId);
    },

    onSuccess: () => {
      stopCamera();
      dispatch(transitionTo('liveness-check'));
    },

    onError: (error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'We could not upload your selfie. Please try again.',
      );
    },
  });

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();

    const requestId = cameraRequestRef.current;

    setErrorMessage(null);
    setCameraStatus('requesting');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('error');
      setErrorMessage(
        'Camera access is unavailable. Please use a secure connection or upload a selfie instead.',
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
        },
        audio: false,
      });

      if (requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      if (!videoRef.current) {
        stopCamera();
        setCameraStatus('error');
        setErrorMessage(
          'We could not initialise your camera. Please try again.',
        );
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      if (requestId !== cameraRequestRef.current) {
        return;
      }

      setCameraStatus('ready');
    } catch (error) {
      if (requestId !== cameraRequestRef.current) {
        return;
      }

      stopCamera();

      if (
        error instanceof DOMException &&
        error.name === 'NotAllowedError'
      ) {
        setCameraStatus('denied');
        setErrorMessage(
          'Camera permission was denied. Please allow camera access or upload a selfie instead.',
        );
      } else {
        setCameraStatus('error');
        setErrorMessage(
          'We could not access your camera. Please try again or upload a selfie.',
        );
      }
    }
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const captureSelfie = () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setErrorMessage('Your camera is not ready yet. Please try again.');
      return;
    }

    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      setErrorMessage('Unable to capture your selfie. Please try again.');
      return;
    }

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    setSelfie(canvas.toDataURL('image/jpeg', 0.9));
    setErrorMessage(null);
    selfieUploadMutation.reset();
    stopCamera();
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage('Please select a PNG, JPG or WEBP image.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Your selfie must be smaller than 10 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        stopCamera();
        setSelfie(reader.result);
        setCameraStatus('idle');
        setErrorMessage(null);
        selfieUploadMutation.reset();
      }
    };

    reader.onerror = () => {
      setErrorMessage('We could not read your image. Please try again.');
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleRetake = () => {
    setSelfie(null);
    setErrorMessage(null);
    selfieUploadMutation.reset();
    void startCamera();
  };

  const handleContinue = () => {
    if (!selfie || selfieUploadMutation.isPending) return;

    setErrorMessage(null);
    selfieUploadMutation.mutate(selfie);
  };

  const isUploading = selfieUploadMutation.isPending;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <span className="text-sm font-medium text-blue-700">
            Step 4 of your verification
          </span>

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-3xl font-bold text-slate-900 focus-visible:outline-none"
          >
            Take a selfie
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            We need a clear photo of your face to compare with
            your identity document. Make sure you're in a well-lit
            environment.
          </p>
        </div>

        <section
          aria-labelledby="selfie-capture-heading"
          aria-busy={isUploading}
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <h2 id="selfie-capture-heading" className="sr-only">
            Selfie capture
          </h2>

          <div className="relative overflow-hidden rounded-xl bg-slate-900">
            {selfie ? (
              <img
                src={selfie}
                alt="Your captured selfie"
                className="aspect-[4/3] w-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                aria-label="Live selfie camera preview"
                className="aspect-[4/3] w-full -scale-x-100 object-cover"
              />
            )}

            {!selfie && cameraStatus !== 'ready' && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white"
                role="status"
                aria-live="polite"
              >
                {cameraStatus === 'requesting' ? (
                  <>
                    <Camera size={32} aria-hidden="true" />
                    <p>Requesting camera access...</p>
                  </>
                ) : (
                  <>
                    <CameraOff size={32} aria-hidden="true" />
                    <p>Camera preview unavailable</p>
                  </>
                )}
              </div>
            )}
          </div>

          {selfie ? (
            <div
              className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-700"
              role="status"
            >
              <CheckCircle2 size={19} aria-hidden="true" />
              Selfie captured successfully
            </div>
          ) : (
            <p className="mt-4 text-center text-sm text-slate-500">
              Position your face in the centre of the frame.
            </p>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle
                size={19}
                className="shrink-0"
                aria-hidden="true"
              />

              <p>{errorMessage}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {!selfie && cameraStatus === 'ready' && (
              <button
                type="button"
                onClick={captureSelfie}
                disabled={isUploading}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera size={18} aria-hidden="true" />
                Capture selfie
              </button>
            )}

            {!selfie && cameraStatus !== 'ready' && (
              <button
                type="button"
                onClick={() => void startCamera()}
                disabled={
                  cameraStatus === 'requesting' || isUploading
                }
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw size={18} aria-hidden="true" />
                {cameraStatus === 'idle'
                  ? 'Enable camera'
                  : 'Try camera again'}
              </button>
            )}

            {selfie && (
              <button
                type="button"
                onClick={handleRetake}
                disabled={isUploading}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw size={18} aria-hidden="true" />
                Retake selfie
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload size={18} aria-hidden="true" />
              Upload selfie
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="sr-only"
            aria-label="Upload selfie image"
          />

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selfie || isUploading}
            aria-busy={isUploading}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-live="polite">
              {isUploading
                ? 'Uploading selfie...'
                : 'Continue to liveness check'}
            </span>

            {!isUploading && (
              <ArrowRight size={18} aria-hidden="true" />
            )}
          </button>
        </section>
      </div>
    </main>
  );
}
