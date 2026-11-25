
export type KycSessionStatus = 'active' | 'expired';

export interface KycSessionStatusResult {
  sessionId: string;
  status: KycSessionStatus;
  expiresAt: string;
  checkedAt: string;
}

export interface SessionStatusOptions {
  simulateFailure?: boolean;
}

const MOCK_API_DELAY = 500;

export async function getKycSessionStatus(
  sessionId: string,
  expiresAt: string,
  options: SessionStatusOptions = {},
): Promise<KycSessionStatusResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_API_DELAY);
  });

  if (!sessionId) {
    throw new Error('A valid verification session is required.');
  }

  if (!expiresAt || Number.isNaN(Date.parse(expiresAt))) {
    throw new Error('A valid session expiry date is required.');
  }

  if (options.simulateFailure) {
    throw new Error(
      'We could not retrieve your session status. Please try again.',
    );
  }

  const status: KycSessionStatus =
    Date.now() >= new Date(expiresAt).getTime()
      ? 'expired'
      : 'active';

  return {
    sessionId,
    status,
    expiresAt,
    checkedAt: new Date().toISOString(),
  };
}
