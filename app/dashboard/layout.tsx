"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, LayoutDashboard, MapPin, Route, ShieldCheck, Bell,
  BarChart3, Cpu, AlertOctagon, Settings, Menu, X, LogOut,
  Battery, Wifi, ChevronRight, User,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";
import SOSAlertOverlay from "@/components/SOSAlertOverlay";
import WaitingForDevice from "@/components/WaitingForDevice";

const NAV_ITEMS = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/live-tracking",icon: MapPin,          label: "Live Tracking" },
  { href: "/dashboard/route-history",icon: Route,           label: "Route History" },
  { href: "/dashboard/safe-zones",   icon: ShieldCheck,     label: "Safe Zones" },
  { href: "/dashboard/alerts",       icon: Bell,            label: "Alerts",    badge: 2 },
  { href: "/dashboard/analytics",    icon: BarChart3,       label: "Analytics" },
  { href: "/dashboard/device-health",icon: Cpu,             label: "Device Health" },
  { href: "/dashboard/sos",          icon: AlertOctagon,    label: "SOS",       emergency: true },
  { href: "/dashboard/settings",     icon: Settings,        label: "Settings" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { mqttConnected, satellites, gpsFix } = useSmartBag();

  return (
    <>
      {/* Backdrop on mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-72 bg-[#1E293B] border-r border-white/5 z-40 flex flex-col lg:translate-x-0 lg:static lg:z-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-none">SmartBag</div>
                <div className="text-[#475569] text-xs mt-0.5">Parent Dashboard</div>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden text-[#475569] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Child info card */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                AS
              </div>
              <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">SmartBag</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${mqttConnected ? "bg-[#22C55E] animate-pulse" : "bg-[#EF4444]"} `} />
                <span className={`text-xs font-medium ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                  {mqttConnected ? "Online" : "Offline"}
                </span>
              </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span className="text-[#94A3B8] text-xs">{gpsFix ? "GPS Fixed" : "No Fix"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi className={`w-3.5 h-3.5 ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`} />
                <span className="text-[#94A3B8] text-xs">{satellites} sats</span>
              </div>
              <div className="text-[#475569] text-xs">SmartBag</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                  active
                    ? "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20"
                    : item.emergency
                    ? "text-[#EF4444] hover:bg-[#EF4444]/10"
                    : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : ""}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge && !active && (
                  <span className="w-5 h-5 rounded-full bg-[#EF4444] text-white text-xs flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight className="w-4 h-4 text-white/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#475569] to-[#334155] flex items-center justify-center">
              <User className="w-4 h-4 text-[#94A3B8]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">Priya Sharma</div>
              <div className="text-[#475569] text-xs">priya@example.com</div>
            </div>
            <LogOut className="w-4 h-4 text-[#475569] hover:text-[#EF4444] transition-colors" />
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const current = NAV_ITEMS.find((n) => n.href === pathname);
  const { mqttConnected } = useSmartBag();

  return (
    <header className="h-16 bg-[#1E293B]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[#94A3B8] hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-white font-semibold text-lg leading-none">{current?.label ?? "Dashboard"}</h1>
          <p className="text-[#475569] text-xs mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass border ${mqttConnected ? "border-[#22C55E]/20" : "border-[#EF4444]/20"}`}>
          <span className={`w-2 h-2 rounded-full ${mqttConnected ? "bg-[#22C55E] animate-pulse" : "bg-[#EF4444]"}`} />
          <span className={`text-xs font-medium ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
            {mqttConnected ? "Live" : "Disconnected"}
          </span>
        </div>

        {/* Alerts bell */}
        <Link href="/dashboard/alerts" className="relative w-9 h-9 rounded-xl glass border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4 text-[#94A3B8]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-xs flex items-center justify-center font-bold">2</span>
        </Link>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity">
          PS
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { connectionStatus } = useSmartBag();
  const showWaiting = connectionStatus === "disconnected" || connectionStatus === "connecting";

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      <SOSAlertOverlay />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {showWaiting ? <WaitingForDevice /> : children}
        </main>
      </div>
    </div>
  );
}
