import mqtt from "mqtt";
import type { MQTTLocationPayload, ConnectionStatus } from "@/types/smartbag";

type EventCallback = (data: unknown) => void;

const listeners: Record<string, Set<EventCallback>> = {};
let client: mqtt.MqttClient | null = null;
let connectionStatus: ConnectionStatus = "disconnected";

const TOPICS = ["smartbag/location", "smartbag/sos"];

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
    const str = payload.toString();
    try {
      if (topic === "smartbag/location") {
        const data: MQTTLocationPayload = JSON.parse(str);
        emit("location", data);
      } else if (topic === "smartbag/sos") {
        emit("sos", str === "true");
      }
    } catch {
      console.warn("[MQTT] Failed to parse", topic, str);
    }
  });

  client.on("close", () => setStatus("disconnected"));
  client.on("offline", () => setStatus("disconnected"));
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
