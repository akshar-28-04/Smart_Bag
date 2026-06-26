<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## What We Did — Round 1 Complete

### Created
- `components/live-map/LiveMap.tsx` — redesigned map page: left 350px status panel (GPS, Speed, SOS, Satellites, Battery, MQTT, WiFi) + Leaflet map with smooth marker animation, route polyline, safe zone circles, locate/fullscreen buttons + bottom floating status strip (GPS/MQTT/Firebase/ESP32 status)
- `components/device-health/HealthCards.tsx` — `HealthCard` and `HealthStatusRow` reusable components for diagnostics display

### Updated
- `app/dashboard/layout.tsx` — now uses new `Sidebar`, `ProfileMenu`, `NotificationPanel` components; mobile hamburger toggle; SOSOverlay + WaitingForDevice; shows date in topbar
- `app/dashboard/live-tracking/page.tsx` — switched from `LiveTrackingMap` to new `LiveMap`
- `app/dashboard/route-history/page.tsx` — wrapped in `max-w-[1600px] mx-auto`
- `app/dashboard/safe-zones/page.tsx` — wrapped in `max-w-[1600px] mx-auto`
- `app/page.tsx` — replaced fake "StatsSection" (300M+, 47min, 2.5M) with real hardware stats (10cm GPS accuracy, 24h battery, 4G/LTE connectivity); removed unused `Clock` import
- `app/dashboard/alerts/page.tsx` — now reads from Firebase alerts via `useFirebase()`; removed demo alerts dependency
- `app/dashboard/device-health/page.tsx` — added Firebase device diagnostics section (firmware, uptime, free heap, WiFi RSSI, MQTT latency, GPS HDOP, restart reason)
- `app/dashboard/page.tsx` — `max-w-[1600px]`
- `app/dashboard/analytics/page.tsx` — `max-w-[1600px]`
- `app/dashboard/device-health/page.tsx` — `max-w-[1600px]`
- `app/dashboard/alerts/page.tsx` — `max-w-[1600px]`
- `app/dashboard/sos/page.tsx` — `max-w-[1600px]`
- `app/dashboard/settings/page.tsx` — `max-w-[1600px]`
- `.env.local.example` — added Firebase client SDK env vars

### Key Architecture
- MQTT service (`services/mqtt.ts`) writes GPS → Firebase on every location message
- All Firebase listeners in `hooks/useFirebase.ts`
- All state merged in `hooks/useRealtime.ts` / `context/SmartBagContext.tsx`
- tsc --noEmit passes clean

### Next Time
- Run `npm run build` before commit
- Deploy: fill real Firebase env vars in `.env.local` and ensure `DATABASE_URL` matches

## What We Did — Round 2 Complete

### Added
- `services/firebase.ts` — `clearAlerts()`, `clearHistory()`, `clearAnalytics()` using `set(ref, null)`; `listenUser()` (reads `users/default`), `listenSafeZones()`, `addSafeZone()` (push), `updateSafeZone()`, `deleteSafeZone()` (set null), `listenHistory()` (returns flat array from `child/history`)
- `types/firebase.ts` — `FirebaseUser`, `FirebaseEmergencyContact`, `FirebaseSafeZone` interfaces
- `hooks/useFirebase.ts` — exposes `user`, `safeZones`, `historyPoints`, `clearAlerts`, `clearHistory`, `clearAnalytics`, `addSafeZone`, `updateSafeZone`, `deleteSafeZone`

### Fixed / Updated
- `components/profile/ProfileMenu.tsx` — opaque `bg-[#1E293B]`, z-[200], real Firebase user data (name, email, childName, deviceId, emergencyContacts with call links), GPS/satellite/coordinate display
- `components/notifications/NotificationPanel.tsx` — opaque `bg-[#1E293B]`, z-[200]
- `components/map/SafeZonesMap.tsx` — full rewrite: Firebase CRUD (add via map click → marker + radius circle → modal with name, radius presets/slider, color picker → save; edit toggle; delete with confirmation; active/inactive toggle), legend overlay, empty state; removed all demo data
- `components/live-map/LiveMap.tsx` — replaced `DEMO_SAFE_ZONES` with Firebase `safeZones`; removed `LOCATIONS` import
- `app/dashboard/device-health/page.tsx` — cleaned page: removed Firebase Device Diagnostics section, removed Heartbeat chart; clean grid of GPS Status, Satellites, Speed, MQTT, Coordinates, Firmware, Restart Reason, WiFi RSSI, MQTT Latency, GPS HDOP, SOS Status + satellite visualization + status rows
- `app/dashboard/alerts/page.tsx` — added Clear Timeline button + confirmation modal; removed `DEMO_ALERTS` import
- `app/dashboard/analytics/page.tsx` — added Clear History button + confirmation (calls both `clearAnalytics` + `clearHistory`)
- `app/dashboard/route-history/page.tsx` — Clear History button + confirmation calling `clearHistory()`
- `app/dashboard/sos/page.tsx` — replaced hardcoded emergency contacts with Firebase `user.emergencyContacts`
- `components/map/RouteHistoryMap.tsx` — removed hardcoded "Aarav" reference
- `types/smartbag.ts` — made `maps` field optional in `MQTTLocationPayload`

### Key Architecture
- Safe zones stored at `child/safeZones` (object map), read back as array via `Object.entries().map()`
- Profile data at `users/default` — single default user (no auth)
- Clear operations: `set(ref(database, path), null)` on the entire path
- Delete confirmation modals: consistent pattern (fixed overlay, centered card, bg-[#1E293B])
- Profile/Notification panels use inline `style={{ backgroundColor: '#1E293B' }}` for full opacity (no tailwind bg class)
- `npm run build` passes clean

### Next Time
- Deploy: fill real Firebase env vars in `.env.local` (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId)
- Ensure Firebase Realtime DB rules allow read/write to `/child/*` and `/users/default`
- Test end-to-end with ESP32 hardware: MQTT → Firebase bridge, listener updates, clear operations
- Consider `listenHistory` data visualization on route-history page (show Firebase points on map instead of demo routes)
