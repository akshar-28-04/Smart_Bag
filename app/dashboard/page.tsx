"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Clock, Shield, CheckCircle, Navigation,
  AlertTriangle, Wifi, TrendingUp, Bell, ArrowRight, Zap,
  Satellite, Signal,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

function KpiCard({
  icon: Icon, label, value, sub, color, delay, href,
}: {
  icon: React.ElementType; label: string; value: string; sub: string;
  color: string; delay?: number; href?: string;
}) {
  const card = (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {href && <ArrowRight className="w-4 h-4 text-[#475569]" />}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-[#94A3B8] text-xs font-medium mb-1">{label}</div>
      <div className="text-[#475569] text-xs">{sub}</div>
    </motion.div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

function DeviceStatusCard() {
  const { gpsFix, satellites, speed, gpsStatus, lastUpdate, mqttConnected, connectionStatus } = useSmartBag();

  const metrics = [
    { label: "GPS Status", value: gpsFix ? "FIXED" : "No Fix", color: gpsFix ? "#22C55E" : "#EF4444", icon: MapPin },
    { label: "Satellites", value: `${satellites}`, color: satellites > 4 ? "#22C55E" : "#F59E0B", icon: Satellite },
    { label: "Speed", value: `${speed.toFixed(1)} km/h`, color: "#0EA5E9", icon: TrendingUp },
    { label: "Connection", value: mqttConnected ? "Online" : "Offline", color: mqttConnected ? "#22C55E" : "#EF4444", icon: Signal },
  ];

  return (
    <motion.div {...fadeUp(0.5)} className="glass rounded-2xl p-6 border border-white/5 col-span-1 md:col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Device Status</h3>
          <p className="text-[#64748B] text-xs mt-0.5">{lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString("en-IN")}` : "Waiting for data"}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${connectionStatus === "connected" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
          {connectionStatus === "connected" ? "Live" : "Disconnected"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[#0F172A] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="w-4 h-4" style={{ color: m.color }} />
              <span className="text-[#64748B] text-xs">{m.label}</span>
            </div>
            <div className="text-white text-sm font-bold">{m.value}</div>
            <div className="w-full h-1 bg-[#1E293B] rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: m.label === "Speed" ? `${Math.min(speed * 5, 100)}%` : mqttConnected ? "100%" : "0%" }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full"
                style={{ backgroundColor: m.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TripStats() {
  const { distanceTravelled, averageSpeed, maxSpeed, journeyDuration, gpsHistory } = useSmartBag();

  const stats = [
    { label: "Distance", value: `${distanceTravelled.toFixed(2)} km`, color: "#2563EB", icon: TrendingUp },
    { label: "Avg Speed", value: `${averageSpeed.toFixed(1)} km/h`, color: "#0EA5E9", icon: TrendingUp },
    { label: "Max Speed", value: `${maxSpeed.toFixed(1)} km/h`, color: "#F59E0B", icon: Zap },
    { label: "Duration", value: `${Math.round(journeyDuration)} min`, color: "#A855F7", icon: Clock },
  ];

  return (
    <motion.div {...fadeUp(0.6)} className="glass rounded-2xl p-6 border border-white/5">
      <h3 className="text-white font-semibold mb-1">Trip Stats</h3>
      <p className="text-[#64748B] text-xs mb-4">{gpsHistory.length} data points collected</p>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-[#64748B] text-xs">{s.label}</span>
            </div>
            <div className="text-white text-lg font-bold">{s.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RecentAlerts() {
  const { sosActive, connectionStatus } = useSmartBag();
  const alerts: { id: string; title: string; message: string; severity: "danger" | "success" | "info"; timestamp: Date }[] = [];

  if (sosActive) {
    alerts.push({ id: "sos-live", title: "SOS Alert Active", message: "Emergency SOS has been triggered!", severity: "danger", timestamp: new Date() });
  }
  if (connectionStatus === "connected") {
    alerts.push({ id: "conn-online", title: "Device Online", message: "SmartBag is connected and transmitting.", severity: "success", timestamp: new Date() });
  }
  if (connectionStatus === "disconnected") {
    alerts.push({ id: "conn-offline", title: "Device Offline", message: "SmartBag connection lost. Retrying...", severity: "info", timestamp: new Date() });
  }

  const severityColor: Record<string, string> = {
    success: "#22C55E", info: "#0EA5E9", warning: "#F59E0B", danger: "#EF4444",
  };

  if (alerts.length === 0) {
    alerts.push({ id: "no-data", title: "No Alerts", message: "Waiting for device data...", severity: "info", timestamp: new Date() });
  }

  return (
    <motion.div {...fadeUp(0.7)} className="glass rounded-2xl p-6 border border-white/5 col-span-1 md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Status</h3>
          <p className="text-[#64748B] text-xs mt-0.5">Live connection updates</p>
        </div>
        <Link href="/dashboard/alerts" className="text-[#2563EB] text-xs hover:text-[#0EA5E9] transition-colors flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {alerts.slice(0, 4).map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#0F172A]">
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: severityColor[alert.severity] }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className="text-white text-sm font-medium">{alert.title}</span>
              </div>
              <div className="text-[#64748B] text-xs mt-0.5 truncate">{alert.message}</div>
              <div className="text-[#475569] text-xs mt-1">
                {alert.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function DashboardHome() {
  const {
    currentPosition, speed, gpsStatus, gpsFix, lastUpdate,
    distanceTravelled, mqttConnected, sosActive, connectionStatus,
  } = useSmartBag();

  const kpis = [
    {
      icon: MapPin, label: "Current Location", color: "#2563EB",
      value: currentPosition ? `${currentPosition[0].toFixed(4)}, ${currentPosition[1].toFixed(4)}` : "No fix",
      sub: gpsFix ? `GPS ${gpsStatus}` : "Acquiring...",
      href: "/dashboard/live-tracking", delay: 0.1,
    },
    {
      icon: Signal, label: "Connection", color: mqttConnected ? "#22C55E" : "#EF4444",
      value: mqttConnected ? "Online" : "Offline",
      sub: mqttConnected ? "Receiving data" : "Retrying...",
      delay: 0.15,
    },
    {
      icon: Clock, label: "Last Update", color: "#0EA5E9",
      value: lastUpdate ? lastUpdate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--",
      sub: lastUpdate ? `${Math.round((Date.now() - lastUpdate.getTime()) / 1000)}s ago` : "Waiting...",
      delay: 0.2,
    },
    {
      icon: Navigation, label: "Speed", color: "#22C55E",
      value: `${speed.toFixed(1)} km/h`,
      sub: gpsFix ? "Tracking active" : "No GPS fix",
      href: "/dashboard/live-tracking", delay: 0.25,
    },
    {
      icon: Shield, label: "Safety Status", color: sosActive ? "#EF4444" : "#22C55E",
      value: sosActive ? "SOS ACTIVE" : "✓ Safe",
      sub: sosActive ? "Emergency!" : "Normal operation",
      delay: 0.3,
    },
    {
      icon: TrendingUp, label: "Trip Distance", color: "#A855F7",
      value: `${distanceTravelled.toFixed(2)} km`,
      sub: `${Math.round(distanceTravelled * 100) / 100} km travelled`,
      delay: 0.35,
    },
    {
      icon: Wifi, label: "MQTT Status", color: connectionStatus === "connected" ? "#22C55E" : connectionStatus === "connecting" ? "#F59E0B" : "#EF4444",
      value: connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1),
      sub: connectionStatus === "connected" ? "Data streaming" : "Retry every 5s",
      href: "/dashboard/device-health", delay: 0.4,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <motion.div
        {...fadeUp(0)}
        className="glass rounded-2xl p-5 border border-[#2563EB]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            SB
          </div>
          <div>
            <div className="text-white font-bold text-lg">SmartBag</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${mqttConnected ? "bg-[#22C55E] animate-pulse" : "bg-[#EF4444]"}`} />
              <span className={`text-sm font-medium ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {mqttConnected ? "Online" : "Offline"}
              </span>
              {sosActive && (
                <span className="text-[#EF4444] text-sm font-bold animate-pulse">• SOS ACTIVE</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/live-tracking"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            <MapPin className="w-4 h-4" /> Live Track
          </Link>
          <Link href="/dashboard/sos"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] text-sm font-semibold hover:bg-[#EF4444]/30 transition-colors">
            <AlertTriangle className="w-4 h-4" /> SOS
          </Link>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DeviceStatusCard />
        <TripStats />
        <RecentAlerts />
      </div>

      {/* Quick actions */}
      <motion.div {...fadeUp(0.8)} className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/dashboard/live-tracking", icon: MapPin,       label: "Track Now",    color: "#2563EB" },
            { href: "/dashboard/safe-zones",    icon: Shield,       label: "Safe Zones",   color: "#22C55E" },
            { href: "/dashboard/alerts",        icon: Bell,         label: "Alerts",       color: "#F59E0B" },
            { href: "/dashboard/analytics",     icon: Zap,          label: "Analytics",    color: "#A855F7" },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0F172A] hover:bg-[#0a0f1a] transition-colors group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${a.color}15` }}>
                <a.icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: a.color }} />
              </div>
              <span className="text-[#94A3B8] text-xs font-medium group-hover:text-white transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
