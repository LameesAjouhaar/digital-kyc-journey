
export type KycSessionStatus =
  | 'created'
  | 'in-progress'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired';

export interface KycSession {
  id: string;
  status: KycSessionStatus;
  createdAt: string;
  expiresAt: string;
}

export interface CreateKycSessionResponse {
  session: KycSession;
}
