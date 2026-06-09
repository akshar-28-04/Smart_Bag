"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MiniMapProps {
  center: [number, number];
  zoom?: number;
  markerColor?: string;
  markerEmoji?: string;
}

export default function MiniMap({ center, zoom = 15, markerColor = "#EF4444", markerEmoji = "📍" }: MiniMapProps) {
  const icon = L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${markerColor};border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.5);animation:pulse 2s infinite;">
      ${markerEmoji}
    </div>
    <style>@keyframes pulse{0%,100%{box-shadow:0 0 0 0 ${markerColor}88}50%{box-shadow:0 0 0 12px transparent}}</style>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20],
  });

  return (
    <MapContainer center={center} zoom={zoom} style={{ width: "100%", height: "100%" }} zoomControl={false} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      <Marker position={center} icon={icon}>
        <Popup>
          <div style={{ color: "#F8FAFC" }}>
            <b>Last Known Location</b>
            <br />
            <span style={{ color: "#94A3B8", fontSize: 12 }}>{center[0].toFixed(4)}, {center[1].toFixed(4)}</span>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
