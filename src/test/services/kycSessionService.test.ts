
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createKycSession } from '@/features/kyc-session/services/kycSessionService';

describe('kycSessionService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a new KYC session', async () => {
    const response = await createKycSession();

    expect(response.session.id).toBeDefined();
    expect(response.session.status).toBe('created');
    expect(response.session.createdAt).toBeDefined();
    expect(response.session.expiresAt).toBeDefined();
  });

  it('sets the session expiry to 15 minutes after creation', async () => {
    const response = await createKycSession();

    const createdAt = new Date(response.session.createdAt);
    const expiresAt = new Date(response.session.expiresAt);

    const differenceInMinutes =
      (expiresAt.getTime() - createdAt.getTime()) / 60000;

    expect(differenceInMinutes).toBe(15);
  });

  it('generates a unique ID for each session', async () => {
    const firstResponse = await createKycSession();
    const secondResponse = await createKycSession();

    expect(firstResponse.session.id).not.toBe(
      secondResponse.session.id,
    );
  });
});
