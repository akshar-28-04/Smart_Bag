"use client";
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { connect, disconnect, on } from "@/lib/mqtt";
import type {
  GPSPoint,
  SmartBagState,
  ConnectionStatus,
  MQTTLocationPayload,
} from "@/types/smartbag";

const MAX_HISTORY = 100;

function haversineKm(
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

export const SmartBagContext = createContext<SmartBagState | null>(null);

export function SmartBagProvider({ children }: { children: ReactNode }) {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [speed, setSpeed] = useState(0);
  const [satellites, setSatellites] = useState(0);
  const [gpsFix, setGpsFix] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("");
  const [gpsHistory, setGpsHistory] = useState<GPSPoint[]>([]);
  const [sosActive, setSosActive] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [journeyDuration, setJourneyDuration] = useState(0);

  const distanceRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  const handleLocation = useCallback((data: MQTTLocationPayload) => {
    const pos: [number, number] = [data.latitude, data.longitude];
    const now = Date.now();
    const point: GPSPoint = {
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      satellites: data.satellites,
      timestamp: now,
    };

    setCurrentPosition(pos);
    setSpeed(data.speed);
    setSatellites(data.satellites);
    setGpsFix(data.gpsFix);
    setGpsStatus(data.gpsStatus);
    setLastUpdate(new Date(now));

    setGpsHistory((prev) => {
      const next = [...prev, point];
      if (next.length > MAX_HISTORY) next.splice(0, next.length - MAX_HISTORY);

      if (next.length >= 2) {
        const last = next[next.length - 2];
        const seg = haversineKm(
          last.latitude,
          last.longitude,
          data.latitude,
          data.longitude
        );
        distanceRef.current += seg;
        setDistanceTravelled(distanceRef.current);
      }

      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }

      setJourneyDuration((now - startTimeRef.current) / 60000);

      const speeds = next.map((p) => p.speed);
      setAverageSpeed(
        speeds.reduce((a, b) => a + b, 0) / speeds.length
      );
      setMaxSpeed(Math.max(...speeds));

      return next;
    });
  }, []);

  const handleSos = useCallback((active: boolean) => {
    setSosActive(active);
  }, []);

  const handleStatus = useCallback((s: ConnectionStatus) => {
    setConnectionStatus(s);
  }, []);

  useEffect(() => {
    connect();

    const unsubLocation = on("location", (d) => handleLocation(d as MQTTLocationPayload));
    const unsubSos = on("sos", (d) => handleSos(d as boolean));
    const unsubStatus = on("status", (d) => handleStatus(d as ConnectionStatus));

    return () => {
      unsubLocation();
      unsubSos();
      unsubStatus();
      disconnect();
    };
  }, [handleLocation, handleSos, handleStatus]);

  const value: SmartBagState = {
    currentPosition,
    speed,
    satellites,
    gpsFix,
    gpsStatus,
    gpsHistory,
    sosActive,
    connectionStatus,
    lastUpdate,
    distanceTravelled,
    averageSpeed,
    maxSpeed,
    journeyDuration,
    mqttConnected: connectionStatus === "connected",
  };

  return (
    <SmartBagContext.Provider value={value}>{children}</SmartBagContext.Provider>
  );
}
