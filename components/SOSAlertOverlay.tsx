"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useSmartBag } from "@/hooks/useMQTT";

export default function SOSAlertOverlay() {
  const { sosActive, currentPosition } = useSmartBag();

  return (
    <AnimatePresence>
      {sosActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-b from-[#EF4444] to-[#DC2626]"
          />

          <div className="relative z-10 text-center px-6">
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
              className="inline-block"
            >
              <div className="text-[10rem] font-black text-white leading-none drop-shadow-2xl sos-text-glow">
                SOS
              </div>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mt-6"
            >
              <p className="text-2xl text-white/90 font-bold tracking-wide">
                EMERGENCY ALERT ACTIVE
              </p>
              <p className="text-white/60 text-sm mt-2 font-mono">
                {currentPosition
                  ? `${currentPosition[0].toFixed(6)}, ${currentPosition[1].toFixed(6)}`
                  : "Acquiring position..."}
              </p>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1 bg-white/30 rounded-full mt-8 max-w-xs mx-auto"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
