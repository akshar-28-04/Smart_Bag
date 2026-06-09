import type {
  Child,
  Device,
  LocationData,
  SafeZone,
  Alert,
  RouteHistory,
  WeeklyStats,
  SafetyScore,
  AttendanceRecord,
} from "./types";

// ─── Child & Device ────────────────────────────────────────────────────────────

export const DEMO_CHILD: Child = {
  id: "child-001",
  name: "Aarav Sharma",
  age: 8,
  school: "Delhi Public School, Bengaluru",
};

export const DEMO_DEVICE: Device = {
  id: "SB-001",
  battery: 82,
  signalStrength: 4,
  gpsStatus: "excellent",
  lastSync: "2026-06-09T21:43:00+05:30",
  firmware: "v2.3.1",
  uptime: "14d 6h 23m",
  isOnline: true,
};

// ─── Locations ─────────────────────────────────────────────────────────────────

export const LOCATIONS = {
  home:    { lat: 12.9716, lng: 77.5946 },
  school:  { lat: 12.9780, lng: 77.6000 },
  tuition: { lat: 12.9750, lng: 77.5970 },
  current: { lat: 12.9748, lng: 77.5975 }, // between home and school
};

export const DEMO_LOCATION: LocationData = {
  coords: LOCATIONS.current,
  address: "Jayanagar 4th Block, Bengaluru, Karnataka 560041",
  speed: 18,
  accuracy: 4,
  timestamp: "2026-06-09T21:43:00+05:30",
  status: "travelling",
};

// ─── Safe Zones ────────────────────────────────────────────────────────────────

export const DEMO_SAFE_ZONES: SafeZone[] = [
  {
    id: "zone-home",
    name: "Home",
    type: "home",
    center: LOCATIONS.home,
    radius: 150,
    color: "#22C55E",
    entryTime: "15:45",
    exitTime: "07:30",
    isActive: true,
  },
  {
    id: "zone-school",
    name: "Delhi Public School",
    type: "school",
    center: LOCATIONS.school,
    radius: 200,
    color: "#2563EB",
    entryTime: "08:15",
    exitTime: "14:30",
    isActive: true,
  },
  {
    id: "zone-tuition",
    name: "Brilliant Minds Tuition",
    type: "tuition",
    center: LOCATIONS.tuition,
    radius: 100,
    color: "#0EA5E9",
    entryTime: "16:30",
    exitTime: "18:30",
    isActive: true,
  },
];

// ─── Alerts ────────────────────────────────────────────────────────────────────

export const DEMO_ALERTS: Alert[] = [
  {
    id: "alert-001",
    type: "entered_school",
    title: "Arrived at School ✓",
    message: "Aarav arrived at Delhi Public School at 8:15 AM.",
    severity: "success",
    timestamp: "2026-06-09T08:15:00+05:30",
    isRead: true,
    location: "Delhi Public School, Bengaluru",
  },
  {
    id: "alert-002",
    type: "route_deviation",
    title: "Route Deviation Detected",
    message: "Aarav's current path differs from the usual route by 320 metres.",
    severity: "warning",
    timestamp: "2026-06-09T08:05:00+05:30",
    isRead: false,
    location: "Jayanagar 3rd Block",
  },
  {
    id: "alert-003",
    type: "left_home",
    title: "Left Home",
    message: "Aarav left home at 7:30 AM. Journey to school has started.",
    severity: "info",
    timestamp: "2026-06-09T07:30:00+05:30",
    isRead: true,
    location: "Jayanagar 4th Block",
  },
  {
    id: "alert-004",
    type: "left_school",
    title: "Left School",
    message: "Aarav left Delhi Public School at 2:30 PM.",
    severity: "info",
    timestamp: "2026-06-08T14:30:00+05:30",
    isRead: true,
    location: "Delhi Public School, Bengaluru",
  },
  {
    id: "alert-005",
    type: "arrived_tuition",
    title: "Arrived at Tuition",
    message: "Aarav arrived at Brilliant Minds Tuition at 4:35 PM.",
    severity: "success",
    timestamp: "2026-06-08T16:35:00+05:30",
    isRead: true,
    location: "Brilliant Minds Tuition, Jayanagar",
  },
  {
    id: "alert-006",
    type: "low_battery",
    title: "Battery Warning",
    message: "SmartBag device battery is at 18%. Please charge tonight.",
    severity: "warning",
    timestamp: "2026-06-07T17:00:00+05:30",
    isRead: true,
  },
  {
    id: "alert-007",
    type: "entered_home",
    title: "Arrived Home Safely ✓",
    message: "Aarav arrived home at 7:05 PM.",
    severity: "success",
    timestamp: "2026-06-08T19:05:00+05:30",
    isRead: true,
    location: "Jayanagar 4th Block",
  },
  {
    id: "alert-008",
    type: "sos",
    title: "🚨 SOS Alert Triggered",
    message: "Emergency SOS was triggered. Immediate attention required.",
    severity: "danger",
    timestamp: "2026-06-06T12:30:00+05:30",
    isRead: true,
    location: "MG Road, Bengaluru",
  },
];

