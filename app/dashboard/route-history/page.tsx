"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useFirebase } from "@/hooks/useFirebase";

const RouteHistoryMap = dynamic(() => import("@/components/map/RouteHistoryMap"), { ssr: false });

export default function RouteHistoryPage() {
  const { clearHistory, historyPoints } = useFirebase();
  const [showClear, setShowClear] = useState(false);

  return (
    <div className="max-w-[1600px] mx-auto relative">
      <RouteHistoryMap />
      {historyPoints.length > 0 && (
        <button
          onClick={() => setShowClear(true)}
          className="absolute top-4 right-4 z-[1000] flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 transition-colors"
          style={{ backgroundColor: "#1E293B" }}
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      )}
      <AnimatePresence>
        {showClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60"
            onClick={() => setShowClear(false)}
          >
            <div
              className="rounded-2xl border border-white/10 shadow-2xl w-full max-w-xs mx-4 p-6"
              style={{ backgroundColor: "#1E293B" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-semibold mb-2">Clear Route History?</h3>
              <p className="text-[#94A3B8] text-sm mb-6">All route history will be permanently deleted from Firebase.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowClear(false)} className="px-4 py-2 rounded-xl border border-white/10 text-[#94A3B8] text-sm">
                  Cancel
                </button>
                <button
                  onClick={() => { clearHistory(); setShowClear(false); }}
                  className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-sm font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
