"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield, MapPin, Bell, Navigation, ChevronRight, Wifi, Zap, CheckCircle,
  AlertTriangle, Menu, X, Satellite, Signal, Cpu, HardDrive, Cloud,
  Monitor, Map, Activity, TrendingUp, Clock,
} from "lucide-react";

// ─── Navbar ─────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = ["Features", "How It Works", "Technology", "Architecture", "About"];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/10 shadow-2xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">SmartBag</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {items.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-[#94A3B8] hover:text-white transition-colors text-sm font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm text-[#94A3B8] hover:text-white transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Open Dashboard
          </Link>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 px-6 py-4 flex flex-col gap-4"
          >
            {items.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-[#94A3B8] hover:text-white transition-colors text-sm">
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <Link href="/auth/login" className="text-center py-2 text-[#94A3B8] text-sm">Sign In</Link>
              <Link href="/auth/register" className="text-center py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-sm font-semibold">Open Dashboard</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [dotPos, setDotPos] = useState({ x: 60, y: 40 });

  useEffect(() => {
    const interval = setInterval(() => {
      setDotPos(prev => ({
        x: prev.x + (Math.random() - 0.5) * 6,
        y: prev.y + (Math.random() - 0.5) * 4,
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#0EA5E9]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#22C55E]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#2563EB]/30 text-sm text-[#0EA5E9] font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              IoT Engineering Project — ESP32 + MQTT + Firebase
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            >
              SmartBag:{" "}
              <span className="gradient-text">IoT-Based Child Tracking &amp; Emergency Monitoring</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-[#94A3B8] leading-relaxed mb-10 max-w-lg"
            >
              SmartBag combines ESP32, NEO-6M GPS, HiveMQ MQTT, Firebase Realtime Database, and a Next.js dashboard to provide real-time child tracking, SOS alerts, safe-zone monitoring, and live device diagnostics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white font-semibold text-lg shadow-2xl hover:opacity-90 transition-all glow-blue"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-8"
            >
              {[
                { label: "Microcontroller", value: "ESP32" },
                { label: "GPS Module", value: "NEO-6M" },
                { label: "Cloud Platform", value: "Firebase" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-[#94A3B8] mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative"
          >
            <div className="glass-strong rounded-3xl p-6 shadow-2xl border border-white/10">
              {/* Map */}
              <div className="relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2f4e] to-[#0d1f33] mb-4 border border-white/5">
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 200">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="200" stroke="#2563EB" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 40} x2="300" y2={i * 40} stroke="#2563EB" strokeWidth="0.5" />
                  ))}
                </svg>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                  <motion.path
                    d="M 40 160 Q 120 120 180 80 Q 220 60 260 50"
                    stroke="#2563EB"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                  />
                  {/* Safe zone circles */}
                  <circle cx="50" cy="150" r="30" stroke="#22C55E" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="4 3" />
                  <circle cx="250" cy="40" r="25" stroke="#2563EB" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="4 3" />
                </svg>
                <div className="absolute bottom-8 left-6">
                  <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shadow-lg glow-green">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-[#22C55E] mt-1 font-medium">Safe Zone</div>
                </div>
                <div className="absolute top-8 right-8">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg glow-blue">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-[#0EA5E9] mt-1 font-medium">Device</div>
                </div>
                <motion.div
                  className="absolute"
                  animate={{ left: `${dotPos.x}%`, top: `${dotPos.y}%` }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 rounded-full bg-[#0EA5E9] opacity-30 scale-150 animate-ping" />
                    <div className="w-5 h-5 rounded-full bg-[#0EA5E9] border-2 border-white shadow-xl flex items-center justify-center">
                      <Navigation className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Status cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Wifi, label: "MQTT", value: "Connected", color: "#22C55E" },
                  { icon: Satellite, label: "GPS", value: "Fixed", color: "#0EA5E9" },
                  { icon: Signal, label: "Device", value: "Online", color: "#22C55E" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="glass rounded-xl p-3 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                    <div className="text-white text-sm font-bold">{value}</div>
                    <div className="text-[#64748B] text-xs">{label}</div>
                  </div>
                ))}
              </div>

              {/* Device info row */}
              <div className="flex items-center gap-3 mt-4 p-3 glass rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold">ESP32 Device #001</div>
                  <div className="text-[#94A3B8] text-xs truncate">Live Tracking Active</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-[#22C55E] text-xs font-medium">Live</span>
                </div>
              </div>
            </div>

            {/* Floating status badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -bottom-4 -left-4 glass-strong rounded-2xl p-3 border border-[#22C55E]/30 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                <div>
                  <div className="text-white text-xs font-semibold">Location Updated</div>
                  <div className="text-[#94A3B8] text-xs">5s ago</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute -top-4 -right-4 glass-strong rounded-2xl p-3 border border-[#2563EB]/30 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
                  <Wifi className="w-3 h-3 text-[#2563EB]" />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">MQTT Connected</div>
                  <div className="text-[#94A3B8] text-xs">HiveMQ Broker</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#64748B] text-xs">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1"
        >
          <div className="w-1 h-2 rounded-full bg-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Technology Components ───────────────────────────────────────────────────

function TechnologySection() {
  const techs = [
    {
      icon: Cpu, label: "ESP32", value: "Controller",
      desc: "Dual-core Xtensa LX6 microcontroller with integrated WiFi and Bluetooth, handling GPS data acquisition and MQTT publishing.",
      color: "#2563EB",
    },
    {
      icon: Satellite, label: "NEO-6M", value: "GPS Module",
      desc: "U-blox NEO-6M GPS receiver with ceramic antenna providing location coordinates at 1Hz update rate over UART.",
      color: "#0EA5E9",
    },
    {
      icon: Cloud, label: "HiveMQ", value: "MQTT Broker",
      desc: "Cloud-based MQTT broker handling bi-directional messaging between ESP32 device and the backend bridge service.",
      color: "#A855F7",
    },
    {
      icon: HardDrive, label: "Firebase", value: "Realtime Database",
      desc: "Google Firebase Realtime Database storing device state, GPS history, alerts, notifications, and user configuration.",
      color: "#22C55E",
    },
    {
      icon: Monitor, label: "Next.js", value: "Dashboard",
      desc: "React-based web dashboard with TypeScript, Tailwind CSS, and Leaflet maps providing real-time monitoring and controls.",
      color: "#F59E0B",
    },
    {
      icon: Map, label: "Leaflet + OSM", value: "Mapping",
      desc: "OpenStreetMap tiles rendered through Leaflet with custom markers, animated polylines, accurate circles, and zoom controls.",
      color: "#EF4444",
    },
    {
      icon: Wifi, label: "Wi-Fi", value: "Communication",
      desc: "ESP32 connects to the internet via 2.4GHz 802.11 b/g/n Wi-Fi to stream GPS data to the MQTT broker every 5 seconds.",
      color: "#EC4899",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">Technology</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Core Components
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            SmartBag is built on proven IoT hardware and cloud infrastructure — no simulated or placeholder components.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techs.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 card-hover border border-white/5"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${t.color}20` }}
              >
                <t.icon className="w-6 h-6" style={{ color: t.color }} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{t.label}</div>
              <div className="text-[#0EA5E9] text-xs font-semibold mb-3">{t.value}</div>
              <div className="text-[#64748B] text-sm leading-relaxed">{t.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    { label: "ESP32", sub: "Microcontroller", icon: Cpu, color: "#2563EB" },
    { label: "NEO-6M GPS", sub: "Satellite Receiver", icon: Satellite, color: "#0EA5E9" },
    { label: "HiveMQ MQTT", sub: "Cloud Broker", icon: Cloud, color: "#A855F7" },
    { label: "Firebase DB", sub: "Realtime Storage", icon: HardDrive, color: "#22C55E" },
    { label: "Next.js", sub: "Dashboard", icon: Monitor, color: "#F59E0B" },
    { label: "Parent", sub: "Live Tracking &amp; Alerts", icon: MapPin, color: "#EF4444" },
  ];

  return (
    <section className="py-24 px-6 bg-[#0d1829]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">How It Works</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Data Flow Architecture
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            From hardware GPS acquisition to dashboard visualization — every step is implemented and operational.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center w-full max-w-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-strong rounded-2xl p-5 border w-full flex items-center gap-4 card-hover"
                style={{ borderColor: `${step.color}30` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <div>
                  <div className="text-white font-semibold">{step.label}</div>
                  <div className="text-[#64748B] text-sm">{step.sub}</div>
                </div>
                <div className="ml-auto">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: step.color }} />
                </div>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.1 }}
                  className="flex flex-col items-center py-2"
                >
                  <div className="w-0.5 h-6 bg-gradient-to-b from-[#2563EB]/50 to-[#0EA5E9]/50" />
                  <ChevronRight className="w-4 h-4 text-[#2563EB] rotate-90" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Live GPS Tracking",
      desc: "Real-time location updates every 5 seconds. See the child's position on an interactive Leaflet map with smooth marker animation, route polyline, and multiple zoom levels.",
      color: "#2563EB",
      badge: "Core",
    },
    {
      icon: Shield,
      title: "Safe Zone Monitoring",
      desc: "Create virtual geofences around home, school, and other locations. Instant push alerts when the device enters or exits any defined zone with Haversine distance verification.",
      color: "#22C55E",
      badge: "Geofencing",
    },
    {
      icon: AlertTriangle,
      title: "SOS Emergency Alerts",
      desc: "A physical button on the device triggers an immediate SOS alert. The dashboard highlights the emergency, logs a Firebase alert, and displays emergency contact information.",
      color: "#EF4444",
      badge: "Emergency",
    },
    {
      icon: Activity,
      title: "Device Health",
      desc: "Monitor ESP32 diagnostics: firmware version, uptime, free heap, WiFi RSSI, MQTT latency, GPS HDOP, satellite count, and restart reason in real time.",
      color: "#F59E0B",
      badge: "Diagnostics",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      desc: "Visual charts showing travel patterns, distance covered, alert frequency, connection stability, and GPS accuracy over customizable time ranges.",
      color: "#A855F7",
      badge: "Analytics",
    },
    {
      icon: Clock,
      title: "Route History",
      desc: "Complete travel history with GPS coordinate trails rendered as animated Leaflet polylines. Browse historical routes and analyze past journeys.",
      color: "#0EA5E9",
      badge: "History",
    },
    {
      icon: Wifi,
      title: "MQTT Communication",
      desc: "ESP32 publishes GPS, battery, and sensor data to HiveMQ MQTT broker. A Node.js bridge service subscribes and writes all data to Firebase Realtime Database in real time.",
      color: "#2563EB",
      badge: "Protocol",
    },
    {
      icon: Cloud,
      title: "Firebase Sync",
      desc: "All device state, location history, alerts, notifications, and safe zone definitions are stored and synchronized through Firebase Realtime Database with live listeners.",
      color: "#22C55E",
      badge: "Cloud",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-[#0d1829]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">Features</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Implemented Modules
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            Every feature listed below is fully implemented and operational in the current dashboard.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 border border-white/5 cursor-pointer group transition-all hover:border-white/15"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ color: f.color, backgroundColor: `${f.color}15` }}
                >
                  {f.badge}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#0EA5E9] transition-colors">
                {f.title}
              </h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Architecture ─────────────────────────────────────────────────────────

function ArchitectureSection() {
  const nodes = [
    { label: "ESP32 + NEO-6M GPS", sub: "Hardware Device", icon: Cpu, color: "#2563EB" },
    { label: "HiveMQ MQTT Broker", sub: "Cloud Messaging", icon: Cloud, color: "#A855F7" },
    { label: "Firebase Realtime DB", sub: "Cloud Storage", icon: HardDrive, color: "#22C55E" },
    { label: "Next.js Dashboard", sub: "Web Application", icon: Monitor, color: "#F59E0B" },
    { label: "Parent Monitoring", sub: "Live Tracking & Alerts", icon: MapPin, color: "#0EA5E9" },
  ];

  return (
    <section id="architecture" className="py-24 px-6 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">Architecture</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            System Architecture
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            The device, broker, database, and dashboard operate as independent layers communicating over standard protocols.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-4">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex flex-col items-center w-full max-w-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-strong rounded-2xl p-5 border w-full flex items-center gap-4 card-hover"
                style={{ borderColor: `${node.color}30` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${node.color}20` }}
                >
                  <node.icon className="w-6 h-6" style={{ color: node.color }} />
                </div>
                <div>
                  <div className="text-white font-semibold">{node.label}</div>
                  <div className="text-[#64748B] text-sm">{node.sub}</div>
                </div>
                <div className="ml-auto">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: node.color }} />
                </div>
              </motion.div>
              {i < nodes.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.1 }}
                  className="flex flex-col items-center py-2"
                >
                  <div className="w-0.5 h-6 bg-gradient-to-b from-[#2563EB]/50 to-[#0EA5E9]/50" />
                  <ChevronRight className="w-4 h-4 text-[#2563EB] rotate-90" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Connection labels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-4 mt-16"
        >
          {[
            { label: "Device → Broker", proto: "MQTT over TCP", color: "#A855F7" },
            { label: "Broker → Bridge", proto: "MQTT Subscribe", color: "#2563EB" },
            { label: "Bridge → Database", proto: "Firebase REST API", color: "#22C55E" },
            { label: "DB → Dashboard", proto: "Firebase Listeners", color: "#F59E0B" },
          ].map((c, i) => (
            <div key={c.label} className="glass rounded-xl px-4 py-3 border border-white/5 text-center">
              <div className="text-white text-sm font-semibold">{c.label}</div>
              <div className="text-[#64748B] text-xs mt-1" style={{ color: c.color }}>{c.proto}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Project Highlights ────────────────────────────────────────────────────

function HighlightsSection() {
  const highlights = [
    { icon: Cpu, label: "ESP32 Embedded", desc: "Dual-core microcontroller with integrated WiFi for real-time GPS data acquisition and MQTT publishing.", color: "#2563EB" },
    { icon: Cloud, label: "MQTT Communication", desc: "HiveMQ MQTT broker enables bi-directional messaging between the device and cloud bridge service.", color: "#A855F7" },
    { icon: HardDrive, label: "Firebase Cloud Sync", desc: "Google Firebase Realtime Database stores device state, location history, alerts, and user configuration.", color: "#22C55E" },
    { icon: Monitor, label: "Live Dashboard", desc: "Next.js + TypeScript dashboard with Leaflet maps, real-time Firebase listeners, and responsive dark UI.", color: "#F59E0B" },
    { icon: Shield, label: "Safe Zones", desc: "Customizable geofences with entry/exit detection using Haversine distance calculation and push alerts.", color: "#0EA5E9" },
    { icon: AlertTriangle, label: "SOS Alerts", desc: "Physical SOS button triggers real-time emergency alerts logged to Firebase and displayed instantly on the dashboard.", color: "#EF4444" },
    { icon: Activity, label: "Analytics", desc: "Charts showing travel patterns, alert frequency, GPS accuracy, battery trends, and MQTT connection health.", color: "#A855F7" },
    { icon: Satellite, label: "Device Health", desc: "Live diagnostics: firmware version, uptime, heap usage, WiFi RSSI, MQTT ping, GPS fix, satellites, and HDOP.", color: "#22C55E" },
  ];

  return (
    <section className="py-24 px-6 bg-[#0d1829]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">Highlights</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Project Overview
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            SmartBag is a complete IoT engineering project — hardware, communication, cloud, and frontend all working together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 border border-white/5 text-center"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${h.color}20` }}
              >
                <h.icon className="w-7 h-7" style={{ color: h.color }} />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{h.label}</h3>
              <p className="text-[#64748B] text-sm">{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Technology Stack ─────────────────────────────────────────────────────

function TechStackSection() {
  const categories = [
    {
      title: "Hardware",
      color: "#2563EB",
      items: ["ESP32", "NEO-6M GPS", "GPS Antenna", "SOS Button", "Status LEDs", "Active Buzzer", "18650 Battery Shield"],
    },
    {
      title: "Frontend",
      color: "#0EA5E9",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Leaflet + OSM", "Recharts"],
    },
    {
      title: "Backend / Cloud",
      color: "#22C55E",
      items: ["HiveMQ MQTT", "Firebase Realtime DB", "MQTT.js Client", "Node.js Bridge"],
    },
    {
      title: "Development",
      color: "#F59E0B",
      items: ["Arduino IDE", "TinyGPS++", "PubSubClient", "ArduinoJson", "Git", "VS Code"],
    },
  ];

  return (
    <section id="technology" className="py-24 px-6 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">Stack</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Technology Stack
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            All components used in building the SmartBag system from hardware to dashboard.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass rounded-3xl p-6 border border-white/5"
            >
              <h3 className="text-lg font-bold text-white mb-1" style={{ color: cat.color }}>{cat.title}</h3>
              <div className="w-8 h-1 rounded-full mb-5" style={{ backgroundColor: cat.color }} />
              <ul className="space-y-2.5">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#CBD5E1]">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 bg-[#0d1829]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">About</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-6">
            IoT Engineering Project
          </h2>
          <p className="text-[#94A3B8] text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            SmartBag is an IoT-based child tracking and safety monitoring system developed as an engineering project. 
            It demonstrates end-to-end integration of embedded hardware, wireless communication, cloud databases, 
            and interactive web dashboards.
          </p>
          <div className="glass rounded-3xl p-8 border border-white/5 inline-block">
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Cpu, label: "ESP32" },
                { icon: Cloud, label: "MQTT" },
                { icon: HardDrive, label: "Firebase" },
                { icon: Monitor, label: "Next.js" },
                { icon: Map, label: "Leaflet" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Icon className="w-4 h-4 text-[#0EA5E9]" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0a111e] border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SmartBag</span>
          </div>
          <p className="text-[#64748B] text-sm max-w-md mb-4">
            IoT-Based Child Tracking &amp; Safety Monitoring System
          </p>
          <p className="text-[#475569] text-xs">
            Developed as an IoT Engineering Project
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 py-6 border-t border-white/5 mb-6">
          {["ESP32", "MQTT", "Firebase", "Next.js", "React", "Leaflet"].map((t) => (
            <span key={t} className="text-[#64748B] text-xs font-medium">{t}</span>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#475569] text-xs">
            © 2026 SmartBag Project. Built for IoT engineering demonstration.
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/akshar-28-04/Smart_Bag" target="_blank" rel="noopener noreferrer" className="text-[#64748B] text-xs hover:text-white transition-colors">
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ArrowRight helper ─────────────────────────────────────────────────────

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <Navbar />
      <HeroSection />
      <TechnologySection />
      <HowItWorksSection />
      <FeaturesSection />
      <ArchitectureSection />
      <HighlightsSection />
      <TechStackSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
