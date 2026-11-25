export interface SelfieCapture {
  image: string;
  capturedAt: string;
}

export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'ready'
  | 'denied'
  | 'error';