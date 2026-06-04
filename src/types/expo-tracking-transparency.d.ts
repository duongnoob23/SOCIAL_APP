declare module 'expo-tracking-transparency' {
  export type TrackingPermissionStatus = 'undetermined' | 'denied' | 'granted';

  export interface TrackingPermissionResponse {
    status: TrackingPermissionStatus;
    granted: boolean;
    canAskAgain: boolean;
    expires: 'never' | number;
  }

  export function getTrackingPermissionsAsync(): Promise<TrackingPermissionResponse>;

  export function requestTrackingPermissionsAsync(): Promise<TrackingPermissionResponse>;
}
