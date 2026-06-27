"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  MapContainer, TileLayer, Circle, Marker, Popup, useMap,
  useMapEvents, Polyline, ZoomControl,
} from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Shield, Plus, MapPin, CheckCircle, XCircle, Edit2, Trash2,
  Save, Eye, EyeOff, Crosshair, Maximize2,
} from "lucide-react";
import { useFirebase } from "@/hooks/useFirebase";
import { pushAlert } from "@/services/firebase";
import type { FirebaseSafeZone } from "@/types/firebase";

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
    iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -22],
  });
}

function createZoneIcon(color: string, emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:34px;height:34px;border-radius:50%;background:${color};border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);font-size:14px;">${emoji}</div>`,
    iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -20],
  });
}

function createCreationIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.5);font-size:16px;animation:pulse 1.5s ease-in-out infinite;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><circle cx="12" cy="12" r="3"/></svg>
    </div>
    <style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}</style>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -18],
  });
}

const ZONE_EMOJIS: Record<string, string> = { home: "🏠", school: "🏫", tuition: "📚", custom: "📍" };
const ZONE_COLORS = ["#22C55E", "#2563EB", "#0EA5E9", "#F59E0B", "#A855F7", "#EF4444", "#EC4899"];
const PRESET_RADII = [50, 100, 150, 200, 300, 500];
const DEFAULT_CENTER: [number, number] = [12.975, 77.597];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

          {zone.description && (
            <p className="text-[#475569] text-xs mt-2 truncate">{zone.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MapClickHandler({ onMapClick, active }: { onMapClick: (lat: number, lng: number) => void; active: boolean }) {
  useMapEvents({
    click(e) {
      if (active) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FirstCenterController({ position }: { position: [number, number] | null }) {
  const map = useMap();
  const centered = useRef(false);

  useEffect(() => {
    if (position && !centered.current) {
      map.setView(position, 16);
      centered.current = true;
    }
  }, [position, map]);

  return null;
}

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const el = document.getElementById("safe-zones-map-area");
    if (!el) return;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(el);

    // Also handle sidebar collapse transitions
    const sidebarEl = document.getElementById("safe-zones-map-container");
    if (sidebarEl) {
      const sidebarObserver = new MutationObserver(() => {
        setTimeout(() => map.invalidateSize(), 300);
      });
      sidebarObserver.observe(sidebarEl, { attributes: true, attributeFilter: ["style", "class"] });
      return () => {
        observer.disconnect();
        sidebarObserver.disconnect();
      };
    }

    return () => observer.disconnect();
  }, [map]);

  return null;
}

function LocateButton({ position }: { position: [number, number] | null }) {
  const map = useMap();

  return (
    <button
      onClick={() => position && map.setView(position, 16)}
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
          document.getElementById("safe-zones-map-container")?.requestFullscreen();
          setFs(true);
        } else {
          document.exitFullscreen();
          setFs(false);
        }
      }}
      className="absolute top-[116px] right-4 z-[1000] w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
      title="Fullscreen"
    >
      <Maximize2 className="w-4 h-4" />
    </button>
  );
}

function CreationPreview({
  center, radius, color, onDrag,
}: {
  center: [number, number]; radius: number; color: string;
  onDrag: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const pos = marker.getLatLng();
        onDrag(pos.lat, pos.lng);
      }
    },
  }), [onDrag]);

  return (
    <>
      <Circle
        center={center}
        radius={radius}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 2,
          dashArray: "6 4",
        }}
      />
      <Marker
        ref={markerRef}
        position={center}
        draggable={true}
        eventHandlers={eventHandlers}
        icon={createCreationIcon(color)}
      >
        <Popup>
          <div style={{ color: "#F8FAFC", fontSize: 13 }}>
            Drag to adjust position<br />
            <span style={{ color: "#94A3B8", fontSize: 11 }}>Radius: {radius}m</span>
          </div>
        </Popup>
      </Marker>
    </>
  );
}

