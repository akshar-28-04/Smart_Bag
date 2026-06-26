"use client";
import { motion } from "framer-motion";
import {
  Wifi, MapPin, Clock, Cpu, TrendingUp, Shield,
  CheckCircle, XCircle, Satellite, Signal,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";
import { useFirebase } from "@/hooks/useFirebase";

function StatusRow({
  icon: Icon, label, value, status, color, delay,
}: {
  icon: React.ElementType; label: string; value: string;
  status: "good" | "warn" | "bad"; color: string; delay: number;
}) {
  const statusColors = { good: "#22C55E", warn: "#F59E0B", bad: "#EF4444" };
  const statusLabels = { good: "Nominal", warn: "Warning", bad: "Critical" };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
      style={{ backgroundColor: "#0F172A" }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[#94A3B8] text-xs mb-0.5">{label}</div>
        <div className="text-white font-semibold text-sm">{value}</div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[status] }} />
        <span className="text-xs font-medium" style={{ color: statusColors[status] }}>
          {statusLabels[status]}
        </span>
      </div>
    </motion.div>
  );
}

function SatelliteBars({ count }: { count: number }) {
  return (
    <div className="flex items-end gap-1 h-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-2 rounded-sm transition-all"
          style={{
            height: `${16 + Math.random() * 24}px`,
            backgroundColor: i < count ? "#0EA5E9" : "#1E293B",
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "#0F172A" }}>
      <div className="text-[#64748B] text-xs mb-1">{label}</div>
      <div className="text-white font-bold text-lg" style={{ color }}>{value}</div>
    </div>
  );
}

export default function DeviceHealthPage() {
  const {
    gpsFix, satellites, speed, gpsStatus, lastUpdate,
    mqttConnected, connectionStatus, sosActive, currentPosition,
  } = useSmartBag();
  const { device } = useFirebase();

  const heartbeatSeconds = lastUpdate
    ? Math.round((Date.now() - lastUpdate.getTime()) / 1000)
    : null;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-white font-bold text-xl">Device Health</h2>
        <p className="text-[#64748B] text-sm mt-0.5">SmartBag — Real-time diagnostics</p>
      </motion.div>

      {/* Online banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`flex items-center justify-between p-5 rounded-2xl border ${
          mqttConnected ? "border-[#22C55E]/20" : "border-[#EF4444]/20"
        }`}
        style={{ backgroundColor: "#0F172A" }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              mqttConnected
                ? "bg-gradient-to-br from-[#22C55E]/20 to-[#0EA5E9]/20"
                : "bg-gradient-to-br from-[#EF4444]/20 to-[#F59E0B]/20"
            }`}>
              <Shield className={`w-7 h-7 ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`} />
            </div>
            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0F172A] ${
              mqttConnected ? "bg-[#22C55E]" : "bg-[#EF4444]"
            }`} />
          </div>
          <div>
            <div className="text-white font-bold text-lg">SmartBag — IoT Device</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${mqttConnected ? "bg-[#22C55E] animate-pulse" : "bg-[#EF4444]"}`} />
              <span className={`text-sm font-medium ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {mqttConnected ? "Online & Transmitting" : "Disconnected"}
              </span>
              <span className="text-[#475569] text-sm">
                • {heartbeatSeconds !== null ? `${heartbeatSeconds}s ago` : "No data"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <StatCard label="GPS Status" value={gpsFix ? "Fixed" : "No Fix"} color={gpsFix ? "#22C55E" : "#EF4444"} />
        <StatCard label="Satellites" value={`${satellites}`} color={satellites > 4 ? "#22C55E" : "#F59E0B"} />
        <StatCard label="Speed" value={`${speed.toFixed(1)} km/h`} color="#0EA5E9" />
        <StatCard label="MQTT" value={mqttConnected ? "Connected" : "Disconnected"} color={mqttConnected ? "#22C55E" : "#EF4444"} />
        <StatCard label="GPS Coordinates" value={currentPosition ? `${currentPosition[0].toFixed(4)}, ${currentPosition[1].toFixed(4)}` : "—"} color="#2563EB" />
        <StatCard label="GPS Status Text" value={gpsStatus || "No Signal"} color={gpsFix ? "#22C55E" : "#EF4444"} />
        <StatCard label="Firmware" value={device?.firmware ?? "—"} color="#A855F7" />
        <StatCard label="Restart Reason" value={device?.restartReason ?? "—"} color="#F59E0B" />
        <StatCard label="WiFi RSSI" value={device?.wifiRSSI != null ? `${device.wifiRSSI} dBm` : "—"} color="#22C55E" />
        <StatCard label="MQTT Latency" value={device?.mqttLatency != null ? `${device.mqttLatency} ms` : "—"} color="#0EA5E9" />
        <StatCard label="GPS HDOP" value={device?.gpsHdop != null ? device.gpsHdop.toFixed(1) : "—"} color="#2563EB" />
        <StatCard label="SOS Status" value={sosActive ? "ACTIVE" : "Normal"} color={sosActive ? "#EF4444" : "#22C55E"} />
      </motion.div>

      {/* Satellite visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-6 border border-white/5"
        style={{ backgroundColor: "#0F172A" }}
      >
        <h3 className="text-white font-semibold mb-4">Satellite & GPS Details</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[#64748B] text-xs mb-3">Satellite Lock</div>
            <div className="flex items-center gap-4">
              <SatelliteBars count={satellites} />
              <div>
                <div className="text-white font-bold">{satellites} / 12 Sats</div>
                <div className="text-[#64748B] text-xs">{gpsFix ? "Locked" : "Searching"}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs mb-3">Signal Info</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {mqttConnected ? (
                  <CheckCircle className="w-6 h-6 text-[#22C55E]" />
                ) : (
                  <XCircle className="w-6 h-6 text-[#EF4444]" />
                )}
              </div>
              <div>
                <div className="text-white font-bold">{mqttConnected ? "Link Active" : "No Link"}</div>
                <div className="text-[#64748B] text-xs">
                  Speed: {speed.toFixed(1)} km/h
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status rows */}
      <div className="grid sm:grid-cols-2 gap-3">
        <StatusRow icon={MapPin}   label="GPS Module"      value={`${gpsFix ? "Active — Fixed" : "Searching"} (${satellites} sats)`} status={gpsFix ? "good" : "warn"} color="#2563EB" delay={0.4} />
        <StatusRow icon={Satellite} label="GPS Status"      value={gpsStatus || "No Signal"}                                               status={gpsFix ? "good" : "bad"}  color="#0EA5E9" delay={0.45} />
        <StatusRow icon={Wifi}     label="WiFi Connected"   value={mqttConnected ? "Connected" : "Disconnected"}                           status={mqttConnected ? "good" : "bad"}  color="#22C55E" delay={0.5} />
        <StatusRow icon={Cpu}      label="MQTT Connected"   value={mqttConnected ? "Connected" : "Disconnected"}                           status={mqttConnected ? "good" : "bad"}  color="#A855F7" delay={0.55} />
        <StatusRow icon={TrendingUp} label="Current Speed"  value={`${speed.toFixed(1)} km/h`}                                             status="good" color="#F59E0B" delay={0.6} />
        <StatusRow icon={Shield}   label="SOS Status"       value={sosActive ? "SOS ACTIVE" : "Normal"}                                   status={sosActive ? "bad" : "good"} color="#EF4444" delay={0.65} />
      </div>
    </div>
  );
}
