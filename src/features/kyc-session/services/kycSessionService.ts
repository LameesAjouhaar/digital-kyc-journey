
import type {
  CreateKycSessionResponse,
  KycSession,
} from '../types/session.types';

const SESSION_DURATION_MINUTES = 15;
const MOCK_API_DELAY = 500;

const simulateApiDelay = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_API_DELAY);
  });

export async function createKycSession(): Promise<CreateKycSessionResponse> {
  await simulateApiDelay();

  const createdAt = new Date();
  const expiresAt = new Date(
    createdAt.getTime() + SESSION_DURATION_MINUTES * 60 * 1000,
  );

  const session: KycSession = {
    id: crypto.randomUUID(),
    status: 'created',
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  return { session };
}
