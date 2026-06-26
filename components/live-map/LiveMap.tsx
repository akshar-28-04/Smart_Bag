"use client";
import { useState, useEffect, useRef } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, Polyline, Circle,
  useMap, ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Navigation, Shield, MapPin, Wifi, Clock, TrendingUp,
  AlertTriangle, Satellite, Battery, Signal, Maximize2,
  Crosshair, CircuitBoard,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";
import { useFirebase } from "@/hooks/useFirebase";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function createChildIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:44px;height:44px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:rgba(14,165,233,0.3);animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="position:absolute;inset:6px;border-radius:50%;background:#0EA5E9;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(14,165,233,0.5);">
        <span style="font-size:12px;">🎒</span>
      </div>
    </div>
    <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

function createCustomIcon(color: string, emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:${color};border:3px solid white;display:flex;align-items:center;justify-content:center;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.4);"><span style="transform:rotate(45deg);font-size:14px;">${emoji}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

function SmoothMarker({ position }: { position: [number, number] }) {
  const markerRef = useRef<L.Marker>(null);
  const fromRef = useRef(position);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = position;
    const duration = 800;
    const startTime = performance.now();

    function step(time: number) {
      const t = Math.min((time - startTime) / duration, 1);
      const lat = from[0] + (to[0] - from[0]) * t;
      const lng = from[1] + (to[1] - from[1]) * t;
      markerRef.current?.setLatLng([lat, lng]);
      if (t < 1) animRef.current = requestAnimationFrame(step);
    }

    animRef.current = requestAnimationFrame(step);
    fromRef.current = to;
    return () => { if (animRef.current !== null) cancelAnimationFrame(animRef.current); };
  }, [position]);

  return (
    <Marker ref={markerRef} position={position} icon={createChildIcon()}>
      <Popup>
        <div style={{ color: "#F8FAFC", minWidth: 160 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>🎒 Live Location</div>
          <div style={{ color: "#94A3B8", fontSize: 12 }}>
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

function FirstCenterController({ position }: { position: [number, number] | null }) {
  const map = useMap();
  const centered = useRef(false);

  useEffect(() => {
    if (position && !centered.current) {
      map.setView(position, map.getZoom());
      centered.current = true;
    }
  }, [position, map]);

  return null;
}

function LocateButton() {
  const map = useMap();
  const { currentPosition } = useSmartBag();

  return (
    <button
      onClick={() => currentPosition && map.setView(currentPosition, map.getZoom())}
      className="absolute top-20 right-4 z-[1000] w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
      title="Center on device"
    >
      <Crosshair className="w-4 h-4" />
    </button>
  );
}

function FullscreenButton() {
  const [fs, setFs] = useState(false);

  return (
    <button
      onClick={() => {
        if (!document.fullscreenElement) {
          document.getElementById("live-map-container")?.requestFullscreen();
          setFs(true);
        } else {
          document.exitFullscreen();
          setFs(false);
        }
      }}
      className="absolute top-32 right-4 z-[1000] w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
      title="Fullscreen"
    >
      <Maximize2 className="w-4 h-4" />
    </button>
  );
}

function StatusCard({
  icon: Icon, label, value, color, status,
}: {
  icon: React.ElementType; label: string; value: string;
  color: string; status?: "good" | "warn" | "bad";
}) {
  const dotColors = { good: "#22C55E", warn: "#F59E0B", bad: "#EF4444" };
  return (
    <div className="bg-[#0F172A] rounded-xl p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[#64748B] text-[10px] uppercase tracking-wider">{label}</div>
        <div className="text-white text-sm font-semibold truncate">{value}</div>
      </div>
      {status && (
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColors[status] }} />
      )}
    </div>
  );
}

export default function LiveMap() {
  const {
    currentPosition, speed, satellites, gpsFix, gpsStatus,
    gpsHistory, lastUpdate, mqttConnected, sosActive, connectionStatus,
  } = useSmartBag();
  const { childCurrent, safeZones } = useFirebase();

  const defaultCenter: [number, number] = [12.9748, 77.5975];
  const center = currentPosition ?? defaultCenter;

  const routePoints = gpsHistory.map((p) => [p.latitude, p.longitude] as [number, number]);

  return (
    <div id="live-map-container" className="flex flex-col lg:flex-row h-[calc(100vh-64px)] relative">
      {/* Left Panel */}
      <div className="w-full lg:w-[350px] bg-[#1E293B] border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto flex-shrink-0">
        <div className="p-5">
          <h2 className="text-white font-bold text-lg mb-1">Current Status</h2>
          <p className="text-[#64748B] text-xs mb-4">
            {lastUpdate
              ? `Updated ${lastUpdate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : "Waiting for data..."}
          </p>

          <div className="space-y-2">
            <StatusCard icon={MapPin} label="GPS" value={gpsFix ? gpsStatus || "Fixed" : "No Fix"} color="#0EA5E9" status={gpsFix ? "good" : "bad"} />
            <StatusCard icon={TrendingUp} label="Speed" value={`${speed.toFixed(1)} km/h`} color="#22C55E" />
            <StatusCard icon={AlertTriangle} label="SOS" value={sosActive ? "ACTIVE" : "Standby"} color="#EF4444" status={sosActive ? "bad" : "good"} />
            <StatusCard icon={Satellite} label="Satellites" value={`${satellites}`} color="#A855F7" status={satellites > 4 ? "good" : satellites > 0 ? "warn" : "bad"} />
            <StatusCard icon={Battery} label="Battery" value="—" color="#F59E0B" />
            <StatusCard icon={Wifi} label="MQTT" value={mqttConnected ? "Connected" : "Disconnected"} color="#2563EB" status={mqttConnected ? "good" : "bad"} />
            <StatusCard icon={Signal} label="WiFi" value={mqttConnected ? "Connected" : "Disconnected"} color="#22C55E" status={mqttConnected ? "good" : "bad"} />
          </div>
        </div>

        {/* Coordinates & Address */}
        <div className="px-5 pb-5">
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#2563EB]" />
              <span className="text-white text-xs font-semibold">Location</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-[#475569] text-[10px] uppercase">Coordinates</div>
                <div className="text-white text-xs font-mono">
                  {currentPosition
                    ? `${currentPosition[0].toFixed(6)}, ${currentPosition[1].toFixed(6)}`
                    : "Acquiring..."}
                </div>
              </div>
              <div>
                <div className="text-[#475569] text-[10px] uppercase">Address</div>
                <div className="text-[#94A3B8] text-xs">
                  {gpsFix ? "Reverse geocode unavailable" : "No GPS fix"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-[400px]">
        <MapContainer
          center={center}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <ZoomControl position="topright" />
          <FirstCenterController position={currentPosition} />

          {safeZones.filter((z) => z.isActive).map((zone) => (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.1, weight: 2, dashArray: "6 4" }}
            />
          ))}

          {routePoints.length > 1 && (
            <Polyline
              positions={routePoints}
              pathOptions={{ color: "#2563EB", weight: 4, opacity: 0.8, dashArray: "10 5" }}
            />
          )}

          {safeZones.filter((z) => z.isActive).map((zone) => {
            const emoji = zone.type === "home" ? "🏠" : zone.type === "school" ? "🏫" : "📍";
            return (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={createCustomIcon(zone.color, emoji)}>
                <Popup>
                  <div style={{ color: "#F8FAFC" }}>
                    <b>{zone.name}</b><br />
                    <span style={{ color: "#94A3B8", fontSize: 12 }}>Radius: {zone.radius}m</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {currentPosition ? (
            <SmoothMarker position={currentPosition} />
          ) : (
            <Marker position={defaultCenter} icon={createChildIcon()}>
              <Popup><div style={{ color: "#F8FAFC" }}>Waiting for GPS...</div></Popup>
            </Marker>
          )}

          <LocateButton />
          <FullscreenButton />
        </MapContainer>
      </div>

      {/* Bottom floating status strip */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-[1000]">
        <div className="glass-strong rounded-2xl px-5 py-3 border border-white/10 flex items-center justify-between gap-4 max-w-3xl mx-auto pointer-events-auto">
          <StatusBadge label="GPS" active={gpsFix} color="#0EA5E9" />
          <StatusBadge label="MQTT" active={mqttConnected} color="#2563EB" />
          <StatusBadge label="Firebase" active={true} color="#22C55E" />
          <StatusBadge label="ESP32" active={mqttConnected} color="#F59E0B" />
          <div className="text-[#475569] text-[10px] whitespace-nowrap">
            {lastUpdate
              ? `${Math.round((Date.now() - lastUpdate.getTime()) / 1000)}s ago`
              : "No data"}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ label, active, color }: { label: string; active: boolean; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? color : "#334155" }} />
      <span className="text-[#94A3B8] text-[10px] font-medium">{label}</span>
    </div>
  );
}
