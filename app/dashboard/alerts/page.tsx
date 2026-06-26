"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle, AlertTriangle, AlertOctagon, Wifi, MapPin,
  Filter, Check, Clock,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";
import { DEMO_ALERTS } from "@/lib/demo-data";

const FILTERS = ["All", "Success", "Warning", "Danger", "Info"] as const;
type FilterType = (typeof FILTERS)[number];

const SEVERITY_STYLE: Record<string, { bg: string; border: string; dot: string; badge: string }> = {
  success: { bg: "#22C55E15", border: "#22C55E30", dot: "#22C55E", badge: "bg-[#22C55E]/10 text-[#22C55E]" },
  info:    { bg: "#0EA5E915", border: "#0EA5E930", dot: "#0EA5E9", badge: "bg-[#0EA5E9]/10 text-[#0EA5E9]" },
  warning: { bg: "#F59E0B15", border: "#F59E0B30", dot: "#F59E0B", badge: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  danger:  { bg: "#EF444415", border: "#EF444430", dot: "#EF4444", badge: "bg-[#EF4444]/10 text-[#EF4444]" },
};

function AlertCard({
  id, title, message, severity, timestamp, type,
}: {
  id: string; title: string; message: string; severity: string; timestamp: Date; type: string;
}) {
  const sty = SEVERITY_STYLE[severity] ?? SEVERITY_STYLE.info;
  const dt = new Date(timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 group"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border"
          style={{ backgroundColor: sty.bg, borderColor: sty.border }}
        >
          {severity === "danger" ? (
            <AlertOctagon className="w-4 h-4" style={{ color: sty.dot }} />
          ) : severity === "warning" ? (
            <AlertTriangle className="w-4 h-4" style={{ color: sty.dot }} />
          ) : severity === "success" ? (
            <CheckCircle className="w-4 h-4" style={{ color: sty.dot }} />
          ) : (
            <Bell className="w-4 h-4" style={{ color: sty.dot }} />
          )}
        </div>
        <div className="w-px flex-1 bg-white/5 mt-2 mb-1" />
      </div>

      <div
        className="flex-1 rounded-2xl p-4 mb-4 border transition-all group-hover:border-white/10"
        style={{ backgroundColor: sty.bg, borderColor: sty.border }}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold text-sm">{title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sty.badge}`}>
                {type}
              </span>
            </div>
            <p className="text-[#94A3B8] text-xs mt-1.5 leading-relaxed">{message}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 text-[#475569] text-xs">
              <Clock className="w-3 h-3" />
              {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { sosActive, connectionStatus, mqttConnected, lastUpdate } = useSmartBag();

  const liveAlerts = useMemo(() => {
    const alerts: { id: string; title: string; message: string; severity: string; timestamp: Date; type: string }[] = [];

    const now = new Date();

    if (sosActive) {
      alerts.push({
        id: "sos-live",
        title: "SOS Alert Active",
        message: "Emergency SOS has been triggered! Immediate attention required.",
        severity: "danger",
        timestamp: lastUpdate ?? now,
        type: "SOS",
      });
    }

    if (connectionStatus === "connected") {
      alerts.push({
        id: "conn-online",
        title: "Device Online",
        message: "SmartBag connected and transmitting location data.",
        severity: "success",
        timestamp: now,
        type: "Connection",
      });
    } else if (connectionStatus === "disconnected") {
      alerts.push({
        id: "conn-offline",
        title: "Device Offline",
        message: "SmartBag connection lost. Auto-retrying every 5 seconds.",
        severity: "warning",
        timestamp: now,
        type: "Connection",
      });
    } else if (connectionStatus === "connecting") {
      alerts.push({
        id: "conn-connecting",
        title: "Connecting",
        message: "Establishing connection to SmartBag...",
        severity: "info",
        timestamp: now,
        type: "Connection",
      });
    }

    return alerts;
  }, [sosActive, connectionStatus, lastUpdate]);

  const seedAlerts = useMemo(
    () =>
      DEMO_ALERTS.slice(0, 6).map((a) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        severity: a.severity,
        timestamp: new Date(a.timestamp),
        type: a.type,
      })),
    []
  );

  const allAlerts = useMemo(() => [...liveAlerts, ...seedAlerts], [liveAlerts, seedAlerts]);

  const filtered = useMemo(() => {
    return allAlerts.filter((a) => {
      if (filter === "All") return true;
      return a.severity === filter.toLowerCase();
    });
  }, [allAlerts, filter]);

  const unread = liveAlerts.length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h2 className="text-white font-bold text-xl">Alert Timeline</h2>
          <p className="text-[#64748B] text-sm mt-0.5">
            {allAlerts.length} total
            {unread > 0 && <span className="text-[#EF4444] ml-2">• {unread} active</span>}
          </p>
        </div>
      </motion.div>

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 flex-wrap mb-8"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === f
                ? "bg-[#2563EB] text-white"
                : "glass border border-white/10 text-[#64748B] hover:text-white"
            }`}
          >
            {filter === f && <Check className="w-3 h-3" />}
            {f}
            {f === "All" && (
              <span className="ml-1 bg-white/20 rounded-full px-1.5 py-0.5 text-xs">
                {allAlerts.length}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        <motion.div key={filter + showUnreadOnly}>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-12 h-12 text-[#334155] mx-auto mb-3" />
              <div className="text-[#64748B]">No alerts found</div>
            </div>
          ) : (
            filtered.map((alert) => (
              <AlertCard key={alert.id} {...alert} />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
