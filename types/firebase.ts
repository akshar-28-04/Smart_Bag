export interface FirebaseChildCurrent {
  latitude: number;
  longitude: number;
  speed: number;
  satellites: number;
  gpsFix: boolean;
  gpsStatus: string;
  online: boolean;
  sos: boolean;
  mqttConnected: boolean;
  wifiConnected: boolean;
  timestamp: number;
  maps: string;
}

export interface FirebaseHistoryPoint {
  latitude: number;
  longitude: number;
  speed: number;
  satellites: number;
  gpsFix: boolean;
  timestamp: number;
}

export interface FirebaseAlert {
  type: string;
  title: string;
  description: string;
  severity: "success" | "info" | "warning" | "danger";
  timestamp: number;
}

export interface FirebaseNotification {
  id?: string;
  title: string;
  body: string;
  read: boolean;
  timestamp: number;
}

export interface FirebaseDevice {
  firmware: string;
  uptime: string;
  heap: number;
  wifiRSSI: number;
  mqttLatency: number;
  restartReason: string;
  gpsHdop: number;
}

export interface FirebaseAnalytics {
  distanceToday: number;
  averageSpeed: number;
  maxSpeed: number;
  tripDuration: number;
}

export interface FirebaseUser {
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
  childName: string;
  deviceId: string;
  emergencyContacts: FirebaseEmergencyContact[];
}

export interface FirebaseEmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface FirebaseSafeZone {
  id?: string;
  name: string;
  type: "home" | "school" | "tuition" | "custom";
  lat: number;
  lng: number;
  radius: number;
  color: string;
  entryTime?: string;
  exitTime?: string;
  isActive: boolean;
}

export interface FirebaseData {
  childCurrent: FirebaseChildCurrent | null;
  device: FirebaseDevice | null;
  alerts: FirebaseAlert[];
  notifications: FirebaseNotification[];
  analytics: FirebaseAnalytics | null;
}
