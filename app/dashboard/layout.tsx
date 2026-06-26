"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSmartBag } from "@/hooks/useMQTT";
import SOSAlertOverlay from "@/components/SOSAlertOverlay";
import WaitingForDevice from "@/components/WaitingForDevice";
import Sidebar from "@/components/sidebar/Sidebar";
import ProfileMenu from "@/components/profile/ProfileMenu";
import NotificationPanel from "@/components/notifications/NotificationPanel";

const NAV_LOOKUP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/live-tracking": "Live Tracking",
  "/dashboard/route-history": "Route History",
  "/dashboard/safe-zones": "Safe Zones",
  "/dashboard/alerts": "Alerts",
  "/dashboard/analytics": "Analytics",
  "/dashboard/device-health": "Device Health",
  "/dashboard/sos": "SOS",
  "/dashboard/settings": "Settings",
};

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { mqttConnected } = useSmartBag();

  return (
    <header className="h-16 bg-[#1E293B]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-3 sm:px-6 flex-shrink-0 min-w-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[#94A3B8] hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 flex-shrink-0"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="text-white font-semibold text-base sm:text-lg leading-none truncate">
            {NAV_LOOKUP[pathname] ?? "Dashboard"}
          </h1>
          <p className="hidden sm:block text-[#475569] text-xs mt-0.5 truncate">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass border ${
            mqttConnected ? "border-[#22C55E]/20" : "border-[#EF4444]/20"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              mqttConnected ? "bg-[#22C55E] animate-pulse" : "bg-[#EF4444]"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"
            }`}
          >
            {mqttConnected ? "Live" : "Disconnected"}
          </span>
        </div>

        <NotificationPanel />
        <ProfileMenu />
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { connectionStatus } = useSmartBag();
  const showWaiting =
    connectionStatus === "disconnected" || connectionStatus === "connecting";

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      <SOSAlertOverlay />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {showWaiting ? <WaitingForDevice /> : children}
        </main>
      </div>
    </div>
  );
}
