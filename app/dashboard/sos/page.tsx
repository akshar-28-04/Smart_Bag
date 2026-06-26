"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  AlertOctagon, Phone, Navigation, Share2, MapPin, Clock,
  User, Shield, CheckCircle,
} from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";
import { useFirebase } from "@/hooks/useFirebase";

const MiniMap = dynamic(() => import("@/components/map/MiniMap"), { ssr: false });

export default function SOSPage() {
  const { sosActive, currentPosition, lastUpdate, mqttConnected, gpsStatus } = useSmartBag();
  const { user } = useFirebase();

  const triggerTime = lastUpdate ?? new Date();
  const mapCenter: [number, number] = currentPosition ?? [12.975, 77.597];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Emergency header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl p-6 border-2 ${
          sosActive
            ? "bg-[#EF4444]/10 border-[#EF4444]/40"
            : "bg-[#22C55E]/10 border-[#22C55E]/40"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${sosActive ? "sos-button bg-[#EF4444]/20" : "bg-[#22C55E]/20"}`}>
            {sosActive
              ? <AlertOctagon className="w-8 h-8 text-[#EF4444]" />
              : <CheckCircle className="w-8 h-8 text-[#22C55E]" />}
          </div>
          <div className="flex-1">
            <h1 className={`text-2xl font-extrabold ${sosActive ? "text-[#EF4444]" : "text-[#22C55E]"}`}>
              {sosActive ? "SOS Alert Active" : "No Active SOS"}
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              {sosActive
                ? `Triggered — ${triggerTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                : "All clear — SOS is not active"}
            </p>
          </div>
          <div className={`px-5 py-2.5 rounded-xl font-semibold text-sm border ${
            sosActive
              ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30 animate-pulse"
              : "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"
          }`}>
            {sosActive ? "ACTIVE" : "RESOLVED"}
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* Trigger info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5 border border-white/5"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#EF4444]" /> Incident Details
            </h3>
            <div className="space-y-3">
              {[
                { label: "SOS Status", value: sosActive ? "Active — Immediate attention" : "Resolved / No alert" },
                { label: "Last Update", value: lastUpdate?.toLocaleString("en-IN") ?? "N/A" },
                { label: "Device", value: "SmartBag" },
                {
                  label: "Coordinates",
                  value: currentPosition
                    ? `${currentPosition[0].toFixed(6)}, ${currentPosition[1].toFixed(6)}`
                    : "Acquiring...",
                },
                { label: "GPS Status", value: gpsStatus || "No Fix" },
                { label: "Connection", value: mqttConnected ? "Online" : "Offline" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[#64748B] text-xs">{label}</span>
                  <span className="text-white text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Emergency contacts (from Firebase) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-5 border border-white/5"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0EA5E9]" /> Emergency Contacts
            </h3>
            <div className="space-y-3">
              {(user?.emergencyContacts && user.emergencyContacts.length > 0
                ? user.emergencyContacts
                : [{ name: "No contacts", phone: "", relation: "Add contacts in settings" }]
              ).map((contact, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{contact.name}</div>
                    <div className="text-[#64748B] text-xs">{contact.relation}{contact.phone ? ` • ${contact.phone}` : ""}</div>
                  </div>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="w-8 h-8 rounded-xl bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E] hover:bg-[#22C55E]/30 transition-colors flex-shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 hover:bg-[#22C55E]/20 transition-colors group">
              <Phone className="w-6 h-6 text-[#22C55E]" />
              <span className="text-[#22C55E] text-xs font-semibold">Call Parent</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 hover:bg-[#2563EB]/20 transition-colors group">
              <Navigation className="w-6 h-6 text-[#2563EB]" />
              <span className="text-[#2563EB] text-xs font-semibold">Navigate</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 hover:bg-[#0EA5E9]/20 transition-colors group">
              <Share2 className="w-6 h-6 text-[#0EA5E9]" />
              <span className="text-[#0EA5E9] text-xs font-semibold">Share Loc.</span>
            </button>
          </motion.div>
        </div>

        {/* Right column — map */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl overflow-hidden border border-white/5"
          >
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#EF4444]" />
              <span className="text-white font-semibold text-sm">Live Location</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${sosActive ? "bg-[#EF4444] animate-pulse" : "bg-[#22C55E]"}`} />
                <span className={`text-xs font-medium ${sosActive ? "text-[#EF4444]" : "text-[#22C55E]"}`}>
                  {sosActive ? "SOS Active" : "Normal"}
                </span>
              </span>
            </div>
            <div className="h-72">
              <MiniMap
                center={mapCenter}
                zoom={15}
                markerColor={sosActive ? "#EF4444" : "#22C55E"}
                markerEmoji={sosActive ? "🆘" : "📍"}
              />
            </div>
          </motion.div>

          {/* Status timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-5 border border-white/5"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2563EB]" /> Status Timeline
            </h3>
            <div className="space-y-4">
              {[
                { time: lastUpdate?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) ?? "--:--", event: sosActive ? "SOS button pressed" : "System normal", color: sosActive ? "#EF4444" : "#22C55E", done: true },
                { time: lastUpdate?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) ?? "--:--", event: mqttConnected ? "Data transmitting" : "Device offline", color: mqttConnected ? "#0EA5E9" : "#F59E0B", done: mqttConnected },
                { time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), event: "Monitoring active", color: "#22C55E", done: true },
              ].map(({ time, event, color, done }) => (
                <div key={event} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: done ? color : "#334155" }} />
                    <div className="w-px flex-1 bg-white/5 mt-1" />
                  </div>
                  <div className="pb-3">
                    <div className="text-white text-xs font-medium">{event}</div>
                    <div className="text-[#475569] text-xs mt-0.5">{time}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
