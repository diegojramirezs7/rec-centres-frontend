/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param lat1 - Latitude of the first point in degrees
 * @param lng1 - Longitude of the first point in degrees
 * @param lat2 - Latitude of the second point in degrees
 * @param lng2 - Longitude of the second point in degrees
 * @returns Distance between the two points in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  // Earth's radius in kilometers
  const R = 6371;

  // Convert degrees to radians
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  return R * c;
}

/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