function ZoneStatusBanner({ currentZone }: { currentZone: FirebaseSafeZone | null }) {
  if (!currentZone) {
    return (
      <div className="bg-[#0F172A] rounded-2xl p-4 border border-[#EF4444]/20 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Outside Safe Zone</div>
            <div className="text-[#94A3B8] text-[10px]">No active zone detected</div>
          </div>
        </div>
      </div>
    );
  }

  const emoji = ZONE_EMOJIS[currentZone.type] ?? ZONE_EMOJIS.custom;

  return (
    <div
      className="rounded-2xl p-4 border mb-3"
      style={{
        backgroundColor: `${currentZone.color}10`,
        borderColor: `${currentZone.color}30`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${currentZone.color}20` }}
        >
          {emoji}
        </div>
        <div>
          <div className="text-white text-sm font-semibold flex items-center gap-2">
            Inside {currentZone.name}
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          </div>
          <div className="text-[#94A3B8] text-[10px]">{currentZone.radius}m radius</div>
        </div>
      </div>
    </div>
  );
}

export default function SafeZonesMap() {
  const { safeZones, addSafeZone, updateSafeZone, deleteSafeZone, childCurrent, historyPoints } = useFirebase();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [creationPos, setCreationPos] = useState<[number, number] | null>(null);
  const [creationRadius, setCreationRadius] = useState(150);
  const [creationColor, setCreationColor] = useState(ZONE_COLORS[0]);
  const [creationName, setCreationName] = useState("");
  const [creationDescription, setCreationDescription] = useState("");
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const prevZoneIdRef = useRef<string | null>(null);

  const activeCount = safeZones.filter((z) => z.isActive).length;

  const livePosition: [number, number] | null = useMemo(() => {
    if (childCurrent?.latitude != null && childCurrent?.longitude != null) {
      return [childCurrent.latitude, childCurrent.longitude];
    }
    if (historyPoints.length > 0) {
      const latest = historyPoints[historyPoints.length - 1];
      if (latest?.latitude != null && latest?.longitude != null) {
        return [latest.latitude, latest.longitude];
      }
    }
    return null;
  }, [childCurrent, historyPoints]);

  const routePoints: [number, number][] = useMemo(() => {
    return historyPoints
      .filter((p) => p.latitude != null && p.longitude != null)
      .map((p) => [p.latitude, p.longitude] as [number, number]);
  }, [historyPoints]);

  const currentZone = useMemo(() => {
    if (!childCurrent?.latitude || !childCurrent?.longitude) return null;
    const { latitude, longitude } = childCurrent;
    for (const zone of safeZones) {
      if (!zone.isActive) continue;
      const dist = getDistance(latitude, longitude, zone.lat, zone.lng);
      if (dist <= zone.radius) return zone;
    }
    return null;
  }, [childCurrent, safeZones]);

  useEffect(() => {
    const currentId = currentZone?.id ?? null;
    const prevId = prevZoneIdRef.current;

    if (currentId !== prevId) {
      if (currentId && currentZone) {
        pushAlert({
          type: "zone_entry",
          title: "Zone Entry",
          description: `Entered ${currentZone.name}`,
          severity: "success",
          timestamp: Date.now(),
        });
      }
      if (prevId) {
        const prevZone = safeZones.find((z) => z.id === prevId);
        if (prevZone) {
          pushAlert({
            type: "zone_exit",
            title: "Zone Exit",
            description: `Exited ${prevZone.name}`,
            severity: "warning",
            timestamp: Date.now(),
          });
        }
      }
      prevZoneIdRef.current = currentId;
    }
  }, [currentZone, safeZones]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (selecting && !creationPos) {
      setCreationPos([lat, lng]);
      setCreationRadius(150);
      setCreationColor(ZONE_COLORS[0]);
      setCreationName("");
      setCreationDescription("");
    }
  }, [selecting, creationPos]);

  const handleCreationDrag = useCallback((lat: number, lng: number) => {
    setCreationPos([lat, lng]);
  }, []);

  const handleSaveZone = useCallback(() => {
    if (!creationPos) return;
    const [lat, lng] = creationPos;

    if (editingZoneId) {
      const updates: Partial<FirebaseSafeZone> = {
        name: creationName,
        lat, lng,
        radius: creationRadius,
        color: creationColor,
      };
      if (creationDescription) updates.description = creationDescription;
      updateSafeZone(editingZoneId, updates);
    } else {
      const zone: Omit<FirebaseSafeZone, "id"> = {
        name: creationName || "New Zone",
        type: "custom",
        lat, lng,
        radius: creationRadius,
        color: creationColor,
        isActive: true,
        createdAt: Date.now(),
      };
      if (creationDescription) zone.description = creationDescription;
      addSafeZone(zone);
    }

    setCreationPos(null);
    setSelecting(false);
    setEditingZoneId(null);
  }, [creationPos, creationName, creationRadius, creationColor, creationDescription, editingZoneId, addSafeZone, updateSafeZone]);

  const handleCancel = useCallback(() => {
    setCreationPos(null);
    setSelecting(false);
    setEditingZoneId(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteSafeZone(id);
    setConfirmDelete(null);
    setSelectedZone(null);
  }, [deleteSafeZone]);

  const handleToggle = useCallback((id: string, current: boolean) => {
    updateSafeZone(id, { isActive: !current });
  }, [updateSafeZone]);

  const handleEdit = useCallback((zone: FirebaseSafeZone) => {
    setCreationPos([zone.lat, zone.lng]);
    setCreationRadius(zone.radius);
    setCreationColor(zone.color);
    setCreationName(zone.name);
    setCreationDescription(zone.description ?? "");
    setEditingZoneId(zone.id ?? null);
    setSelecting(true);
  }, []);

  return (
    <div id="safe-zones-map-container" className="h-full flex flex-col lg:flex-row relative">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-[#1E293B] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col overflow-hidden order-2 lg:order-1 shrink-0">
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
          {selecting && creationPos ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">
                  {editingZoneId ? "Edit Safe Zone" : "Create Safe Zone"}
                </h3>
              </div>
              <div>
                <label className="text-[#94A3B8] text-xs mb-1 block">Zone Name</label>
                <input
                  value={creationName}
                  onChange={(e) => setCreationName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2563EB]"
                  placeholder="e.g. Home, School"
                />
              </div>
              <div>
                <label className="text-[#94A3B8] text-xs mb-1 block">Radius ({creationRadius}m)</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_RADII.map((r) => (
                    <button
                      key={r}
                      onClick={() => setCreationRadius(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                        creationRadius === r
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
                  value={creationRadius}
                  onChange={(e) => setCreationRadius(Number(e.target.value))}
                  className="w-full mt-2 accent-[#2563EB]"
                />
              </div>
              <div>
                <label className="text-[#94A3B8] text-xs mb-1 block">Color</label>
                <div className="flex gap-2">
                  {ZONE_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCreationColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        creationColor === c ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[#94A3B8] text-xs mb-1 block">Description (optional)</label>
                <input
                  value={creationDescription}
                  onChange={(e) => setCreationDescription(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2563EB]"
                  placeholder="e.g. Near the park entrance"
                />
              </div>
              <div className="bg-[#0F172A] rounded-xl p-3">
                <div className="text-[#475569] text-xs mb-1">Position</div>
                <div className="text-white text-xs font-mono">
                  {creationPos[0].toFixed(6)}, {creationPos[1].toFixed(6)}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-[#94A3B8] text-sm hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveZone}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Save className="w-4 h-4" /> {editingZoneId ? "Update" : "Save Zone"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {childCurrent && <ZoneStatusBanner currentZone={currentZone} />}

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
                    onEdit={() => handleEdit(zone)}
                  />
                  );
                }))}
            </>
          )}
        </div>

        <div className="p-4 border-t border-white/5">
          {selecting ? (
            !creationPos && (
              <>
                <p className="text-[#F59E0B] text-xs flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" /> Click anywhere on the map to place the zone center
                </p>
                <button
                  onClick={handleCancel}
                  className="w-full py-2 rounded-xl border border-white/10 text-[#94A3B8] text-sm hover:bg-white/5"
                >
                  Cancel
                </button>
              </>
            )
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
      <div id="safe-zones-map-area" className="flex-1 relative order-1 lg:order-2 min-h-[50vh] lg:min-h-0">
        <MapContainer
          center={livePosition ?? DEFAULT_CENTER}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          <ZoomControl position="topright" />
          <MapClickHandler onMapClick={handleMapClick} active={selecting && !creationPos} />
          <FirstCenterController position={livePosition} />

          {/* Child location marker */}
          {livePosition && (
            <>
              <Circle
                center={livePosition}
                radius={childCurrent?.gpsFix ? 10 : 30}
                pathOptions={{
                  color: "#0EA5E9",
                  fillColor: "#0EA5E9",
                  fillOpacity: 0.08,
                  weight: 1,
                }}
              />
              <Marker position={livePosition} icon={createChildIcon()}>
                <Popup>
                  <div style={{ color: "#F8FAFC", minWidth: 160 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>🎒 Live Location</div>
                    <div style={{ color: "#94A3B8", fontSize: 12 }}>
                      {livePosition[0].toFixed(6)}, {livePosition[1].toFixed(6)}
                    </div>
                    {childCurrent?.speed != null && (
                      <div style={{ color: "#94A3B8", fontSize: 12 }}>
                        Speed: {childCurrent.speed.toFixed(1)} km/h
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Route polyline */}
          {routePoints.length > 1 && (
            <Polyline
              positions={routePoints}
              pathOptions={{ color: "#2563EB", weight: 3, opacity: 0.5, dashArray: "8 4" }}
            />
          )}

          {/* Safe zone circles */}
          {safeZones.map((zone) => (
            <div key={zone.id}>
              <Circle
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: zone.isActive
                    ? (selectedZone === zone.id ? 0.2 : 0.1)
                    : 0.03,
                  weight: zone.isActive ? (selectedZone === zone.id ? 3 : 2) : 1,
                  dashArray: zone.isActive ? "6 4" : "4 4",
                  opacity: zone.isActive ? 1 : 0.4,
                }}
              />
              <Marker
                position={[zone.lat, zone.lng]}
                icon={createZoneIcon(zone.color, ZONE_EMOJIS[zone.type] ?? ZONE_EMOJIS.custom)}
              >
                <Popup>
                  <div style={{ color: "#F8FAFC", minWidth: 180 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{zone.name}</div>
                    <div style={{ color: "#94A3B8", fontSize: 12 }}>Radius: {zone.radius}m</div>
                    {zone.description && (
                      <div style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>{zone.description}</div>
                    )}
                    <div style={{ color: zone.isActive ? "#22C55E" : "#EF4444", fontSize: 12, marginTop: 2 }}>
                      {zone.isActive ? "Active" : "Inactive"}
                    </div>
                    {currentZone?.id === zone.id && (
                      <div style={{ color: "#22C55E", fontSize: 11, marginTop: 2 }}>
                        ● Currently inside this zone
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}

          {/* Creation preview */}
          {selecting && creationPos && (
            <CreationPreview
              center={creationPos}
              radius={creationRadius}
              color={creationColor}
              onDrag={handleCreationDrag}
            />
          )}

          <MapResizeHandler />
          <LocateButton position={livePosition} />
          <FullscreenButton />
        </MapContainer>

        {/* Legend */}
        {safeZones.length > 0 && (
          <div className="absolute top-4 left-4 md:right-4 md:left-auto rounded-2xl p-3 sm:p-4 border border-white/10 shadow-lg"
            style={{ backgroundColor: "#1E293B" }}>
            <div className="text-white text-xs font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-3 h-3 text-[#2563EB]" /> Zone Legend
            </div>
            {safeZones.filter((z) => z.isActive).map((z) => (
              <div key={z.id} className="flex items-center gap-2 mb-2 last:mb-0">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
                <span className="text-[#94A3B8] text-xs">{z.name}</span>
                {currentZone?.id === z.id && (
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile creation bottom sheet */}
      <AnimatePresence>
        {selecting && creationPos && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[200] rounded-t-2xl border-t border-white/10 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "#1E293B" }}
          >
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">
                  {editingZoneId ? "Edit Safe Zone" : "Create Safe Zone"}
                </h3>
                <button
                  onClick={() => { setSelecting(false); setCreationPos(null); setEditingZoneId(null); }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="text-[#64748B] text-xs block mb-1">Zone Name</label>
                <input
                  value={creationName}
                  onChange={(e) => setCreationName(e.target.value)}
                  placeholder="e.g. Home, School"
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm min-h-[44px]"
                />
              </div>

              {/* Radius */}
              <div>
                <label className="text-[#64748B] text-xs block mb-1">Radius: {creationRadius}m</label>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {PRESET_RADII.map((r) => (
                    <button
                      key={r}
                      onClick={() => setCreationRadius(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] ${creationRadius === r ? "bg-[#2563EB] text-white" : "bg-[#0F172A] text-[#94A3B8] border border-white/10"}`}
                    >
                      {r}m
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  value={creationRadius}
                  onChange={(e) => setCreationRadius(Number(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-[#64748B] text-xs block mb-1">Zone Color</label>
                <div className="flex gap-2 flex-wrap">
                  {ZONE_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCreationColor(c)}
                      className="w-9 h-9 min-w-[36px] rounded-full border-2 transition-all"
                      style={{
                        backgroundColor: c,
                        borderColor: creationColor === c ? "#fff" : "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[#64748B] text-xs block mb-1">Description (optional)</label>
                <textarea
                  value={creationDescription}
                  onChange={(e) => setCreationDescription(e.target.value)}
                  placeholder="Add a note about this zone..."
                  rows={2}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm resize-none min-h-[44px]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setSelecting(false); setCreationPos(null); setEditingZoneId(null); setCreationName(""); setCreationDescription(""); setCreationRadius(100); setCreationColor("#2563EB"); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-[#94A3B8] text-sm font-medium min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveZone}
                  disabled={!creationName.trim() || !creationPos}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold min-h-[44px] disabled:opacity-40"
                >
                  {editingZoneId ? "Update Zone" : "Save Zone"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
