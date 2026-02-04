export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: GeolocationError | null;
}

export type GeolocationError =
  | "permission_denied"
  | "position_unavailable"
  | "timeout"
  | "unsupported";