// ─── Route History ─────────────────────────────────────────────────────────────

const generateRoute = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  steps: number
) =>
  Array.from({ length: steps }, (_, i) => ({
    coords: {
      lat: from.lat + (to.lat - from.lat) * (i / (steps - 1)),
      lng: from.lng + (to.lng - from.lng) * (i / (steps - 1)),
    },
    timestamp: new Date(Date.now() - (steps - i) * 60000).toISOString(),
    speed: Math.round(12 + Math.random() * 12),
  }));

export const DEMO_ROUTES: RouteHistory[] = [
  {
    id: "route-today-1",
    date: "2026-06-09",
    label: "Home → School",
    points: generateRoute(LOCATIONS.home, LOCATIONS.school, 18),
    distance: 1.8,
    duration: 22,
    startTime: "07:30",
    endTime: "07:52",
  },
  {
    id: "route-today-2",
    date: "2026-06-09",
    label: "School → Tuition",
    points: generateRoute(LOCATIONS.school, LOCATIONS.tuition, 12),
    distance: 0.9,
    duration: 14,
    startTime: "14:30",
    endTime: "14:44",
  },
  {
    id: "route-yesterday-1",
    date: "2026-06-08",
    label: "Home → School",
    points: generateRoute(LOCATIONS.home, LOCATIONS.school, 18),
    distance: 1.8,
    duration: 25,
    startTime: "07:28",
    endTime: "07:53",
  },
];

// ─── Weekly Stats ──────────────────────────────────────────────────────────────

export const DEMO_WEEKLY_STATS: WeeklyStats[] = [
  { day: "Mon", distance: 4.2, travelTime: 48, attended: true },
  { day: "Tue", distance: 3.8, travelTime: 44, attended: true },
  { day: "Wed", distance: 4.5, travelTime: 52, attended: true },
  { day: "Thu", distance: 4.1, travelTime: 46, attended: true },
  { day: "Fri", distance: 3.9, travelTime: 43, attended: true },
  { day: "Sat", distance: 1.2, travelTime: 18, attended: false },
  { day: "Sun", distance: 0,   travelTime: 0,  attended: false },
];

// ─── Monthly Attendance ────────────────────────────────────────────────────────

export const DEMO_ATTENDANCE: AttendanceRecord[] = Array.from({ length: 22 }, (_, i) => ({
  date: `2026-06-${String(i + 1).padStart(2, "0")}`,
  present: i < 20 ? Math.random() > 0.1 : false,
  arrivalTime: "08:15",
  departureTime: "14:30",
}));

export const ATTENDANCE_SUMMARY = {
  present: DEMO_ATTENDANCE.filter((a) => a.present).length,
  absent: DEMO_ATTENDANCE.filter((a) => !a.present).length,
  total: DEMO_ATTENDANCE.length,
};

// ─── Safety Score ──────────────────────────────────────────────────────────────

export const DEMO_SAFETY_SCORE: SafetyScore = {
  score: 87,
  routeConsistency: 92,
  attendanceRate: 95,
  geofenceCompliance: 88,
  deviceHealth: 82,
  riskLevel: "low",
};

// ─── SOS Demo ─────────────────────────────────────────────────────────────────

export const SOS_EVENT = {
  triggerTime: "2026-06-06T12:30:00+05:30",
  resolvedTime: "2026-06-06T12:47:00+05:30",
  location: { lat: 12.9719, lng: 77.5937 },
  address: "MG Road, Bengaluru, Karnataka 560001",
  emergencyContacts: [
    { name: "Priya Sharma (Mother)", phone: "+91 98765 43210", relation: "Mother" },
    { name: "Raj Sharma (Father)",   phone: "+91 98765 43211", relation: "Father" },
    { name: "Sunita Verma",          phone: "+91 98765 43212", relation: "Grandparent" },
  ],
};

// ─── Monthly distance trend ────────────────────────────────────────────────────

export const MONTHLY_TREND = Array.from({ length: 30 }, (_, i) => ({
  date: `Jun ${i + 1}`,
  distance: i < 20 ? +(3.5 + Math.random() * 2).toFixed(1) : 0,
  avg: 4.0,
}));

// ─── Most visited locations ────────────────────────────────────────────────────

export const VISITED_LOCATIONS = [
  { name: "Delhi Public School", visits: 42, coords: LOCATIONS.school },
  { name: "Home",                visits: 60, coords: LOCATIONS.home },
  { name: "Brilliant Minds Tuition", visits: 28, coords: LOCATIONS.tuition },
  { name: "City Park",           visits: 8,  coords: { lat: 12.9730, lng: 77.5955 } },
  { name: "Supermarket",         visits: 5,  coords: { lat: 12.9700, lng: 77.5930 } },
];
