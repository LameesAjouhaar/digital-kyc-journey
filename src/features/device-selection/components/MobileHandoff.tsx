
'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface MobileHandoffProps {
  sessionId: string;
  onBack: () => void;
}

export function MobileHandoff({
  sessionId,
  onBack,
}: MobileHandoffProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const handoffUrl = `/mobile-verification?sessionId=${encodeURIComponent(sessionId)}`;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      aria-labelledby="mobile-handoff-heading"
      className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-8 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to device selection
      </button>

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Smartphone size={28} aria-hidden="true" />
      </div>

      <h2
        id="mobile-handoff-heading"
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-slate-900 focus-visible:outline-none"
      >
        Continue on your mobile
      </h2>

      <p
        id="mobile-handoff-instructions"
        className="mt-3 text-sm leading-6 text-slate-600"
      >
        Scan the QR code below using your mobile phone's camera
        to continue your identity verification.
      </p>

      <div className="mx-auto my-8 flex min-h-56 w-56 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
        <QRCodeSVG
          value={handoffUrl}
          size={192}
          level="M"
          includeMargin
          role="img"
          aria-label="QR code for opening mobile identity verification"
        />
      </div>

      <p className="text-sm text-slate-500">
        Your verification session will remain active while you
        switch devices.
      </p>

      <p className="mt-4 text-xs text-slate-400">
        Secure verification session
      </p>
    </section>
  );
}
