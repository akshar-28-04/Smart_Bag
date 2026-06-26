"use client";
import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Shield, Plus, MapPin, Clock, CheckCircle, XCircle, Edit2, Trash2,
  X, Save, Eye, EyeOff,
} from "lucide-react";
import { useFirebase } from "@/hooks/useFirebase";
import type { FirebaseSafeZone } from "@/types/firebase";

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
const ZONE_COLORS = ["#22C55E", "#2563EB", "#0EA5E9", "#F59E0B", "#A855F7", "#EF4444", "#EC4899"];

const DEFAULT_CENTER: [number, number] = [12.975, 77.597];

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const PRESET_RADII = [50, 100, 150, 200, 300, 500];

function ZoneCard({
  zone, selected, onToggle, onDelete, onEdit, onSelect,
}: {
  zone: FirebaseSafeZone; selected: boolean;
  onToggle: () => void; onDelete: () => void; onEdit: () => void;
  onSelect: () => void;
}) {
  const emoji = ZONE_EMOJIS[zone.type] ?? ZONE_EMOJIS.custom;

  return (
    <motion.div
      whileHover={{ x: 2 }}
      onClick={onSelect}
      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
        selected ? "border-white/20 bg-white/5" : "border-white/5 hover:border-white/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${zone.color}20` }}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white font-semibold text-sm truncate">{zone.name}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#475569] hover:text-[#0EA5E9] transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#475569] transition-colors"
              >
                {zone.isActive ? <Eye className="w-3 h-3 text-[#22C55E]" /> : <EyeOff className="w-3 h-3 text-[#EF4444]" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#475569] hover:text-[#EF4444] transition-colors"
              >
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
        </div>
      </div>
    </motion.div>
  );
}

function AddZoneModal({
  lat, lng, onSave, onCancel,
}: {
  lat: number; lng: number;
  onSave: (zone: Omit<FirebaseSafeZone, "id">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("New Zone");
  const [radius, setRadius] = useState(150);
  const [color, setColor] = useState(ZONE_COLORS[0]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60" onClick={onCancel}>
      <div
        className="rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{ backgroundColor: "#1E293B" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold">Add New Zone</h3>
          <button onClick={onCancel} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#94A3B8]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[#94A3B8] text-xs mb-1 block">Zone Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2563EB]"
              placeholder="e.g. Home, School"
            />
          </div>
          <div>
            <label className="text-[#94A3B8] text-xs mb-1 block">Radius (meters)</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_RADII.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    radius === r
                      ? "border-[#2563EB] bg-[#2563EB]/20 text-[#2563EB]"
                      : "border-white/10 text-[#94A3B8] hover:border-white/20"
                  }`}
                >
                  {r}m
                </button>
              ))}
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full mt-2 accent-[#2563EB]"
            />
          </div>
          <div>
            <label className="text-[#94A3B8] text-xs mb-1 block">Color</label>
            <div className="flex gap-2">
              {ZONE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color === c ? "border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="bg-[#0F172A] rounded-xl p-3">
            <div className="text-[#475569] text-xs mb-1">Position</div>
            <div className="text-white text-xs font-mono">{lat.toFixed(6)}, {lng.toFixed(6)}</div>
          </div>
        </div>
        <div className="p-4 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-white/10 text-[#94A3B8] text-sm hover:bg-white/5">
            Cancel
          </button>
          <button
            onClick={() => onSave({ name, type: "custom", lat, lng, radius, color, isActive: true })}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90"
          >
            <Save className="w-4 h-4" /> Save Zone
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SafeZonesMap() {
  const { safeZones, addSafeZone, updateSafeZone, deleteSafeZone } = useFirebase();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [newZonePos, setNewZonePos] = useState<{ lat: number; lng: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activeCount = safeZones.filter((z) => z.isActive).length;

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (selecting) {
      setNewZonePos({ lat, lng });
    }
  }, [selecting]);

  const handleSaveZone = useCallback((zone: Omit<FirebaseSafeZone, "id">) => {
    addSafeZone(zone);
    setNewZonePos(null);
    setSelecting(false);
  }, [addSafeZone]);

  const handleDelete = useCallback((id: string) => {
    deleteSafeZone(id);
    setConfirmDelete(null);
    setSelectedZone(null);
  }, [deleteSafeZone]);

  const handleToggle = useCallback((id: string, current: boolean) => {
    updateSafeZone(id, { isActive: !current });
  }, [updateSafeZone]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-[#1E293B] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-bold text-lg">Safe Zones</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] font-medium">
              {activeCount} active
            </span>
          </div>
          <p className="text-[#64748B] text-xs">{safeZones.length} zones defined</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {safeZones.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-10 h-10 text-[#334155] mx-auto mb-2" />
              <p className="text-[#64748B] text-xs">No zones yet. Tap &ldquo;Add New Zone&rdquo; to create one.</p>
            </div>
          ) : (
            safeZones.map((zone) => {
              const zid = zone.id ?? "";
              return (
              <ZoneCard
                key={zid}
                zone={zone}
                selected={selectedZone === zid}
                onSelect={() => setSelectedZone(selectedZone === zid ? null : zid)}
                onToggle={() => zid && handleToggle(zid, zone.isActive)}
                onDelete={() => zid && setConfirmDelete(zid)}
                onEdit={() => zid && setSelectedZone(zid)}
              />
              );
            }))}
        </div>

        <div className="p-4 border-t border-white/5">
          {selecting ? (
            <div className="flex flex-col gap-2">
              <p className="text-[#F59E0B] text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Click on the map to place the zone
              </p>
              <button
                onClick={() => { setSelecting(false); setNewZonePos(null); }}
                className="w-full py-2 rounded-xl border border-white/10 text-[#94A3B8] text-sm hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSelecting(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Add New Zone
            </button>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          <MapClickHandler onMapClick={handleMapClick} />

          {safeZones.map((zone) => (
            <div key={zone.id}>
              {zone.isActive && (
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: selectedZone === zone.id ? 0.2 : 0.1,
                    weight: selectedZone === zone.id ? 3 : 2,
                    dashArray: "6 4",
                  }}
                />
              )}
              <Marker
                position={[zone.lat, zone.lng]}
                icon={createZoneIcon(zone.color, ZONE_EMOJIS[zone.type] ?? ZONE_EMOJIS.custom)}
              >
                <Popup>
                  <div style={{ color: "#F8FAFC", minWidth: 160 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{zone.name}</div>
                    <div style={{ color: "#94A3B8", fontSize: 12 }}>Radius: {zone.radius}m</div>
                    <div style={{ color: zone.isActive ? "#22C55E" : "#EF4444", fontSize: 12 }}>
                      {zone.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}

          {newZonePos && (
            <>
              <Circle
                center={[newZonePos.lat, newZonePos.lng]}
                radius={150}
                pathOptions={{ color: "#F59E0B", fillColor: "#F59E0B", fillOpacity: 0.15, weight: 2, dashArray: "6 4" }}
              />
              <Marker position={[newZonePos.lat, newZonePos.lng]} icon={createZoneIcon("#F59E0B", "📍")}>
                <Popup>
                  <div style={{ color: "#F8FAFC" }}>New zone position</div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>

        {/* Legend */}
        {safeZones.length > 0 && (
          <div className="absolute top-4 right-4 rounded-2xl p-4 border border-white/10 shadow-lg"
            style={{ backgroundColor: "#1E293B" }}>
            <div className="text-white text-xs font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-3 h-3 text-[#2563EB]" /> Zone Legend
            </div>
            {safeZones.filter((z) => z.isActive).map((z) => (
              <div key={z.id} className="flex items-center gap-2 mb-2 last:mb-0">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
                <span className="text-[#94A3B8] text-xs">{z.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Zone Modal */}
      {newZonePos && (
        <AddZoneModal
          lat={newZonePos.lat}
          lng={newZonePos.lng}
          onSave={handleSaveZone}
          onCancel={() => { setNewZonePos(null); setSelecting(false); }}
        />
      )}

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60"
            onClick={() => setConfirmDelete(null)}
          >
            <div
              className="rounded-2xl border border-white/10 shadow-2xl w-full max-w-xs mx-4 p-6"
              style={{ backgroundColor: "#1E293B" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-semibold mb-2">Delete Zone?</h3>
              <p className="text-[#94A3B8] text-sm mb-6">This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-xl border border-white/10 text-[#94A3B8] text-sm">
                  Cancel
                </button>
                <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-sm font-semibold">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
