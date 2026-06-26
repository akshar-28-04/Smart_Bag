"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Shield, Smartphone, Globe, Lock, User,
  Save, Volume2, Map, Battery, AlertTriangle, ChevronRight,
} from "lucide-react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 focus:ring-offset-[#0F172A] ${
        checked ? "bg-[#2563EB]" : "bg-[#334155]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-3xl border border-white/5 overflow-hidden"
    >
      <div className="p-5 border-b border-white/5 bg-[#1E293B]/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#2563EB]" />
        </div>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="p-5 divide-y divide-white/5 space-y-4">
        {children}
      </div>
    </motion.div>
  );
}

function SettingRow({
  title, sub, control,
}: {
  title: string; sub?: string; control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4 first:pt-0">
      <div className="flex-1 pr-4">
        <div className="text-white text-sm font-medium">{title}</div>
        {sub && <div className="text-[#64748B] text-xs mt-1">{sub}</div>}
      </div>
      <div className="flex-shrink-0">{control}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    smsAlerts: true,
    emailReports: false,
    sosAlarm: true,
    liveTracking: true,
    locationHistory: true,
    batterySaver: false,
    shareLocation: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-white font-bold text-2xl">Settings</h2>
          <p className="text-[#64748B] text-sm mt-1">Manage preferences, notifications, and device configuration.</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" /> Save Changes
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SettingsSection title="Notifications & Alerts" icon={Bell}>
            <SettingRow
              title="Push Notifications"
              sub="Receive real-time alerts on your mobile device."
              control={<Toggle checked={settings.pushNotifications} onChange={() => toggle("pushNotifications")} />}
            />
            <SettingRow
              title="SMS Alerts"
              sub="Crucial for SOS and low battery warnings."
              control={<Toggle checked={settings.smsAlerts} onChange={() => toggle("smsAlerts")} />}
            />
            <SettingRow
              title="Weekly Email Reports"
              sub="Summary of attendance and travel history."
              control={<Toggle checked={settings.emailReports} onChange={() => toggle("emailReports")} />}
            />
          </SettingsSection>

          <SettingsSection title="Tracking & Privacy" icon={Map}>
            <SettingRow
              title="Live Tracking"
              sub="Enable real-time GPS updates (uses more battery)."
              control={<Toggle checked={settings.liveTracking} onChange={() => toggle("liveTracking")} />}
            />
            <SettingRow
              title="Location History"
              sub="Store route data for up to 30 days."
              control={<Toggle checked={settings.locationHistory} onChange={() => toggle("locationHistory")} />}
            />
            <SettingRow
              title="Family Sharing"
              sub="Allow trusted contacts to view live location."
              control={<Toggle checked={settings.shareLocation} onChange={() => toggle("shareLocation")} />}
            />
          </SettingsSection>
        </div>

        <div className="space-y-6">
          <SettingsSection title="Device Configuration" icon={Smartphone}>
            <SettingRow
              title="Battery Saver Mode"
              sub="Reduces GPS polling rate to extend battery life."
              control={<Toggle checked={settings.batterySaver} onChange={() => toggle("batterySaver")} />}
            />
            <SettingRow
              title="SOS Audible Alarm"
              sub="Bag emits a loud siren when SOS is triggered."
              control={<Toggle checked={settings.sosAlarm} onChange={() => toggle("sosAlarm")} />}
            />
            <SettingRow
              title="Update Interval"
              sub="How often the device sends location updates."
              control={
                <select className="bg-[#0F172A] text-white text-sm border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2563EB]">
                  <option>Every 30s</option>
                  <option>Every 1 min</option>
                  <option>Every 5 min</option>
                </select>
              }
            />
          </SettingsSection>

          <SettingsSection title="Account & Security" icon={Lock}>
            <button className="w-full flex items-center justify-between py-2 text-left group">
              <div>
                <div className="text-white text-sm font-medium group-hover:text-[#2563EB] transition-colors">Change Password</div>
                <div className="text-[#64748B] text-xs mt-1">Last updated 3 months ago</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between py-2 text-left group border-t border-white/5 mt-4 pt-4">
              <div>
                <div className="text-white text-sm font-medium group-hover:text-[#2563EB] transition-colors">Manage Linked Devices</div>
                <div className="text-[#64748B] text-xs mt-1">2 devices currently logged in</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
            </button>
          </SettingsSection>
        </div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-[#EF4444]/20 p-6 bg-[#EF4444]/5"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
          <h3 className="text-[#EF4444] font-semibold">Danger Zone</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-white text-sm font-medium">Unpair Device (SB-001)</div>
            <div className="text-[#64748B] text-xs mt-1">This will permanently remove the tracker from your account.</div>
          </div>
          <button className="px-5 py-2 rounded-xl border border-[#EF4444]/30 text-[#EF4444] text-sm font-semibold hover:bg-[#EF4444]/10 transition-colors flex-shrink-0">
            Unpair Device
          </button>
        </div>
      </motion.div>
    </div>
  );
}
