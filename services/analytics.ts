export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function computeDistance(
  points: { latitude: number; longitude: number }[]
): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineKm(
      points[i - 1].latitude,
      points[i - 1].longitude,
      points[i].latitude,
      points[i].longitude
    );
  }
  return total;
}

export function computeAverageSpeed(points: { speed: number }[]): number {
  if (!points.length) return 0;
  return points.reduce((a, b) => a + b.speed, 0) / points.length;
}

export function computeMaxSpeed(points: { speed: number }[]): number {
  if (!points.length) return 0;
  return Math.max(...points.map((p) => p.speed));
}

export function computeDuration(
  firstTimestamp: number,
  lastTimestamp: number
): number {
  return (lastTimestamp - firstTimestamp) / 60000;
}

export function distanceToZone(
  lat: number,
  lng: number,
  zoneLat: number,
  zoneLng: number
): number {
  return haversineKm(lat, lng, zoneLat, zoneLng) * 1000;
}
