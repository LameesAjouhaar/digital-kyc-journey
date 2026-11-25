export type DocumentType =
  | 'passport'
  | 'national-id'
  | 'drivers-licence';

export interface DocumentOption {
  type: DocumentType;
  title: string;
  description: string;
}

export interface DocumentValidationResult {
  valid: boolean;
  message: string;
  documentType: DocumentType;
  fileName: string;
}