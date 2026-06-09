// Types for SmartBag application

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  school: string;
  avatar?: string;
}

export interface Device {
  id: string;
  battery: number;
  signalStrength: number; // 0-5
  gpsStatus: "excellent" | "good" | "poor" | "no-signal";
  lastSync: string;
  firmware: string;
  uptime: string;
  isOnline: boolean;
}

export interface LocationData {
  coords: LatLng;
  address: string;
  speed: number;
  accuracy: number;
  timestamp: string;
  status: "home" | "school" | "tuition" | "travelling" | "unknown";
}

export interface SafeZone {
  id: string;
  name: string;
  type: "home" | "school" | "tuition" | "custom";
  center: LatLng;
  radius: number; // meters
  color: string;
  entryTime?: string;
  exitTime?: string;
  isActive: boolean;
}

export type AlertSeverity = "info" | "success" | "warning" | "danger";
export type AlertType =
  | "entered_school"
  | "left_school"
  | "sos"
  | "route_deviation"
  | "device_offline"
  | "low_battery"
  | "entered_home"
  | "left_home"
  | "geofence_exit"
  | "geofence_enter"
  | "arrived_tuition"
  | "left_tuition";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  isRead: boolean;
  location?: string;
}

export interface RoutePoint {
  coords: LatLng;
  timestamp: string;
  speed: number;
}

export interface RouteHistory {
  id: string;
  date: string;
  label: string;
  points: RoutePoint[];
  distance: number; // km
  duration: number; // minutes
  startTime: string;
  endTime: string;
}

export interface WeeklyStats {
  day: string;
  distance: number;
  travelTime: number;
  attended: boolean;
}

export interface SafetyScore {
  score: number;
  routeConsistency: number;
  attendanceRate: number;
  geofenceCompliance: number;
  deviceHealth: number;
  riskLevel: "low" | "medium" | "high";
}

export interface AttendanceRecord {
  date: string;
  present: boolean;
  arrivalTime?: string;
  departureTime?: string;
}
