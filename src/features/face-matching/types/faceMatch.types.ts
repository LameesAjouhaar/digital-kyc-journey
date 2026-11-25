export interface FaceMatchResult {
  matched: boolean;
  confidence: number;
  message: string;
}

export type FaceMatchStatus =
  | 'pending'
  | 'matched'
  | 'not-matched';