"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Battery, Clock, Shield, CheckCircle, Navigation,
  AlertTriangle, Wifi, TrendingUp, Bell, ArrowRight, Zap,
} from "lucide-react";
import {
  DEMO_CHILD, DEMO_DEVICE, DEMO_LOCATION, DEMO_ALERTS, DEMO_SAFETY_SCORE, ATTENDANCE_SUMMARY,
} from "@/lib/demo-data";
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

function SafetyGauge({ score }: { score: number }) {
  const data = [{ value: score, fill: score > 80 ? "#22C55E" : score > 60 ? "#F59E0B" : "#EF4444" }];
  const color = score > 80 ? "#22C55E" : score > 60 ? "#F59E0B" : "#EF4444";

  return (
    <motion.div {...fadeUp(0.5)} className="glass rounded-2xl p-6 border border-white/5 col-span-1 md:col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">AI Safety Score</h3>
          <p className="text-[#64748B] text-xs mt-0.5">Based on 4 real-time metrics</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ color, backgroundColor: `${color}15` }}>
          {score > 80 ? "Low Risk" : score > 60 ? "Medium" : "High Risk"}
        </span>
      </div>
      <div className="relative h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="80%" innerRadius="70%" outerRadius="95%" startAngle={180} endAngle={0} data={data}>
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#1E293B" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <div className="text-4xl font-extrabold" style={{ color }}>{score}</div>
          <div className="text-[#64748B] text-xs">out of 100</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          { label: "Route Consistency", val: DEMO_SAFETY_SCORE.routeConsistency },
          { label: "Attendance Rate",   val: DEMO_SAFETY_SCORE.attendanceRate },
          { label: "Zone Compliance",   val: DEMO_SAFETY_SCORE.geofenceCompliance },
          { label: "Device Health",     val: DEMO_SAFETY_SCORE.deviceHealth },
        ].map((m) => (
          <div key={m.label} className="bg-[#0F172A] rounded-xl p-2.5">
            <div className="text-[#64748B] text-xs mb-1.5">{m.label}</div>
            <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.val}%` }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="text-white text-xs font-semibold mt-1">{m.val}%</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AttendanceWidget() {
  const data = [
    { name: "Present", value: ATTENDANCE_SUMMARY.present, fill: "#22C55E" },
    { name: "Absent",  value: ATTENDANCE_SUMMARY.absent,  fill: "#EF4444" },
  ];
  return (
    <motion.div {...fadeUp(0.6)} className="glass rounded-2xl p-6 border border-white/5">
      <h3 className="text-white font-semibold mb-1">Attendance</h3>
      <p className="text-[#64748B] text-xs mb-4">June 2026 — {ATTENDANCE_SUMMARY.total} school days</p>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-sm font-bold">{Math.round((ATTENDANCE_SUMMARY.present / ATTENDANCE_SUMMARY.total) * 100)}%</div>
            </div>
          </div>
        </div>
        <div className="space-y-2 flex-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-[#94A3B8] text-xs">{d.name}</span>
              </div>
              <span className="text-white text-xs font-bold">{d.value} days</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RecentAlerts() {
  const recent = DEMO_ALERTS.slice(0, 4);
  const severityColor: Record<string, string> = {
    success: "#22C55E", info: "#0EA5E9", warning: "#F59E0B", danger: "#EF4444",
  };
  return (
    <motion.div {...fadeUp(0.7)} className="glass rounded-2xl p-6 border border-white/5 col-span-1 md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Recent Alerts</h3>
          <p className="text-[#64748B] text-xs mt-0.5">Last 24 hours</p>
        </div>
        <Link href="/dashboard/alerts" className="text-[#2563EB] text-xs hover:text-[#0EA5E9] transition-colors flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {recent.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#0F172A] hover:bg-[#0a0f1a] transition-colors">
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: severityColor[alert.severity] }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className="text-white text-sm font-medium">{alert.title}</span>
                {!alert.isRead && <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0 mt-1" />}
              </div>
              <div className="text-[#64748B] text-xs mt-0.5 truncate">{alert.message}</div>
              <div className="text-[#475569] text-xs mt-1">
                {new Date(alert.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function DashboardHome() {
  const lastSyncDate = new Date(DEMO_DEVICE.lastSync);
  const distanceFromHome = 0.8; // km (demo)

  const kpis = [
    {
      icon: MapPin, label: "Current Location", color: "#2563EB",
      value: "Jayanagar", sub: "4th Block, Bengaluru",
      href: "/dashboard/live-tracking", delay: 0.1,
    },
    {
      icon: Battery, label: "Device Battery", color: "#F59E0B",
      value: `${DEMO_DEVICE.battery}%`, sub: "Charging not required",
      href: "/dashboard/device-health", delay: 0.15,
    },
    {
      icon: Clock, label: "Last Update", color: "#0EA5E9",
      value: lastSyncDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      sub: "Just now • GPS 4m accuracy", delay: 0.2,
    },
    {
      icon: Navigation, label: "Current Status", color: "#22C55E",
      value: "Travelling", sub: "En route to School • 18 km/h",
      href: "/dashboard/live-tracking", delay: 0.25,
    },
    {
      icon: Shield, label: "Child Safe Status", color: "#22C55E",
      value: "✓ Safe", sub: "No threats detected", delay: 0.3,
    },
    {
      icon: CheckCircle, label: "School Attendance", color: "#22C55E",
      value: "Present", sub: "Arrived 8:15 AM today", delay: 0.35,
    },
    {
      icon: TrendingUp, label: "Distance From Home", color: "#A855F7",
      value: `${distanceFromHome} km`, sub: "1.8 km to school",
      href: "/dashboard/live-tracking", delay: 0.4,
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
            AS
          </div>
          <div>
            <div className="text-white font-bold text-lg">{DEMO_CHILD.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[#22C55E] text-sm font-medium">Travelling to School</span>
              <span className="text-[#475569] text-sm">• Device {DEMO_DEVICE.id}</span>
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
        <SafetyGauge score={DEMO_SAFETY_SCORE.score} />
        <AttendanceWidget />
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
