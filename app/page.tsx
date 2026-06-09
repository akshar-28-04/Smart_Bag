"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield, MapPin, Bell, Navigation, Clock, Battery, Users, Star,
  ChevronRight, Wifi, Zap, Lock, TrendingUp, ArrowRight, CheckCircle,
  AlertTriangle, Phone, Play, Menu, X
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
          {["Features", "How It Works", "Pricing", "About"].map((item) => (
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
            Get Started
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
            {["Features", "How It Works", "Pricing", "About"].map((item) => (
              <a key={item} href="#" className="text-[#94A3B8] hover:text-white transition-colors text-sm">
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <Link href="/auth/login" className="text-center py-2 text-[#94A3B8] text-sm">Sign In</Link>
              <Link href="/auth/register" className="text-center py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-sm font-semibold">Get Started</Link>
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
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#0EA5E9]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#22C55E]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#2563EB]/30 text-sm text-[#0EA5E9] font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              Live GPS Tracking — Now Active
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
            >
              Your Child&apos;s Safety,{" "}
              <span className="gradient-text">Always Within Reach.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-[#94A3B8] leading-relaxed mb-10 max-w-lg"
            >
              Real-time location tracking, geofencing, route monitoring, and emergency
              alerts powered by IoT. Know exactly where your child is — every second.
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
                Start Tracking
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-3 px-7 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6"
            >
              {[
                { label: "Children Tracked", value: "50K+" },
                { label: "Safety Score Avg", value: "94%" },
                { label: "Response Time", value: "<3s" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-[#94A3B8] mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — floating dashboard card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative"
          >
            <div className="glass-strong rounded-3xl p-6 shadow-2xl border border-white/10">
              {/* Map placeholder */}
              <div className="relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2f4e] to-[#0d1f33] mb-4 border border-white/5">
                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 200">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="200" stroke="#2563EB" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 40} x2="300" y2={i * 40} stroke="#2563EB" strokeWidth="0.5" />
                  ))}
                </svg>
                {/* Route line */}
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
                </svg>
                {/* Home pin */}
                <div className="absolute bottom-8 left-8">
                  <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shadow-lg glow-green">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-[#22C55E] mt-1 font-medium">Home</div>
                </div>
                {/* School pin */}
                <div className="absolute top-8 right-10">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg glow-blue">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-[#0EA5E9] mt-1 font-medium">School</div>
                </div>
                {/* Animated child dot */}
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

              {/* Info cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Navigation, label: "Speed", value: "18 km/h", color: "#0EA5E9" },
                  { icon: Shield, label: "Status", value: "Safe", color: "#22C55E" },
                  { icon: Battery, label: "Battery", value: "82%", color: "#F59E0B" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="glass rounded-xl p-3 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                    <div className="text-white text-sm font-bold">{value}</div>
                    <div className="text-[#64748B] text-xs">{label}</div>
                  </div>
                ))}
              </div>

              {/* Child info row */}
              <div className="flex items-center gap-3 mt-4 p-3 glass rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  AS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold">Aarav Sharma</div>
                  <div className="text-[#94A3B8] text-xs truncate">Travelling to School</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-[#22C55E] text-xs font-medium">Live</span>
                </div>
              </div>
            </div>

            {/* Floating alert badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -bottom-4 -left-4 glass-strong rounded-2xl p-3 border border-[#22C55E]/30 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                <div>
                  <div className="text-white text-xs font-semibold">Arrived at School</div>
                  <div className="text-[#94A3B8] text-xs">8:15 AM • Just now</div>
                </div>
              </div>
            </motion.div>

            {/* Floating SOS badge */}
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
                  <div className="text-white text-xs font-semibold">GPS Active</div>
                  <div className="text-[#94A3B8] text-xs">4m accuracy</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
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

// ─── Stats Section ────────────────────────────────────────────────────────────

function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "300M+",
      label: "Children travel to school daily worldwide",
      sub: "Many without real-time parental visibility",
      color: "#2563EB",
    },
    {
      icon: AlertTriangle,
      value: "2.5M",
      label: "Child safety incidents reported annually",
      sub: "Most preventable with timely alerts",
      color: "#EF4444",
    },
    {
      icon: Clock,
      value: "47 min",
      label: "Average emergency response delay",
      sub: "SmartBag reduces this to under 3 seconds",
      color: "#F59E0B",
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
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">The Problem</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Why Child Safety Cannot Wait
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            Millions of parents have no idea where their child is during the daily
            school commute. SmartBag changes that.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-3xl p-8 card-hover border border-white/5 text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${s.color}20` }}
              >
                <s.icon className="w-8 h-8" style={{ color: s.color }} />
              </div>
              <div className="text-5xl font-extrabold text-white mb-2" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-white font-semibold text-lg mb-2">{s.label}</div>
              <div className="text-[#64748B] text-sm">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solution / Route Flow ────────────────────────────────────────────────────

function SolutionSection() {
  const stops = [
    { label: "Home", icon: Shield, color: "#22C55E", time: "7:30 AM" },
    { label: "School", icon: MapPin, color: "#2563EB", time: "8:15 AM" },
    { label: "Tuition", icon: Navigation, color: "#0EA5E9", time: "4:30 PM" },
    { label: "Home", icon: Shield, color: "#22C55E", time: "7:05 PM" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0F172A] to-[#0d1829]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">The Solution</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Track Every Step of the Journey
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            SmartBag monitors your child&apos;s entire day — from leaving home to returning safely.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-0">
          {stops.map((stop, i) => (
            <div key={`${stop.label}-${i}`} className="flex flex-col md:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-2xl border border-white/10"
                  style={{ backgroundColor: `${stop.color}20`, borderColor: `${stop.color}30` }}
                >
                  <stop.icon className="w-8 h-8" style={{ color: stop.color }} />
                </div>
                <div className="text-white font-semibold mt-3 text-sm">{stop.label}</div>
                <div className="text-[#64748B] text-xs mt-1">{stop.time}</div>
              </motion.div>

              {i < stops.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.1, duration: 0.4 }}
                  className="flex items-center mx-6 my-4 md:my-0"
                >
                  <div className="w-16 md:w-24 h-0.5 bg-gradient-to-r from-[#2563EB]/50 to-[#0EA5E9]/50" />
                  <ChevronRight className="w-5 h-5 text-[#2563EB] -ml-2 flex-shrink-0" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Feature callouts */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Bell, title: "Instant Alerts", desc: "Notified the moment your child enters or exits any safe zone." },
            { icon: Navigation, title: "Route Deviation", desc: "AI detects any unusual movement and alerts you immediately." },
            { icon: Phone, title: "One-Tap SOS", desc: "Emergency button on the device contacts all parents instantly." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">{item.title}</div>
                <div className="text-[#64748B] text-sm">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Live GPS Tracking",
      desc: "Real-time location updates every 5 seconds. See exactly where your child is on an interactive map with route history.",
      color: "#2563EB",
      badge: "Core Feature",
    },
    {
      icon: Shield,
      title: "Safe Zone Monitoring",
      desc: "Create virtual boundaries around Home, School, and Tuition. Get instant alerts on entry and exit.",
      color: "#22C55E",
      badge: "Geofencing",
    },
    {
      icon: Navigation,
      title: "Route Deviation Detection",
      desc: "AI compares the current route to historical patterns and alerts you the moment something unusual is detected.",
      color: "#0EA5E9",
      badge: "AI Powered",
    },
    {
      icon: AlertTriangle,
      title: "SOS Emergency Alerts",
      desc: "One press on the SmartBag device triggers an immediate emergency notification to all registered parents.",
      color: "#EF4444",
      badge: "Emergency",
    },
    {
      icon: CheckCircle,
      title: "School Attendance",
      desc: "Automatic detection of arrival and departure from school premises. Never miss an attendance update.",
      color: "#22C55E",
      badge: "Auto-Detect",
    },
    {
      icon: Battery,
      title: "Battery Monitoring",
      desc: "Track device health, GPS signal quality, and get notified when the battery needs charging.",
      color: "#F59E0B",
      badge: "Device Health",
    },
    {
      icon: TrendingUp,
      title: "Travel History",
      desc: "Explore historical routes, review travel patterns, and analyse distance and duration over time.",
      color: "#A855F7",
      badge: "Analytics",
    },
    {
      icon: Bell,
      title: "Parent Notifications",
      desc: "Push notifications, SMS, and in-app alerts ensure you never miss a critical update about your child.",
      color: "#0EA5E9",
      badge: "Instant",
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
            Everything You Need for Peace of Mind
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            SmartBag packs enterprise-grade safety features into a device that fits inside your child&apos;s school bag.
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

// ─── Architecture ─────────────────────────────────────────────────────────────

function ArchitectureSection() {
  const nodes = [
    { label: "SmartBag Device", sub: "ESP32 + GPS Module", icon: Wifi, color: "#2563EB" },
    { label: "GPS Satellite", sub: "Real-time coordinates", icon: Navigation, color: "#0EA5E9" },
    { label: "Cloud Platform", sub: "AWS IoT Core", icon: Zap, color: "#A855F7" },
    { label: "Parent Dashboard", sub: "Web & Mobile App", icon: TrendingUp, color: "#22C55E" },
    { label: "Push Notifications", sub: "Instant alerts", icon: Bell, color: "#F59E0B" },
  ];

  return (
    <section className="py-24 px-6 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">Architecture</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Powered by Cutting-Edge IoT
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            Enterprise-grade infrastructure ensures your child&apos;s location data is always available, accurate, and secure.
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
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Mother of 2 · Bengaluru",
      text: "SmartBag has completely changed how I feel about my son's daily commute. I get alerts the moment he reaches school. It's like having eyes everywhere.",
      rating: 5,
      initials: "PS",
    },
    {
      name: "Rajesh Kumar",
      role: "Father · Mumbai",
      text: "The route deviation alert saved my daughter once. The app notified me she wasn't on the usual path — turned out the auto took a different route. Invaluable.",
      rating: 5,
      initials: "RK",
    },
    {
      name: "Ananya Verma",
      role: "Parent · Delhi",
      text: "Setup was incredibly easy. The dashboard is beautiful and the live map is super accurate. Worth every rupee for the peace of mind it provides.",
      rating: 5,
      initials: "AV",
    },
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
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">Testimonials</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Trusted by Thousands of Parents
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-3xl p-8 border border-white/5 card-hover flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#CBD5E1] text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-[#64748B] text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {[
            { label: "50,000+ Active Users", icon: Users },
            { label: "4.9/5 App Rating", icon: Star },
            { label: "99.9% Uptime SLA", icon: Zap },
            { label: "256-bit Encryption", icon: Lock },
          ].map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2 text-[#64748B] text-sm">
              <Icon className="w-4 h-4 text-[#0EA5E9]" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PricingSection() {
  const plans = [
    {
      name: "Prototype",
      price: "Free",
      period: "",
      desc: "Perfect for evaluation and testing",
      features: [
        "Live GPS Tracking",
        "Basic Geofencing (2 zones)",
        "Push Notifications",
        "7-day Route History",
        "Single Child",
      ],
      cta: "Get Started Free",
      highlighted: false,
      color: "#64748B",
    },
    {
      name: "Research",
      price: "₹499",
      period: "/month",
      desc: "Full features for safety-conscious families",
      features: [
        "Everything in Prototype",
        "AI Route Anomaly Detection",
        "Unlimited Geofences",
        "90-day Route History",
        "Analytics Dashboard",
        "SOS Emergency Alerts",
        "Up to 3 Children",
        "Priority Support",
      ],
      cta: "Start 14-day Trial",
      highlighted: true,
      color: "#2563EB",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For schools and fleet operators",
      features: [
        "Everything in Research",
        "Unlimited Children / Devices",
        "Multi-admin Dashboard",
        "API Access",
        "Custom Integrations",
        "Dedicated Account Manager",
        "SLA Guarantee",
        "Bulk Device Management",
      ],
      cta: "Contact Sales",
      highlighted: false,
      color: "#0EA5E9",
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="text-4xl font-bold text-white mt-3 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            Your child&apos;s safety is priceless — our plans are designed to be accessible to every family.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-3xl p-8 border flex flex-col ${
                plan.highlighted
                  ? "bg-gradient-to-b from-[#1e3a6e] to-[#1E293B] border-[#2563EB]/50 shadow-2xl scale-105"
                  : "glass border-white/5"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white text-xs font-bold">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm font-semibold mb-2" style={{ color: plan.color }}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-[#64748B] mb-1">{plan.period}</span>
                </div>
                <div className="text-[#64748B] text-sm">{plan.desc}</div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#CBD5E1]">
                    <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className={`text-center py-3 rounded-2xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white hover:opacity-90 shadow-lg"
                    : "glass border border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0a111e] border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SmartBag</span>
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed mb-4">
              Know where your child is. Anytime. Anywhere. Powered by IoT technology.
            </p>
            <div className="flex gap-3">
              {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                <div key={s} className="w-8 h-8 glass rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-[#64748B] text-xs">{s[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Live Tracking", "Safe Zones", "Alerts", "Analytics"],
            },
            {
              title: "Company",
              links: ["About", "Team", "Privacy Policy", "Terms & Conditions", "Contact"],
            },
            {
              title: "Contact",
              links: ["smartbag@iot.dev", "+91 98765 43210", "Bengaluru, Karnataka", "Monday–Friday 9AM–6PM"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#64748B] text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#64748B] text-sm">
            © 2026 SmartBag. Built with ❤️ for child safety. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[#64748B] text-sm hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#64748B] text-sm hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <SolutionSection />
      <FeaturesSection />
      <ArchitectureSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
