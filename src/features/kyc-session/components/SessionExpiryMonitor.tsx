
'use client';

import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sessionExpired } from '@/store/slices/kycWorkflowSlice';

import { getKycSessionStatus } from '../services/sessionStatusService';

const SESSION_STATUS_CHECK_INTERVAL = 30_000;

export function SessionExpiryMonitor() {
  const dispatch = useAppDispatch();

  const sessionId = useAppSelector(
    (state) => state.kycWorkflow.sessionId,
  );

  const sessionExpiresAt = useAppSelector(
    (state) => state.kycWorkflow.sessionExpiresAt,
  );

  const currentStep = useAppSelector(
    (state) => state.kycWorkflow.currentStep,
  );

  const isSessionActive =
    Boolean(sessionId && sessionExpiresAt) &&
    currentStep !== 'idle' &&
    currentStep !== 'complete' &&
    currentStep !== 'session-expired';

  // Local check provides immediate expiry handling.
  const checkSessionExpiry = useCallback(() => {
    if (!sessionExpiresAt || !isSessionActive) {
      return;
    }

    const expiryTime = new Date(sessionExpiresAt).getTime();

    if (Number.isNaN(expiryTime)) {
      return;
    }

    if (Date.now() >= expiryTime) {
      dispatch(sessionExpired());
    }
  }, [sessionExpiresAt, isSessionActive, dispatch]);

  useEffect(() => {
    checkSessionExpiry();

    const intervalId = window.setInterval(
      checkSessionExpiry,
      1000,
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSessionExpiry();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    return () => {
      window.clearInterval(intervalId);

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, [checkSessionExpiry]);

  // Periodically retrieve the session status from the mock API.
  useEffect(() => {
    if (!isSessionActive || !sessionId || !sessionExpiresAt) {
      return;
    }

    let isMounted = true;

    const retrieveSessionStatus = async () => {
      try {
        const result = await getKycSessionStatus(
          sessionId,
          sessionExpiresAt,
        );

        if (isMounted && result.status === 'expired') {
          dispatch(sessionExpired());
        }
      } catch {
        // A temporary status API failure should not interrupt
        // the journey. The local expiry check remains active.
      }
    };

    void retrieveSessionStatus();

    const intervalId = window.setInterval(
      () => void retrieveSessionStatus(),
      SESSION_STATUS_CHECK_INTERVAL,
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void retrieveSessionStatus();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, [
    isSessionActive,
    sessionId,
    sessionExpiresAt,
    dispatch,
  ]);

  return null;
}
