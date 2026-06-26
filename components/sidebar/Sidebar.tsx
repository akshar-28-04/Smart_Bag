"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, LayoutDashboard, MapPin, ShieldCheck, Bell,
  BarChart3, Cpu, Settings, Menu, X, LogOut, ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";

const NAV_ITEMS = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/live-tracking",icon: MapPin,          label: "Live Tracking" },
  { href: "/dashboard/safe-zones",   icon: ShieldCheck,     label: "Safe Zones" },
  { href: "/dashboard/analytics",    icon: BarChart3,       label: "Analytics" },
  { href: "/dashboard/alerts",       icon: Bell,            label: "Alerts" },
  { href: "/dashboard/device-health",icon: Cpu,             label: "Device Health" },
  { href: "/dashboard/settings",     icon: Settings,        label: "Settings" },
];

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
  onNavigate,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
        active
          ? "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20"
          : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
      } ${collapsed ? "justify-center px-3" : ""}`}
      title={collapsed ? label : undefined}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : ""}`} />
      {!collapsed && <span className="text-sm font-medium flex-1 whitespace-nowrap">{label}</span>}
      {active && !collapsed && <ChevronRight className="w-4 h-4 text-white/60" />}
      {active && collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white" />
      )}
    </Link>
  );
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { mqttConnected, gpsFix } = useSmartBag();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const sidebarWidth = collapsed ? 72 : 280;

  return (
    <>
      {/* Backdrop on mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full bg-[#1E293B] border-r border-white/5 z-40 flex flex-col overflow-hidden lg:relative"
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/5 flex-shrink-0">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center shadow-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0">
                  <div className="text-white font-bold text-lg leading-none">SmartBag</div>
                  <div className="text-[#475569] text-xs mt-0.5">Parent Dashboard</div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); onClose(); }}
                  className="lg:hidden text-[#475569] hover:text-white transition-colors ml-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
          </Link>
        </div>

        {/* Connection indicator */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${mqttConnected ? "bg-[#22C55E] animate-pulse" : "bg-[#EF4444]"}`} />
              <span className={`text-xs font-medium ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {mqttConnected ? "Online" : "Offline"}
              </span>
              {gpsFix && <span className="text-[#475569] text-xs ml-auto">GPS Fixed</span>}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
              collapsed={collapsed}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {/* Bottom: Collapse toggle + Logout */}
        <div className="p-3 border-t border-white/5 flex-shrink-0 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#94A3B8] hover:bg-white/5 hover:text-white transition-all ${
              collapsed ? "justify-center px-3" : ""
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={`w-5 h-5 flex-shrink-0 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            {!collapsed && <span className="text-sm font-medium whitespace-nowrap">Collapse</span>}
          </button>

          <Link
            href="/auth/login"
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-all ${
              collapsed ? "justify-center px-3" : ""
            }`}
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium whitespace-nowrap">Logout</span>}
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
