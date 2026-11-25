
'use client';

import { useState } from 'react';
import {
  Monitor,
  Smartphone,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resetWorkflow,
  selectDevice,
} from '@/store/slices/kycWorkflowSlice';
import { MobileHandoff } from './MobileHandoff';

export function DeviceSelection() {
  const dispatch = useAppDispatch();

  const sessionId = useAppSelector(
    (state) => state.kycWorkflow.sessionId,
  );

  const selectedDevice = useAppSelector(
    (state) => state.kycWorkflow.selectedDevice,
  );

  const [showMobileHandoff, setShowMobileHandoff] = useState(false);

  const handleCurrentDevice = () => {
    dispatch(selectDevice('current'));
  };

  const handleMobileDevice = () => {
    dispatch(selectDevice('mobile'));
    setShowMobileHandoff(true);
  };

  if (!sessionId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section
          aria-labelledby="session-unavailable-heading"
          className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm"
        >
          <h1
            id="session-unavailable-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Verification session unavailable
          </h1>

          <p
            id="session-unavailable-description"
            className="mt-3 text-sm leading-6 text-slate-600"
          >
            Your verification session could not be found.
            Please start a new verification to continue.
          </p>

          <button
            type="button"
            onClick={() => dispatch(resetWorkflow())}
            aria-describedby="session-unavailable-description"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Start again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {showMobileHandoff ? (
          <MobileHandoff
            sessionId={sessionId}
            onBack={() => setShowMobileHandoff(false)}
          />
        ) : (
          <>
            <div className="mb-10 text-center">
              <span className="text-sm font-medium text-blue-700">
                Step 1 of your verification
              </span>

              <h1
                id="device-selection-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
              >
                Choose your device
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-slate-600">
                Choose where you would like to complete your identity
                verification. We recommend using a device with a camera.
              </p>
            </div>

            <div
              role="group"
              aria-labelledby="device-selection-heading"
              className="grid gap-5 sm:grid-cols-2"
            >
              <button
                type="button"
                onClick={handleCurrentDevice}
                aria-pressed={selectedDevice === 'current'}
                aria-labelledby="current-device-heading"
                aria-describedby="current-device-description"
                className={`group rounded-2xl border-2 p-6 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  selectedDevice === 'current'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-600 hover:shadow-md'
                }`}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Monitor size={25} aria-hidden="true" />
                </div>

                <h2
                  id="current-device-heading"
                  className="text-lg font-semibold text-slate-900"
                >
                  Use this device
                </h2>

                <p
                  id="current-device-description"
                  className="mt-2 min-h-12 text-sm leading-6 text-slate-600"
                >
                  Continue verification using this computer or device.
                </p>

                <span
                  aria-hidden="true"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
                >
                  Continue
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={handleMobileDevice}
                aria-pressed={selectedDevice === 'mobile'}
                aria-labelledby="mobile-device-heading"
                aria-describedby="mobile-device-description"
                className={`group rounded-2xl border-2 p-6 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  selectedDevice === 'mobile'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-600 hover:shadow-md'
                }`}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Smartphone size={25} aria-hidden="true" />
                </div>

                <h2
                  id="mobile-device-heading"
                  className="text-lg font-semibold text-slate-900"
                >
                  Use my mobile phone
                </h2>

                <p
                  id="mobile-device-description"
                  className="mt-2 min-h-12 text-sm leading-6 text-slate-600"
                >
                  Scan a QR code to continue on your mobile phone.
                </p>

                <span
                  aria-hidden="true"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
                >
                  Show QR code
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
