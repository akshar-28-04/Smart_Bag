"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  AlertOctagon, Phone, Navigation, Share2, MapPin, Clock,
  User, CheckCircle, Shield,
} from "lucide-react";
import { SOS_EVENT, DEMO_CHILD } from "@/lib/demo-data";

const MiniMap = dynamic(() => import("@/components/map/MiniMap"), { ssr: false });

export default function SOSPage() {
  const [resolved, setResolved] = useState(false);

  const triggerTime = new Date(SOS_EVENT.triggerTime);
  const resolvedTime = new Date(SOS_EVENT.resolvedTime);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Emergency header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl p-6 border-2 ${
          resolved
            ? "bg-[#22C55E]/10 border-[#22C55E]/40"
            : "bg-[#EF4444]/10 border-[#EF4444]/40"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 sos-button ${
            resolved ? "bg-[#22C55E]/20" : "bg-[#EF4444]/20"
          }`}>
            {resolved
              ? <CheckCircle className="w-8 h-8 text-[#22C55E]" />
              : <AlertOctagon className="w-8 h-8 text-[#EF4444]" />}
          </div>
          <div className="flex-1">
            <h1 className={`text-2xl font-extrabold ${resolved ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {resolved ? "✓ SOS Resolved" : "🚨 SOS Alert"}
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              {resolved
                ? `Resolved at ${resolvedTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                : `Triggered by ${DEMO_CHILD.name} — Immediate attention required`}
            </p>
          </div>
          <button
            onClick={() => setResolved(!resolved)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              resolved
                ? "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/30"
                : "bg-[#22C55E] text-white hover:bg-[#16a34a] shadow-lg"
            }`}
          >
            {resolved ? "Reopen Alert" : "Mark as Resolved"}
          </button>
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
                { label: "SOS Trigger Time", value: triggerTime.toLocaleString("en-IN") },
                { label: "Child Name",        value: DEMO_CHILD.name },
                { label: "Device ID",         value: "SB-001" },
                { label: "Current Address",   value: SOS_EVENT.address },
                {
                  label: "Coordinates",
                  value: `${SOS_EVENT.location.lat.toFixed(4)}, ${SOS_EVENT.location.lng.toFixed(4)}`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[#64748B] text-xs">{label}</span>
                  <span className="text-white text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Emergency contacts */}
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
              {SOS_EVENT.emergencyContacts.map((contact, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{contact.name}</div>
                    <div className="text-[#64748B] text-xs">{contact.relation} • {contact.phone}</div>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="w-8 h-8 rounded-xl bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E] hover:bg-[#22C55E]/30 transition-colors flex-shrink-0"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
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
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                <span className="text-[#EF4444] text-xs font-medium">SOS Active</span>
              </span>
            </div>
            <div className="h-72">
              <MiniMap
                center={[SOS_EVENT.location.lat, SOS_EVENT.location.lng]}
                zoom={15}
                markerColor="#EF4444"
                markerEmoji="🆘"
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
              <Shield className="w-4 h-4 text-[#2563EB]" /> Response Timeline
            </h3>
            <div className="space-y-4">
              {[
                { time: "12:30 PM", event: "SOS button pressed by Aarav", color: "#EF4444", done: true },
                { time: "12:30 PM", event: "Alert sent to all 3 contacts", color: "#F59E0B", done: true },
                { time: "12:32 PM", event: "Priya Sharma notified via SMS", color: "#0EA5E9", done: true },
                { time: "12:47 PM", event: "SOS marked resolved by parent",  color: "#22C55E", done: resolved },
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
