"use client";
import { motion } from "framer-motion";

interface HealthCardProps {
  label: string;
  value: string;
  sub?: string;
  color: string;
  status?: "good" | "warn" | "bad";
  icon?: React.ElementType;
  delay?: number;
}

const statusColors = { good: "#22C55E", warn: "#F59E0B", bad: "#EF4444" };

export function HealthCard({ label, value, sub, color, status, icon: Icon, delay = 0 }: HealthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#0F172A] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="text-[#64748B] text-xs font-medium">{label}</div>
        {status && (
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[status] }} />
        )}
      </div>
      <div className="text-white font-bold text-lg">{value}</div>
      {sub && <div className="text-[#475569] text-xs mt-0.5">{sub}</div>}
    </motion.div>
  );
}

export function HealthStatusRow({
  label, value, status, icon: Icon, color, delay = 0,
}: {
  label: string; value: string; status: "good" | "warn" | "bad";
  icon?: React.ElementType; color: string; delay?: number;
}) {
  const sc = statusColors[status];
  const labels = { good: "Nominal", warn: "Warning", bad: "Critical" };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 hover:border-white/10 transition-all"
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[#94A3B8] text-xs mb-0.5">{label}</div>
        <div className="text-white font-semibold text-sm">{value}</div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sc }} />
        <span className="text-xs font-medium" style={{ color: sc }}>{labels[status]}</span>
      </div>
    </motion.div>
  );
}
