"use client";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Navigation, Shield, MapPin, Wifi, Battery, Clock, TrendingUp,
  AlertTriangle, ChevronUp, ChevronDown,
} from "lucide-react";
import { DEMO_DEVICE, DEMO_LOCATION, DEMO_SAFE_ZONES, LOCATIONS, DEMO_ROUTES } from "@/lib/demo-data";

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function createCustomIcon(color: string, emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      background:${color};border:3px solid white;
      display:flex;align-items:center;justify-content:center;
      transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.4);
    ">
      <span style="transform:rotate(45deg);font-size:14px;">${emoji}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

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

function AnimatedChild({ position }: { position: [number, number] }) {
  const markerRef = useRef<L.Marker>(null);
  const [currentPos, setCurrentPos] = useState(position);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPos(([lat, lng]) => [
        lat + (Math.random() - 0.5) * 0.0002,
        lng + (Math.random() - 0.5) * 0.0002,
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    markerRef.current?.setLatLng(currentPos);
  }, [currentPos]);

  return (
    <Marker ref={markerRef} position={currentPos} icon={createChildIcon()}>
      <Popup>
        <div style={{ color: "#F8FAFC", background: "transparent", minWidth: 160 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>🎒 Aarav Sharma</div>
          <div style={{ color: "#94A3B8", fontSize: 12 }}>Speed: 18 km/h</div>
          <div style={{ color: "#94A3B8", fontSize: 12 }}>GPS: 4m accuracy</div>
          <div style={{ color: "#22C55E", fontSize: 12, marginTop: 4 }}>● Live Tracking</div>
        </div>
      </Popup>
    </Marker>
  );
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 15); }, [center, map]);
  return null;
}

export default function LiveTrackingMap() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [speed, setSpeed] = useState(18);
  const [time] = useState(() => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    const iv = setInterval(() => setSpeed(Math.round(14 + Math.random() * 10)), 3000);
    return () => clearInterval(iv);
  }, []);

  const routePoints = DEMO_ROUTES[0].points.map((p) => [p.coords.lat, p.coords.lng] as [number, number]);
  const center: [number, number] = [LOCATIONS.current.lat, LOCATIONS.current.lng];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col">
      {/* Map */}
      <div className="flex-1 relative">
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
          <MapController center={center} />

          {/* Safe zone circles */}
          {DEMO_SAFE_ZONES.map((zone) => (
            <Circle
              key={zone.id}
              center={[zone.center.lat, zone.center.lng]}
              radius={zone.radius}
              pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.1, weight: 2, dashArray: "6 4" }}
            />
          ))}

          {/* Route trail */}
          <Polyline
            positions={routePoints}
            pathOptions={{ color: "#2563EB", weight: 4, opacity: 0.8, dashArray: "10 5" }}
          />

          {/* Location markers */}
          <Marker position={[LOCATIONS.home.lat, LOCATIONS.home.lng]} icon={createCustomIcon("#22C55E", "🏠")}>
            <Popup><div style={{ color: "#F8FAFC" }}><b>Home</b><br /><span style={{ color: "#94A3B8", fontSize: 12 }}>Safe Zone • 150m radius</span></div></Popup>
          </Marker>
          <Marker position={[LOCATIONS.school.lat, LOCATIONS.school.lng]} icon={createCustomIcon("#2563EB", "🏫")}>
            <Popup><div style={{ color: "#F8FAFC" }}><b>Delhi Public School</b><br /><span style={{ color: "#94A3B8", fontSize: 12 }}>Safe Zone • 200m radius</span></div></Popup>
          </Marker>
          <Marker position={[LOCATIONS.tuition.lat, LOCATIONS.tuition.lng]} icon={createCustomIcon("#0EA5E9", "📚")}>
            <Popup><div style={{ color: "#F8FAFC" }}><b>Brilliant Minds Tuition</b><br /><span style={{ color: "#94A3B8", fontSize: 12 }}>Safe Zone • 100m radius</span></div></Popup>
          </Marker>

          {/* Animated child marker */}
          <AnimatedChild position={center} />
        </MapContainer>
      </div>

      {/* Info Panel */}
      <motion.div
        animate={{ y: panelOpen ? 0 : "calc(100% - 56px)" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 right-0 bg-[#1E293B]/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl"
      >
        {/* Handle */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="w-full flex items-center justify-center gap-2 py-3 text-[#64748B] hover:text-white transition-colors"
        >
          <div className="w-12 h-1 rounded-full bg-[#334155]" />
        </button>

        <div className="px-6 pb-6">
          {/* Child header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm">
              AS
            </div>
            <div className="flex-1">
              <div className="text-white font-bold">Aarav Sharma</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[#22C55E] text-xs font-medium">Live — Travelling to School</span>
              </div>
            </div>
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="w-8 h-8 rounded-full glass flex items-center justify-center text-[#64748B] hover:text-white"
            >
              {panelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { icon: TrendingUp, label: "Speed", value: `${speed} km/h`, color: "#0EA5E9" },
              { icon: Clock,      label: "Updated", value: time, color: "#A855F7" },
              { icon: Wifi,       label: "GPS Accuracy", value: "4 metres", color: "#22C55E" },
              { icon: Navigation, label: "ETA to School", value: "~12 min", color: "#F59E0B" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-[#0F172A] rounded-xl p-3 text-center">
                <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                <div className="text-white text-sm font-bold">{value}</div>
                <div className="text-[#475569] text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 p-3 bg-[#0F172A] rounded-xl">
            <MapPin className="w-4 h-4 text-[#2563EB] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-white text-sm font-medium">{DEMO_LOCATION.address}</div>
              <div className="text-[#64748B] text-xs mt-0.5">
                {DEMO_LOCATION.coords.lat.toFixed(4)}, {DEMO_LOCATION.coords.lng.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Device status row */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-[#94A3B8] text-xs">{DEMO_DEVICE.battery}% battery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#22C55E]" />
              <span className="text-[#22C55E] text-xs font-medium">Safe</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[#475569] text-xs">
              <AlertTriangle className="w-3 h-3" />
              No alerts
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
