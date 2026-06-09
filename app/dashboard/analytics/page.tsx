"use client";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import {
  TrendingUp, Clock, CheckCircle, MapPin, AlertTriangle, Zap,
} from "lucide-react";
import {
  DEMO_WEEKLY_STATS, ATTENDANCE_SUMMARY, MONTHLY_TREND, VISITED_LOCATIONS, DEMO_SAFETY_SCORE,
} from "@/lib/demo-data";

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

// ─── Weekly Distance ──────────────────────────────────────────────────────────
function WeeklyDistanceChart() {
  return (
    <SectionCard title="Weekly Travel Distance" sub="km per day this week" icon={TrendingUp} color="#2563EB">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={DEMO_WEEKLY_STATS}>
          <defs>
            <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...CHART_GRID} vertical={false} />
          <XAxis dataKey="day" stroke="#475569" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v: number) => [`${v} km`, "Distance"]} />
          <Area type="monotone" dataKey="distance" stroke="#2563EB" strokeWidth={2.5} fill="url(#distGrad)" dot={{ fill: "#2563EB", strokeWidth: 0, r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}

// ─── Average Travel Time ──────────────────────────────────────────────────────
function TravelTimeChart() {
  return (
    <SectionCard title="Avg Travel Time" sub="minutes per day" icon={Clock} color="#0EA5E9">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={DEMO_WEEKLY_STATS} barSize={28}>
          <CartesianGrid {...CHART_GRID} vertical={false} />
          <XAxis dataKey="day" stroke="#475569" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v: number) => [`${v} min`, "Travel Time"]} />
          <Bar dataKey="travelTime" fill="#0EA5E9" radius={[6, 6, 0, 0]}>
            {DEMO_WEEKLY_STATS.map((entry, i) => (
              <Cell key={i} fill={entry.attended ? "#0EA5E9" : "#1E293B"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}

// ─── Attendance Pie ───────────────────────────────────────────────────────────
function AttendancePieChart() {
  const data = [
    { name: "Present", value: ATTENDANCE_SUMMARY.present, fill: "#22C55E" },
    { name: "Absent",  value: ATTENDANCE_SUMMARY.absent,  fill: "#EF4444" },
  ];
  const pct = Math.round((ATTENDANCE_SUMMARY.present / ATTENDANCE_SUMMARY.total) * 100);

  return (
    <SectionCard title="School Attendance" sub="June 2026 — 20 school days" icon={CheckCircle} color="#22C55E">
      <div className="flex items-center gap-6">
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={44} outerRadius={60} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-white text-2xl font-extrabold">{pct}%</div>
            <div className="text-[#64748B] text-xs">Present</div>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8] text-xs">{d.name}</span>
                  <span className="text-white text-xs font-bold">{d.value} days</span>
                </div>
                <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.value / ATTENDANCE_SUMMARY.total) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.fill }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Most Visited ─────────────────────────────────────────────────────────────
function VisitedLocationsChart() {
  const max = Math.max(...VISITED_LOCATIONS.map((l) => l.visits));
  const colors = ["#2563EB", "#0EA5E9", "#22C55E", "#A855F7", "#F59E0B"];

  return (
    <SectionCard title="Most Visited Locations" sub="All-time visit count" icon={MapPin} color="#A855F7">
      <div className="space-y-3">
        {VISITED_LOCATIONS.map((loc, i) => (
          <div key={loc.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                <span className="text-[#94A3B8] text-xs">{loc.name}</span>
              </div>
              <span className="text-white text-xs font-bold">{loc.visits} visits</span>
            </div>
            <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(loc.visits / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: colors[i] }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Monthly Trend ────────────────────────────────────────────────────────────
function MonthlyTrendChart() {
  return (
    <SectionCard title="Route Consistency Trend" sub="Daily distance vs average (June 2026)" icon={Zap} color="#F59E0B">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={MONTHLY_TREND.slice(0, 20)}>
          <CartesianGrid {...CHART_GRID} vertical={false} />
          <XAxis dataKey="date" stroke="#475569" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false}
            interval={3} />
          <YAxis stroke="#475569" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v: number) => [`${v} km`, ""]} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#64748B" }} />
          <Line type="monotone" dataKey="distance" name="Actual" stroke="#F59E0B" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="avg" name="Average" stroke="#2563EB" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}

// ─── AI Safety Panel ──────────────────────────────────────────────────────────
function AISafetyPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 border border-[#2563EB]/20 col-span-1 md:col-span-2 lg:col-span-3"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#2563EB]" /> AI Route Anomaly Detection
          </h3>
          <p className="text-[#64748B] text-sm mt-1">Comparing today&apos;s route to the 30-day baseline</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20">
          <CheckCircle className="w-4 h-4 text-[#22C55E]" />
          <span className="text-[#22C55E] text-sm font-semibold">Normal — No anomalies</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Route Match",       value: "96%",  color: "#22C55E", icon: CheckCircle },
          { label: "Risk Level",         value: "Low",  color: "#22C55E", icon: CheckCircle },
          { label: "Deviation",          value: "180m", color: "#F59E0B", icon: AlertTriangle },
          { label: "Alert Severity",     value: "None", color: "#22C55E", icon: CheckCircle },
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
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-white font-bold text-xl">Analytics</h2>
        <p className="text-[#64748B] text-sm mt-0.5">Insights and patterns for Aarav Sharma</p>
      </motion.div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Avg Daily Distance", value: "4.1 km",  color: "#2563EB", icon: TrendingUp },
          { label: "Avg Travel Time",    value: "46 min",  color: "#0EA5E9", icon: Clock },
          { label: "Attendance Rate",    value: "95%",     color: "#22C55E", icon: CheckCircle },
          { label: "Safety Score",       value: `${DEMO_SAFETY_SCORE.score}/100`, color: "#22C55E", icon: Zap },
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
          <WeeklyDistanceChart />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <TravelTimeChart />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <AttendancePieChart />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <VisitedLocationsChart />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <MonthlyTrendChart />
          </motion.div>
        </div>
        <AISafetyPanel />
      </div>
    </div>
  );
}
