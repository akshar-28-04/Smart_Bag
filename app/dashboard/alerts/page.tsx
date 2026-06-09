"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle, AlertTriangle, AlertOctagon, Wifi, Battery,
  MapPin, Filter, Check, Clock,
} from "lucide-react";
import { DEMO_ALERTS } from "@/lib/demo-data";
import type { Alert, AlertSeverity, AlertType } from "@/lib/types";

const TYPE_CONFIG: Record<AlertType, { icon: React.ElementType; label: string }> = {
  entered_school:  { icon: CheckCircle,   label: "Arrived School" },
  left_school:     { icon: MapPin,        label: "Left School" },
  sos:             { icon: AlertOctagon,  label: "SOS" },
  route_deviation: { icon: AlertTriangle, label: "Route Deviation" },
  device_offline:  { icon: Wifi,          label: "Device Offline" },
  low_battery:     { icon: Battery,       label: "Low Battery" },
  entered_home:    { icon: CheckCircle,   label: "Arrived Home" },
  left_home:       { icon: MapPin,        label: "Left Home" },
  geofence_exit:   { icon: AlertTriangle, label: "Zone Exit" },
  geofence_enter:  { icon: CheckCircle,   label: "Zone Entry" },
  arrived_tuition: { icon: CheckCircle,   label: "Arrived Tuition" },
  left_tuition:    { icon: MapPin,        label: "Left Tuition" },
};

const SEVERITY_STYLE: Record<AlertSeverity, { bg: string; border: string; dot: string; badge: string }> = {
  success: { bg: "#22C55E15", border: "#22C55E30", dot: "#22C55E", badge: "bg-[#22C55E]/10 text-[#22C55E]" },
  info:    { bg: "#0EA5E915", border: "#0EA5E930", dot: "#0EA5E9", badge: "bg-[#0EA5E9]/10 text-[#0EA5E9]" },
  warning: { bg: "#F59E0B15", border: "#F59E0B30", dot: "#F59E0B", badge: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  danger:  { bg: "#EF444415", border: "#EF444430", dot: "#EF4444", badge: "bg-[#EF4444]/10 text-[#EF4444]" },
};

const FILTERS = ["All", "Success", "Warning", "Danger", "Info"] as const;
type FilterType = (typeof FILTERS)[number];

function AlertCard({ alert, index }: { alert: Alert; index: number }) {
  const cfg = TYPE_CONFIG[alert.type];
  const sty = SEVERITY_STYLE[alert.severity];
  const Icon = cfg.icon;
  const dt = new Date(alert.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex gap-4 group"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border"
          style={{ backgroundColor: sty.bg, borderColor: sty.border }}
        >
          <Icon className="w-4 h-4" style={{ color: sty.dot }} />
        </div>
        <div className="w-px flex-1 bg-white/5 mt-2 mb-1" />
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl p-4 mb-4 border transition-all group-hover:border-white/10"
        style={{ backgroundColor: sty.bg, borderColor: sty.border }}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold text-sm">{alert.title}</span>
              {!alert.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sty.badge}`}>
                {cfg.label}
              </span>
            </div>
            <p className="text-[#94A3B8] text-xs mt-1.5 leading-relaxed">{alert.message}</p>
            {alert.location && (
              <div className="flex items-center gap-1.5 mt-2">
                <MapPin className="w-3 h-3 text-[#475569]" />
                <span className="text-[#475569] text-xs">{alert.location}</span>
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 text-[#475569] text-xs">
              <Clock className="w-3 h-3" />
              {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-[#334155] text-xs mt-0.5">
              {dt.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
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

  const filtered = DEMO_ALERTS.filter((a) => {
    if (showUnreadOnly && a.isRead) return false;
    if (filter === "All") return true;
    return a.severity === filter.toLowerCase();
  });

  const unread = DEMO_ALERTS.filter((a) => !a.isRead).length;

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
            {DEMO_ALERTS.length} total alerts
            {unread > 0 && <span className="text-[#EF4444] ml-2">• {unread} unread</span>}
          </p>
        </div>
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
            showUnreadOnly
              ? "bg-[#2563EB] border-[#2563EB] text-white"
              : "glass border-white/10 text-[#94A3B8] hover:text-white"
          }`}
        >
          <Filter className="w-4 h-4" />
          Unread Only
        </button>
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
                {DEMO_ALERTS.length}
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
            filtered.map((alert, i) => (
              <AlertCard key={alert.id} alert={alert} index={i} />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
