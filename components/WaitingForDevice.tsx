"use client";
import { motion } from "framer-motion";
import { Wifi, AlertTriangle } from "lucide-react";
import { useSmartBag } from "@/hooks/useMQTT";

export default function WaitingForDevice() {
  const { connectionStatus } = useSmartBag();

  if (connectionStatus === "connected") return null;

  const isConnecting = connectionStatus === "connecting";

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-12 border border-white/5 max-w-md w-full text-center"
      >
        {isConnecting ? (
          <>
            <div className="relative w-20 h-20 mx-auto mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border-4 border-[#2563EB]/20 border-t-[#2563EB]"
              />
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Connecting to Device
            </h2>
            <p className="text-[#64748B] text-sm">
              Establishing secure connection...
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center">
              <Wifi className="w-10 h-10 text-[#EF4444]" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Waiting for Device
            </h2>
            <p className="text-[#64748B] text-sm mb-6">
              Retrying connection every 5 seconds...
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                Ensure the SmartBag is powered on
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                Check that the device has cellular/WiFi signal
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                Verify HiveMQ credentials in .env.local
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
