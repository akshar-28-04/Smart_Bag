"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Shield, Eye, EyeOff, Mail, Phone, ArrowRight, Chrome } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#2563EB]/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#0EA5E9]/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center shadow-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">SmartBag</span>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-[#94A3B8] text-sm mb-8">Sign in to your parent account</p>

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-[#0F172A] p-1 mb-6">
            {(["email", "phone"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-[#2563EB] text-white shadow-lg"
                    : "text-[#64748B] hover:text-white"
                }`}
              >
                {m === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                {m === "email" ? "Email" : "Mobile"}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/dashboard"; }}>
            <AnimatePresence mode="wait">
              {mode === "email" ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <label className="text-[#94A3B8] text-xs font-medium block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <label className="text-[#94A3B8] text-xs font-medium block mb-2">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-[#64748B] text-sm">🇮🇳 +91</span>
                      <div className="w-px h-4 bg-[#334155]" />
                    </div>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-24 pr-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#94A3B8] text-xs font-medium">Password</label>
                <a href="#" className="text-[#2563EB] text-xs hover:text-[#0EA5E9] transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[#475569] text-xs">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button className="w-full py-3.5 rounded-xl glass border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-3 hover:bg-white/5 transition-colors">
            <Chrome className="w-4 h-4" />
            Sign in with Google
          </button>

          <p className="text-center text-[#64748B] text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#2563EB] hover:text-[#0EA5E9] font-semibold transition-colors">
              Register
            </Link>
          </p>
        </div>

        <p className="text-center text-[#475569] text-xs mt-6">
          Protected by SmartBag Security • 256-bit encryption
        </p>
      </motion.div>
    </main>
  );
}
