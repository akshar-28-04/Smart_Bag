"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Eye, EyeOff, Mail, Phone, User, Hash, ArrowRight, Chrome, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    parentName: "", email: "", mobile: "", childName: "", deviceId: "", password: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#2563EB]/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-[#22C55E]/8 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center shadow-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">SmartBag</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > s ? "bg-[#22C55E] text-white" : step === s ? "bg-[#2563EB] text-white" : "bg-[#1E293B] text-[#475569]"
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs ${step >= s ? "text-white" : "text-[#475569]"}`}>
                {s === 1 ? "Parent Info" : "Child & Device"}
              </span>
              {s < 2 && <div className="w-8 h-px bg-[#334155]" />}
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-[#94A3B8] text-sm mb-8">Set up your parent profile</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[#94A3B8] text-xs font-medium block mb-2">Parent Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input type="text" placeholder="Priya Sharma" value={form.parentName}
                      onChange={(e) => update("parentName", e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs font-medium block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input type="email" placeholder="parent@example.com" value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs font-medium block mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input type="tel" placeholder="+91 98765 43210" value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs font-medium block mb-2">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[#475569] text-xs">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button className="w-full py-3.5 rounded-xl glass border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-3 hover:bg-white/5 transition-colors">
                <Chrome className="w-4 h-4" /> Sign up with Google
              </button>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-2xl font-bold text-white mb-1">Child Details</h1>
              <p className="text-[#94A3B8] text-sm mb-8">Link your child and SmartBag device</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[#94A3B8] text-xs font-medium block mb-2">Child&apos;s Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input type="text" placeholder="Aarav Sharma" value={form.childName}
                      onChange={(e) => update("childName", e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs font-medium block mb-2">SmartBag Device ID</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input type="text" placeholder="SB-001" value={form.deviceId}
                      onChange={(e) => update("deviceId", e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-[#475569] focus:outline-none focus:border-[#2563EB] transition-colors" />
                  </div>
                  <p className="text-[#475569] text-xs mt-1">Found on the label inside your SmartBag device.</p>
                </div>

                {/* Device pairing visual */}
                <div className="glass rounded-2xl p-4 border border-[#2563EB]/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0">
                    <Hash className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Device Pairing</div>
                    <div className="text-[#64748B] text-xs">Enter the ID printed on your device to link it.</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl glass border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button onClick={() => window.location.href = "/dashboard"}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <CheckCircle className="w-4 h-4" /> Create Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <p className="text-center text-[#64748B] text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#2563EB] hover:text-[#0EA5E9] font-semibold transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
