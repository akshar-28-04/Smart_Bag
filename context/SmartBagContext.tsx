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
import { updateAnalytics, isFirebaseAvailable } from "@/services/firebase";
import { haversineKm } from "@/services/analytics";
import type {
  GPSPoint,
  SmartBagState,
  ConnectionStatus,
  MQTTLocationPayload,
} from "@/types/smartbag";

const MAX_HISTORY = 100;

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
  const speedCountRef = useRef(0);
  const speedSumRef = useRef(0);
  const speedMaxRef = useRef(0);
  const lastPointRef = useRef<{ lat: number; lng: number } | null>(null);
  const fbAvailable = isFirebaseAvailable();

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

    // Track distance using ref (no setState in render)
    if (lastPointRef.current) {
      distanceRef.current += haversineKm(
        lastPointRef.current.lat,
        lastPointRef.current.lng,
        data.latitude,
        data.longitude
      );
    }
    lastPointRef.current = { lat: data.latitude, lng: data.longitude };
    setDistanceTravelled(distanceRef.current);

    // Track speed stats using refs
    speedSumRef.current += data.speed;
    speedCountRef.current += 1;
    if (data.speed > speedMaxRef.current) speedMaxRef.current = data.speed;
    setAverageSpeed(speedSumRef.current / speedCountRef.current);
    setMaxSpeed(speedMaxRef.current);

    // Track duration
    if (startTimeRef.current === null) startTimeRef.current = now;
    const duration = (now - startTimeRef.current) / 60000;
    setJourneyDuration(duration);

    // Firebase analytics write (outside setGpsHistory)
    if (fbAvailable) {
      updateAnalytics({
        distanceToday: distanceRef.current,
        averageSpeed: speedSumRef.current / speedCountRef.current,
        maxSpeed: speedMaxRef.current,
        tripDuration: duration,
      });
    }

    // Append to history (pure: no side effects inside updater)
    setGpsHistory((prev) => {
      const next = [...prev, point];
      if (next.length > MAX_HISTORY) next.splice(0, next.length - MAX_HISTORY);
      return next;
    });
  }, [fbAvailable]);

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
