"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  User, Settings, LogOut, ChevronDown, Mail, Smartphone,
  Shield, MapPin,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";
import { useFirebase } from "@/hooks/useFirebase";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mqttConnected, gpsFix, satellites, currentPosition } = useSmartBag();
  const { user, childCurrent } = useFirebase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div ref={menuRef} className="relative z-[100]">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/10 shadow-2xl z-[200] overflow-hidden"
            style={{ backgroundColor: "#1E293B" }}
          >
            {/* Profile header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{user?.name ?? "User"}</div>
                  <div className="text-[#64748B] text-xs truncate flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {user?.email ?? "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Child & Device info */}
            <div className="px-5 py-4 border-b border-white/5">
              <div className="text-[#64748B] text-xs font-medium mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3 h-3" /> Device Info
              </div>
              <div className="space-y-2">
                {user?.childName && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] text-xs">Child</span>
                    <span className="text-white text-xs">{user.childName}</span>
                  </div>
                )}
                {user?.deviceId && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] text-xs">Device ID</span>
                    <span className="text-white text-xs">{user.deviceId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8] text-xs">Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${mqttConnected ? "bg-[#22C55E]" : "bg-[#EF4444]"}`} />
                    <span className={`text-xs font-medium ${mqttConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                      {mqttConnected ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8] text-xs">GPS</span>
                  <span className="text-white text-xs">{gpsFix ? "Fixed" : "No Fix"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8] text-xs">Satellites</span>
                  <span className="text-white text-xs">{satellites}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8] text-xs">Coordinates</span>
                  <span className="text-white text-xs font-mono">
                    {currentPosition
                      ? `${currentPosition[0].toFixed(4)}, ${currentPosition[1].toFixed(4)}`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency contacts */}
            {user?.emergencyContacts && user.emergencyContacts.length > 0 && (
              <div className="px-5 py-4 border-b border-white/5">
                <div className="text-[#64748B] text-xs font-medium mb-2 flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> Emergency Contacts
                </div>
                <div className="space-y-2">
                  {user.emergencyContacts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-xs">{c.name}</div>
                        <div className="text-[#475569] text-xs">{c.relation}</div>
                      </div>
                      <a href={`tel:${c.phone}`} className="text-[#0EA5E9] text-xs hover:underline">
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="p-2">
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#94A3B8] hover:bg-white/5 hover:text-white transition-all text-sm"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" /> Logout
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
