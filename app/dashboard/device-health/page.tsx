"use client";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import {
  Battery, Wifi, MapPin, Clock, Cpu, Zap, RefreshCw,
  CheckCircle, AlertTriangle, TrendingUp, Shield,
} from "lucide-react";
import { DEMO_DEVICE } from "@/lib/demo-data";

function GaugeWidget({
  label, value, max = 100, color, unit = "%", icon: Icon, sub,
}: {
  label: string; value: number; max?: number; color: string;
  unit?: string; icon: React.ElementType; sub: string;
}) {
  const pct = (value / max) * 100;
  const data = [{ value: pct, fill: color }];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-white font-semibold text-sm">{label}</span>
      </div>

      <div className="relative h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="80%"
            innerRadius="65%" outerRadius="90%"
            startAngle={180} endAngle={0}
            data={data}
          >
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#0F172A" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <div className="text-2xl font-extrabold" style={{ color }}>
            {value}{unit}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="text-[#64748B] text-xs">{sub}</div>
      </div>
    </motion.div>
  );
}

function StatusRow({
  icon: Icon, label, value, status, color, delay,
}: {
  icon: React.ElementType; label: string; value: string;
  status: "good" | "warn" | "bad"; color: string; delay: number;
}) {
  const statusColors = { good: "#22C55E", warn: "#F59E0B", bad: "#EF4444" };
  const statusLabels = { good: "Nominal", warn: "Warning", bad: "Critical" };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[#94A3B8] text-xs mb-0.5">{label}</div>
        <div className="text-white font-semibold text-sm">{value}</div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[status] }} />
        <span className="text-xs font-medium" style={{ color: statusColors[status] }}>
          {statusLabels[status]}
        </span>
      </div>
    </motion.div>
  );
}

function SignalBars({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-1 h-6">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className="w-3 rounded-sm transition-all"
          style={{
            height: `${bar * 20}%`,
            backgroundColor: bar <= strength ? "#22C55E" : "#1E293B",
          }}
        />
      ))}
    </div>
  );
}

export default function DeviceHealthPage() {
  const battery = DEMO_DEVICE.battery;
  const batteryColor = battery > 50 ? "#22C55E" : battery > 20 ? "#F59E0B" : "#EF4444";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-white font-bold text-xl">Device Health</h2>
        <p className="text-[#64748B] text-sm mt-0.5">SmartBag Device — {DEMO_DEVICE.id}</p>
      </motion.div>

      {/* Online banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-5 glass rounded-2xl border border-[#22C55E]/20"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22C55E]/20 to-[#0EA5E9]/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#22C55E]" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-[#0F172A]" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">{DEMO_DEVICE.id} — SmartBag Pro</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[#22C55E] text-sm font-medium">Online & Transmitting</span>
              <span className="text-[#475569] text-sm">• Firmware {DEMO_DEVICE.firmware}</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-[#94A3B8] text-sm hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" /> Sync Now
        </button>
      </motion.div>

      {/* Gauge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <GaugeWidget
          label="Battery" value={DEMO_DEVICE.battery} color={batteryColor}
          icon={Battery} sub="Est. 18h remaining" delay={0.2}
        />
        <GaugeWidget
          label="Signal Strength" value={DEMO_DEVICE.signalStrength} max={5}
          color="#22C55E" unit="/5" icon={Wifi} sub="Excellent GSM signal" delay={0.25}
        />
        <GaugeWidget
          label="GPS Quality" value={96} color="#0EA5E9"
          icon={MapPin} sub="4m accuracy • 12 satellites" delay={0.3}
        />
      </div>

      {/* Signal strength visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-6 border border-white/5"
      >
        <h3 className="text-white font-semibold mb-4">Network & GPS Status</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[#64748B] text-xs mb-3">GSM Signal Strength</div>
            <div className="flex items-center gap-4">
              <SignalBars strength={DEMO_DEVICE.signalStrength} />
              <div>
                <div className="text-white font-bold">Excellent</div>
                <div className="text-[#64748B] text-xs">-67 dBm RSSI</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs mb-3">GPS Lock Status</div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-2 rounded-sm" style={{
                    height: `${16 + Math.random() * 24}px`,
                    backgroundColor: i < 10 ? "#0EA5E9" : "#1E293B",
                  }} />
                ))}
              </div>
              <div>
                <div className="text-white font-bold">10 / 12 Sats</div>
                <div className="text-[#64748B] text-xs">4m accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status rows */}
      <div className="grid sm:grid-cols-2 gap-3">
        <StatusRow icon={Clock}   label="Last Synchronization" value={new Date(DEMO_DEVICE.lastSync).toLocaleTimeString("en-IN")} status="good" color="#0EA5E9" delay={0.4} />
        <StatusRow icon={Cpu}     label="Firmware Version"      value={DEMO_DEVICE.firmware}                                        status="good" color="#A855F7" delay={0.45} />
        <StatusRow icon={TrendingUp} label="Device Uptime"      value={DEMO_DEVICE.uptime}                                          status="good" color="#22C55E" delay={0.5} />
        <StatusRow icon={Zap}     label="GPS Module"            value="Active — Excellent"                                           status="good" color="#F59E0B" delay={0.55} />
        <StatusRow icon={MapPin}  label="GPS Accuracy"          value="4 metres"                                                     status="good" color="#2563EB" delay={0.6} />
        <StatusRow icon={Shield}  label="Tamper Detection"      value="No tampering detected"                                        status="good" color="#22C55E" delay={0.65} />
      </div>

      {/* Battery history bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6 border border-white/5"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Battery className="w-4 h-4 text-[#F59E0B]" /> Battery History — Last 7 Days
        </h3>
        <div className="flex items-end gap-2 h-20">
          {[95, 78, 62, 88, 74, 91, 82].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${v}%`,
                  backgroundColor: v > 50 ? "#22C55E" : v > 20 ? "#F59E0B" : "#EF4444",
                  opacity: 0.7 + (i / 7) * 0.3,
                }}
              />
              <div className="text-[#475569] text-xs">{["M","T","W","T","F","S","S"][i]}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
