import mqtt from "mqtt";
import type { MQTTLocationPayload, ConnectionStatus } from "@/types/smartbag";
import {
  updateChildCurrent,
  pushHistory,
  pushAlert,
  pushNotification,
  updateAnalytics,
  isFirebaseAvailable,
} from "./firebase";

type EventCallback = (data: unknown) => void;

const listeners: Record<string, Set<EventCallback>> = {};
let client: mqtt.MqttClient | null = null;
let connectionStatus: ConnectionStatus = "disconnected";
let lastLocation: MQTTLocationPayload | null = null;

const TOPICS = ["smartbag/location", "smartbag/sos"];
const firebaseAvailable = isFirebaseAvailable();

function emit(event: string, data: unknown) {
  listeners[event]?.forEach((cb) => cb(data));
}

function setStatus(s: ConnectionStatus) {
  connectionStatus = s;
  emit("status", s);
}

export function on(event: string, callback: EventCallback): () => void {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(callback);
  return () => listeners[event].delete(callback);
}

export function connect() {
  if (client) return;
  if (typeof window === "undefined") return;

  const host = process.env.NEXT_PUBLIC_MQTT_HOST;
  const port = process.env.NEXT_PUBLIC_MQTT_PORT;
  const username = process.env.NEXT_PUBLIC_MQTT_USERNAME;
  const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD;

  if (!host || !port || !username || !password) {
    console.warn("[MQTT] Missing environment variables");
    setStatus("disconnected");
    return;
  }

  setStatus("connecting");

  const url = `wss://${host}:${port}/mqtt`;

  client = mqtt.connect(url, {
    username,
    password,
    reconnectPeriod: 5000,
    connectTimeout: 10000,
    keepalive: 30,
    clean: true,
  });

  client.on("connect", () => {
    setStatus("connected");
    TOPICS.forEach((t) => client?.subscribe(t));
  });

  client.on("message", (topic, payload) => {
    const raw = payload instanceof ArrayBuffer ? new TextDecoder().decode(payload) : payload.toString();
    const str = raw.trim();
    try {
      if (topic === "smartbag/location") {
        const data: MQTTLocationPayload = JSON.parse(str);
        lastLocation = data;
        emit("location", data);

        if (firebaseAvailable) {
          updateChildCurrent({
            latitude: data.latitude,
            longitude: data.longitude,
            speed: data.speed,
            satellites: data.satellites,
            gpsFix: data.gpsFix,
            gpsStatus: data.gpsStatus,
            online: true,
            mqttConnected: true,
            wifiConnected: true,
          });
          pushHistory({
            latitude: data.latitude,
            longitude: data.longitude,
            speed: data.speed,
            satellites: data.satellites,
            gpsFix: data.gpsFix,
            timestamp: Date.now(),
          });
        }
      } else if (topic === "smartbag/sos") {
        const active = str === "true";
        emit("sos", active);

        if (firebaseAvailable) {
          updateChildCurrent({ sos: active });
          if (active) {
            pushAlert({
              type: "sos_activated",
              title: "SOS Activated",
              description: "Emergency SOS button was pressed!",
              severity: "danger",
              timestamp: Date.now(),
            });
            pushNotification({
              title: "SOS Alert",
              body: "Emergency SOS has been triggered!",
              read: false,
              timestamp: Date.now(),
            });
          } else {
            pushAlert({
              type: "sos_cleared",
              title: "SOS Cleared",
              description: "Emergency alert has been resolved.",
              severity: "success",
              timestamp: Date.now(),
            });
          }
        }
      }
    } catch {
      console.warn(
        "[MQTT] Failed to parse",
        topic,
        JSON.stringify(str).slice(0, 200),
        `(length: ${str.length}, charCodes: ${str.charCodeAt(0) ?? "?"})`
      );
    }
  });

  client.on("close", () => {
    setStatus("disconnected");
    if (firebaseAvailable) updateChildCurrent({ online: false, mqttConnected: false });
  });
  client.on("offline", () => {
    setStatus("disconnected");
    if (firebaseAvailable) updateChildCurrent({ online: false, mqttConnected: false });
  });
  client.on("error", () => {});
}

export function disconnect() {
  client?.end(true);
  client = null;
  setStatus("disconnected");
}

export function getStatus(): ConnectionStatus {
  return connectionStatus;
}

export function getLastLocation(): MQTTLocationPayload | null {
  return lastLocation;
}
