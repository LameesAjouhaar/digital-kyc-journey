
export type DeviceType = 'current' | 'mobile';

export interface DeviceSelectionOption {
  type: DeviceType;
  title: string;
  description: string;
}
