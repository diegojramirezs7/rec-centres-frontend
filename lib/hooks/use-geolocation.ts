"use client";

import { useState, useCallback } from "react";
import type {
  Coordinates,
  GeolocationState,
  GeolocationError,
} from "@/lib/types/geolocation";

/**
 * Maps GeolocationPositionError to our custom error type
 */
function mapGeolocationError(
  error: GeolocationPositionError
): GeolocationError {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "permission_denied";
    case error.POSITION_UNAVAILABLE:
      return "position_unavailable";
    case error.TIMEOUT:
      return "timeout";
    default:
      return "position_unavailable";
  }
}

/**
 * Custom hook for managing user geolocation
 * @returns GeolocationState and functions to request/clear location
 */
export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);

  /**
   * Request user's current location
   */
  const requestLocation = useCallback(() => {
    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      setError("unsupported");
      return;
    }

    // Check if we're in a secure context (HTTPS or localhost)
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setError("unsupported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(mapGeolocationError(error));
        setLoading(false);
        setCoordinates(null);
      },
      {
        enableHighAccuracy: false, // Use network location (faster, less battery)
        timeout: 10000, // 10 second timeout
        maximumAge: 300000, // Accept cached position up to 5 minutes old
      }
    );
  }, []);

  /**
   * Clear location data and reset state
   */
  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    coordinates,
    loading,
    error,
    requestLocation,
    clearLocation,
  };
}
