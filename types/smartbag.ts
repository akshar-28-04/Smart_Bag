export interface MQTTLocationPayload {
  latitude: number;
  longitude: number;
  speed: number;
  satellites: number;
  gpsFix: boolean;
  gpsStatus: string;
  maps?: string;
}

export interface GPSPoint {
  latitude: number;
  longitude: number;
  speed: number;
  satellites: number;
  timestamp: number;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export interface SmartBagState {
  currentPosition: [number, number] | null;
  speed: number;
  satellites: number;
  gpsFix: boolean;
  gpsStatus: string;
  gpsHistory: GPSPoint[];
  sosActive: boolean;
  connectionStatus: ConnectionStatus;
  lastUpdate: Date | null;
  distanceTravelled: number;
  averageSpeed: number;
  maxSpeed: number;
  journeyDuration: number;
  mqttConnected: boolean;
}
