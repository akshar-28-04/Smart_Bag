"use client";
import { motion } from "framer-motion";
import {
  Wifi, MapPin, Clock, Cpu, TrendingUp, Shield,
  CheckCircle, XCircle, AlertTriangle, Satellite,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";

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
      className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 hover:border-white/10 transition-all"
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

export default function DeviceHealthPage() {
  const {
    gpsFix, satellites, speed, gpsStatus, lastUpdate,
    mqttConnected, connectionStatus, sosActive, currentPosition,
  } = useSmartBag();

  const heartbeatSeconds = lastUpdate
    ? Math.round((Date.now() - lastUpdate.getTime()) / 1000)
    : null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-white font-bold text-xl">Device Health</h2>
        <p className="text-[#64748B] text-sm mt-0.5">SmartBag — Real-time diagnostics</p>
      </motion.div>

      {/* Online banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`flex items-center justify-between p-5 glass rounded-2xl border ${
          mqttConnected ? "border-[#22C55E]/20" : "border-[#EF4444]/20"
        }`}
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

      {/* Core health indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/5"
      >
        <h3 className="text-white font-semibold mb-4">Core Diagnostics</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* GPS Fix */}
          <div className="bg-[#0F172A] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[#64748B] text-xs font-medium">GPS Fix Status</div>
              {gpsFix ? (
                <span className="flex items-center gap-1.5 text-[#22C55E] text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Fixed
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#EF4444] text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> No Fix
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                gpsFix ? "bg-[#22C55E]/10" : "bg-[#EF4444]/10"
              }`}>
                <MapPin className={`w-6 h-6 ${gpsFix ? "text-[#22C55E]" : "text-[#EF4444]"}`} />
              </div>
              <div>
                <div className="text-white font-bold text-lg">{gpsStatus || "No Signal"}</div>
                <div className="text-[#64748B] text-xs">{gpsFix ? "Lock acquired" : "Acquiring satellites..."}</div>
              </div>
            </div>
          </div>

          {/* MQTT Connection */}
          <div className="bg-[#0F172A] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[#64748B] text-xs font-medium">MQTT Connection</div>
              {mqttConnected ? (
                <span className="flex items-center gap-1.5 text-[#22C55E] text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#EF4444] text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> Disconnected
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                mqttConnected ? "bg-[#22C55E]/10" : "bg-[#EF4444]/10"
              }`}>
                <Wifi className={`w-6 h-6 ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`} />
              </div>
              <div>
                <div className="text-white font-bold text-lg">
                  {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </div>
                <div className="text-[#64748B] text-xs">
                  {mqttConnected ? "Receiving data" : "Retry every 5s"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Satellite visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/5"
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

      {/* Heartbeat visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6 border border-white/5"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0EA5E9]" /> Heartbeat — Last Updates
        </h3>
        <div className="flex items-end gap-2 h-20">
          {[5, 4, 6, 3, 5, 4, 7, 5, 6, 4].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${Math.min(v * 10, 100)}%`,
                  backgroundColor: v <= 6 ? "#22C55E" : "#F59E0B",
                  opacity: 0.5 + (i / 10) * 0.5,
                }}
              />
              <div className="text-[#475569] text-xs">{v}s</div>
            </div>
          ))}
        </div>
        <p className="text-[#475569] text-xs mt-3 text-center">
          Inter-arrival time (seconds) — last 10 messages
        </p>
      </motion.div>
    </div>
  );
}
