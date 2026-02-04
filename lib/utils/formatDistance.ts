/**
 * Format distance for display with appropriate units
 * @param km - Distance in kilometers
 * @returns Formatted distance string (e.g., "850m", "1.2km", "12km")
 */
export function formatDistance(km: number): string {
  // For distances less than 1km, show in meters
  if (km < 1) {
    const meters = km * 1000;
    // Round to nearest 10m for better readability
    const roundedMeters = Math.round(meters / 10) * 10;
    return `${roundedMeters}m`;
  }

  // For distances between 1km and 10km, show with 1 decimal place
  if (km < 10) {
    return `${km.toFixed(1)}km`;
  }

  // For distances 10km and above, show without decimal
  return `${Math.round(km)}km`;
}
