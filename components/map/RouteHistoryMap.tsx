"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Route, Clock, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { DEMO_ROUTES } from "@/lib/demo-data";
import type { RouteHistory } from "@/lib/types";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ROUTE_COLORS = ["#2563EB", "#0EA5E9", "#22C55E", "#A855F7"];
const TABS = ["Today", "This Week", "This Month"];

function createEndpointIcon(color: string, emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 8px rgba(0,0,0,0.4);font-size:12px;">${emoji}</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16],
  });
}

export default function RouteHistoryMap() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState<RouteHistory>(DEMO_ROUTES[0]);
  const center: [number, number] = [12.975, 77.597];

  const routePoints = selectedRoute.points.map(
    (p) => [p.coords.lat, p.coords.lng] as [number, number]
  );
  const startPt = routePoints[0];
  const endPt = routePoints[routePoints.length - 1];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-[#1E293B] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col overflow-hidden max-h-[45vh] lg:max-h-none">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-white font-bold text-lg mb-1">Route History</h2>
          <p className="text-[#64748B] text-xs mb-4">Historical travel data</p>
          {/* Tab bar */}
          <div className="flex rounded-xl bg-[#0F172A] p-1 gap-1">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === i ? "bg-[#2563EB] text-white" : "text-[#64748B] hover:text-white"
                }`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {DEMO_ROUTES.map((route, i) => (
            <motion.div
              key={route.id}
              whileHover={{ x: 2 }}
              onClick={() => setSelectedRoute(route)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedRoute.id === route.id
                  ? "border-[#2563EB]/50 bg-[#2563EB]/5"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROUTE_COLORS[i % ROUTE_COLORS.length] }} />
                <span className="text-white font-semibold text-sm">{route.label}</span>
                {selectedRoute.id === route.id && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#2563EB]/20 text-[#2563EB]">Selected</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#0F172A] rounded-xl p-2">
                  <TrendingUp className="w-3 h-3 text-[#0EA5E9] mx-auto mb-1" />
                  <div className="text-white text-xs font-bold">{route.distance} km</div>
                  <div className="text-[#475569] text-xs">Distance</div>
                </div>
                <div className="bg-[#0F172A] rounded-xl p-2">
                  <Clock className="w-3 h-3 text-[#A855F7] mx-auto mb-1" />
                  <div className="text-white text-xs font-bold">{route.duration} min</div>
                  <div className="text-[#475569] text-xs">Duration</div>
                </div>
                <div className="bg-[#0F172A] rounded-xl p-2">
                  <Calendar className="w-3 h-3 text-[#F59E0B] mx-auto mb-1" />
                  <div className="text-white text-xs font-bold">{route.startTime}</div>
                  <div className="text-[#475569] text-xs">Start</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[#475569] text-xs">
                <span>{route.startTime}</span>
                <ArrowRight className="w-3 h-3" />
                <span>{route.endTime}</span>
                <span className="ml-auto">{new Date(route.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 border-t border-white/5 glass">
          <div className="text-[#64748B] text-xs mb-2 font-medium">Today's Summary</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0F172A] rounded-xl p-2.5 text-center">
              <div className="text-white font-bold text-sm">2.7 km</div>
              <div className="text-[#475569] text-xs">Total distance</div>
            </div>
            <div className="bg-[#0F172A] rounded-xl p-2.5 text-center">
              <div className="text-white font-bold text-sm">36 min</div>
              <div className="text-[#475569] text-xs">Travel time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer center={center} zoom={15} style={{ width: "100%", height: "100%" }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          {DEMO_ROUTES.map((route, i) => (
            <Polyline
              key={route.id}
              positions={route.points.map((p) => [p.coords.lat, p.coords.lng] as [number, number])}
              pathOptions={{
                color: ROUTE_COLORS[i % ROUTE_COLORS.length],
                weight: selectedRoute.id === route.id ? 5 : 2,
                opacity: selectedRoute.id === route.id ? 1 : 0.3,
                dashArray: selectedRoute.id === route.id ? undefined : "6 6",
              }}
            />
          ))}
          {startPt && (
            <Marker position={startPt} icon={createEndpointIcon("#22C55E", "🟢")}>
              <Popup><div style={{ color: "#F8FAFC" }}>Start: {selectedRoute.startTime}</div></Popup>
            </Marker>
          )}
          {endPt && (
            <Marker position={endPt} icon={createEndpointIcon("#EF4444", "🔴")}>
              <Popup><div style={{ color: "#F8FAFC" }}>End: {selectedRoute.endTime}</div></Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Selected route badge */}
        <div className="absolute top-4 left-4 glass-strong rounded-2xl px-4 py-3 border border-white/10">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-[#2563EB]" />
            <div>
              <div className="text-white text-sm font-semibold">{selectedRoute.label}</div>
              <div className="text-[#64748B] text-xs">{selectedRoute.distance} km • {selectedRoute.duration} min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
