"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, Clock, MapPin, Zap, Trash2,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";
import { useFirebase } from "@/hooks/useFirebase";

const CHART_GRID = { stroke: "#1E293B" };
const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#F8FAFC" },
  labelStyle: { color: "#94A3B8" },
  cursor: { fill: "rgba(37,99,235,0.05)" },
};

function SectionCard({ title, sub, icon: Icon, color, children }: {
  title: string; sub: string; icon: React.ElementType; color: string; children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <div className="text-white font-semibold">{title}</div>
          <div className="text-[#64748B] text-xs mt-0.5">{sub}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function SpeedOverTimeChart({ data }: { data: { label: string; speed: number }[] }) {
  if (data.length < 2) {
    return (
      <SectionCard title="Speed Over Time" sub="Requires 2+ data points" icon={TrendingUp} color="#2563EB">
        <div className="h-48 flex items-center justify-center text-[#475569] text-sm">
          Collecting data...
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Speed Over Time" sub="Last 100 GPS samples" icon={TrendingUp} color="#2563EB">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...CHART_GRID} vertical={false} />
          <XAxis dataKey="label" stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} unit=" km/h" />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [`${Number(v).toFixed(1)} km/h`, "Speed"] as [string, string]} />
          <Area type="monotone" dataKey="speed" stroke="#2563EB" strokeWidth={2.5} fill="url(#speedGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}

function CumulativeDistanceChart({ data }: { data: { label: string; distance: number }[] }) {
  if (data.length < 2) {
    return (
      <SectionCard title="Cumulative Distance" sub="Building route..." icon={MapPin} color="#0EA5E9">
        <div className="h-48 flex items-center justify-center text-[#475569] text-sm">
          Collecting data...
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Cumulative Distance" sub="Total distance over time" icon={MapPin} color="#0EA5E9">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid {...CHART_GRID} vertical={false} />
          <XAxis dataKey="label" stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} unit=" km" />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [`${Number(v).toFixed(3)} km`, "Distance"] as [string, string]} />
          <Line type="monotone" dataKey="distance" stroke="#0EA5E9" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}

function StatsPanel() {
  const { distanceTravelled, averageSpeed, maxSpeed, journeyDuration, gpsHistory, currentPosition, speed } = useSmartBag();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl p-6 border border-[#2563EB]/20 col-span-1 md:col-span-2 lg:col-span-3"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#2563EB]" /> Real-Time Journey Analytics
          </h3>
          <p className="text-[#64748B] text-sm mt-1">{gpsHistory.length} data points collected</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          gpsHistory.length > 1 ? "bg-[#22C55E]/10 border-[#22C55E]/20" : "bg-[#F59E0B]/10 border-[#F59E0B]/20"
        }`}>
          <div className={`w-2 h-2 rounded-full ${gpsHistory.length > 1 ? "bg-[#22C55E]" : "bg-[#F59E0B]"}`} />
          <span className={`text-sm font-semibold ${gpsHistory.length > 1 ? "text-[#22C55E]" : "text-[#F59E0B]"}`}>
            {gpsHistory.length > 1 ? "Tracking" : "Starting..."}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Distance", value: `${distanceTravelled.toFixed(2)} km`, color: "#2563EB", icon: TrendingUp },
          { label: "Average Speed", value: `${averageSpeed.toFixed(1)} km/h`, color: "#0EA5E9", icon: TrendingUp },
          { label: "Max Speed", value: `${maxSpeed.toFixed(1)} km/h`, color: "#F59E0B", icon: Zap },
          { label: "Journey Duration", value: `${Math.round(journeyDuration)} min`, color: "#22C55E", icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-[#0F172A] rounded-xl p-4 text-center">
            <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
            <div className="text-white text-xl font-extrabold" style={{ color }}>{value}</div>
            <div className="text-[#475569] text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { gpsHistory, distanceTravelled, averageSpeed, maxSpeed, journeyDuration } = useSmartBag();
  const { clearAnalytics, clearHistory } = useFirebase();
  const [showClear, setShowClear] = useState(false);

  const speedData = gpsHistory.map((p, i) => ({
    label: `#${i + 1}`,
    speed: p.speed,
  }));

  const distanceData = gpsHistory.reduce<{ label: string; distance: number }[]>((acc, p, i) => {
    const prev = i > 0 ? acc[i - 1].distance : 0;
    if (i === 0) {
      acc.push({ label: `#${i + 1}`, distance: 0 });
    } else {
      const R = 6371;
      const dLat = ((p.latitude - gpsHistory[i - 1].latitude) * Math.PI) / 180;
      const dLng = ((p.longitude - gpsHistory[i - 1].longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((gpsHistory[i - 1].latitude * Math.PI) / 180) *
          Math.cos((p.latitude * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const seg = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      acc.push({ label: `#${i + 1}`, distance: +(prev + seg).toFixed(4) });
    }
    return acc;
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-white font-bold text-xl">Analytics</h2>
          <p className="text-[#64748B] text-sm mt-0.5">Real-time journey metrics from live GPS data</p>
        </div>
        {gpsHistory.length > 0 && (
          <button
            onClick={() => setShowClear(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        )}
      </motion.div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Distance", value: `${distanceTravelled.toFixed(2)} km`, color: "#2563EB", icon: TrendingUp },
          { label: "Average Speed", value: `${averageSpeed.toFixed(1)} km/h`, color: "#0EA5E9", icon: Clock },
          { label: "Max Speed", value: `${maxSpeed.toFixed(1)} km/h`, color: "#F59E0B", icon: Zap },
          { label: "Duration", value: `${Math.round(journeyDuration)} min`, color: "#22C55E", icon: MapPin },
        ].map(({ label, value, color, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-4 border border-white/5 text-center"
          >
            <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
            <div className="text-2xl font-extrabold text-white">{value}</div>
            <div className="text-[#64748B] text-xs mt-1">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SpeedOverTimeChart data={speedData} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CumulativeDistanceChart data={distanceData} />
        </motion.div>
      </div>

      {/* Stats panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StatsPanel />
        </div>
      </div>

      {/* Clear confirmation */}
      <AnimatePresence>
        {showClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60"
            onClick={() => setShowClear(false)}
          >
            <div
              className="rounded-2xl border border-white/10 shadow-2xl w-full max-w-xs mx-4 p-6"
              style={{ backgroundColor: "#1E293B" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-semibold mb-2">Clear Analytics History?</h3>
              <p className="text-[#94A3B8] text-sm mb-6">All analytics data and route history will be permanently deleted from Firebase.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowClear(false)} className="px-4 py-2 rounded-xl border border-white/10 text-[#94A3B8] text-sm">
                  Cancel
                </button>
                <button
                  onClick={() => { clearAnalytics(); clearHistory(); setShowClear(false); }}
                  className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-sm font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
