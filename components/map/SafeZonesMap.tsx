"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shield, Plus, MapPin, Clock, CheckCircle, XCircle, Edit2, Trash2 } from "lucide-react";
import { DEMO_SAFE_ZONES } from "@/lib/demo-data";
import type { SafeZone } from "@/lib/types";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function createZoneIcon(color: string, emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:34px;height:34px;border-radius:50%;background:${color};border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);font-size:14px;">${emoji}</div>`,
    iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -20],
  });
}

const ZONE_EMOJIS: Record<string, string> = { home: "🏠", school: "🏫", tuition: "📚", custom: "📍" };

function ZoneCard({ zone, selected, onClick }: { zone: SafeZone; selected: boolean; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
        selected ? "border-white/20 bg-white/5" : "border-white/5 hover:border-white/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${zone.color}20` }}>
          {ZONE_EMOJIS[zone.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white font-semibold text-sm truncate">{zone.name}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#475569] hover:text-[#0EA5E9] transition-colors">
                <Edit2 className="w-3 h-3" />
              </button>
              <button className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#475569] hover:text-[#EF4444] transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" style={{ color: zone.color }} />
              <span className="text-[#64748B] text-xs">{zone.radius}m radius</span>
            </div>
            <div className="flex items-center gap-1">
              {zone.isActive
                ? <CheckCircle className="w-3 h-3 text-[#22C55E]" />
                : <XCircle className="w-3 h-3 text-[#EF4444]" />}
              <span className={`text-xs ${zone.isActive ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {zone.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {(zone.entryTime || zone.exitTime) && (
            <div className="flex items-center gap-3 mt-2 text-[#475569] text-xs">
              {zone.entryTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#22C55E]" />
                  <span>In: {zone.entryTime}</span>
                </div>
              )}
              {zone.exitTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#EF4444]" />
                  <span>Out: {zone.exitTime}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SafeZonesMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const center: [number, number] = [12.975, 77.597];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-[#1E293B] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-bold text-lg">Safe Zones</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] font-medium">
              {DEMO_SAFE_ZONES.filter((z) => z.isActive).length} active
            </span>
          </div>
          <p className="text-[#64748B] text-xs">Geofenced areas for {'"'}Aarav Sharma{'"'}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {DEMO_SAFE_ZONES.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              selected={selectedZone === zone.id}
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            />
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add New Zone
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer center={center} zoom={15} style={{ width: "100%", height: "100%" }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          {DEMO_SAFE_ZONES.map((zone) => (
            <div key={zone.id}>
              <Circle
                center={[zone.center.lat, zone.center.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: selectedZone === zone.id ? 0.2 : 0.1,
                  weight: selectedZone === zone.id ? 3 : 2,
                  dashArray: "6 4",
                }}
              />
              <Marker
                position={[zone.center.lat, zone.center.lng]}
                icon={createZoneIcon(zone.color, ZONE_EMOJIS[zone.type])}
              >
                <Popup>
                  <div style={{ color: "#F8FAFC", minWidth: 160 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{zone.name}</div>
                    <div style={{ color: "#94A3B8", fontSize: 12 }}>Radius: {zone.radius}m</div>
                    {zone.entryTime && <div style={{ color: "#94A3B8", fontSize: 12 }}>Entry: {zone.entryTime}</div>}
                    {zone.exitTime && <div style={{ color: "#94A3B8", fontSize: 12 }}>Exit: {zone.exitTime}</div>}
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 glass-strong rounded-2xl p-4 border border-white/10">
          <div className="text-white text-xs font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-3 h-3 text-[#2563EB]" /> Zone Legend
          </div>
          {DEMO_SAFE_ZONES.map((z) => (
            <div key={z.id} className="flex items-center gap-2 mb-2 last:mb-0">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
              <span className="text-[#94A3B8] text-xs">{z.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
