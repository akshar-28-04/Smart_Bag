"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, X, CheckCheck, Trash2, AlertOctagon, Wifi,
  MapPin, Shield,
} from "lucide-react";
import { useFirebase } from "@/hooks/useFirebase";
import type { FirebaseNotification } from "@/types/firebase";

const NOTIF_ICONS: Record<string, React.ElementType> = {
  SOS: AlertOctagon,
  GPS: MapPin,
  Zone: Shield,
  Device: Wifi,
};

const NOTIF_COLORS: Record<string, string> = {
  SOS: "#EF4444",
  GPS: "#0EA5E9",
  Zone: "#22C55E",
  Device: "#F59E0B",
};

function getIcon(title: string) {
  for (const [key, Icon] of Object.entries(NOTIF_ICONS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return { Icon, color: NOTIF_COLORS[key] };
  }
  return { Icon: Bell, color: "#64748B" };
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
  } = useFirebase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifIds = notifications.map((n) => n.id).filter(Boolean) as string[];
  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id).filter(Boolean) as string[];

  return (
    <div ref={panelRef} className="relative z-[100]">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 min-w-[36px] rounded-xl glass border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <Bell className="w-4 h-4 text-[#94A3B8]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-full sm:mt-2 left-4 sm:left-auto rounded-2xl border border-white/10 shadow-2xl z-[200] overflow-hidden max-h-[70vh] flex flex-col"
            style={{ backgroundColor: "#1E293B", width: "auto", maxWidth: "90vw" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
                <p className="text-[#64748B] text-xs mt-0.5">{unreadCount} unread</p>
              </div>
              <div className="flex items-center gap-1">
                {unreadIds.length > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead(unreadIds)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#64748B] hover:text-[#22C55E] transition-colors"
                    title="Mark all read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifIds.length > 0 && (
                  <button
                    onClick={() => clearAllNotifications(notifIds)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#64748B] hover:text-[#EF4444] transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#64748B] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 text-[#334155] mx-auto mb-2" />
                  <p className="text-[#64748B] text-xs">No notifications</p>
                </div>
              ) : (
                notifications.slice(0, 20).map((notif) => {
                  const { Icon, color } = getIcon(notif.title);
                  return (
                    <button
                      key={notif.id}
                      onClick={() => notif.id && !notif.read && markNotificationRead(notif.id)}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                        !notif.read ? "bg-[#2563EB]/5" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-white text-xs font-medium truncate">{notif.title}</span>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />}
                        </div>
                        <p className="text-[#64748B] text-xs mt-0.5 line-clamp-2">{notif.body}</p>
                        <p className="text-[#475569] text-[10px] mt-1">
                          {new Date(notif.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
